var searchTerms = [
	{"name": "Reactions",
	 "block": [
		 {"title": "Reaktion"},
		 {"title": "reagiert"},
		 {"title": "reagiere"},
		 {"title": "reaction"},
		 {"title": "reacts"},
		 {"title": "ungeklickt"},
		 {"channel": "KuchenTV Uncut"},
		 {"channel": "Mehr Anzeigen"}
	 ], "except": [
		 {"title": "Reved"}
	]}, {"name": "Luca",
		 "block": [
			 {"channel": "Luca"}
	]}, {"name": "Hochformat",
		 "block": [
			 {"channel": "Hochformat"}
	]}, {"name": "JAUSE",
		 "block": [
			 {"channel": "JAUSE"}
	]}, {"block": [
			 {"channel": "Die Crew"},
			 {"channel": "Richtiger Kevin"},
			 {"channel": "SpontanaBlack"}
	]}
];


function getSearchTerms() {
	chrome.storage.sync.get(["searchTerms"], function(data) {
		if (typeof(data) !== "undefined" && typeof(data["searchTerms"]) !== "undefined")  {
			searchTerms = data["searchTerms"];
		}
	});
}

getSearchTerms();


// Source: https://stackoverflow.com/a/39914235
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Source: https://stackoverflow.com/a/31007976
String.prototype.format = function() {
	return [...arguments].reduce((p, c) => p.replace(/%s/, c), this);
}


class Page {
	constructor(name) {
		this.name = name;
	}
	
	print(output) {
		console.log("[ReactionClear]<%s>: %s".format(this.name, output));
	}
	
	async detectReload(that) {
		var detectorContent = $(that.detectorSelector).attr("href");
		if (that.detectorContent !== detectorContent) {
			that.print("Page reloaded");
			that.detectorContent = detectorContent;
			await sleep(1000);
			that.clearCount = 1;
			that.scrollPosition = 0;
			that.clearPage();
		}
	}
	
	startDetector(cssSelector) {
		this.detectorSelector = cssSelector;
		setInterval(this.detectReload, 1000, this);
	}
	
	async scroll(position) {
		if (this.scrollRuns) {
			return;
		}
		if ((this.scrollPosition || 0) < position) {
			this.scrollRuns = true;
			this.print("Scrolled down");
			this.scrollPosition = position;
			await sleep(1000);
			this.scrollRuns = false;
			this.clearPage();
		}
	}
	
	setClearOptions(options) {
		this.clearList = options["list"];
		this.clearElement = options["element"];
		this.clearTitle = options["title"];
		this.clearChannel = options["channel"];
		this.clearDelay = options["delay"];
	}
	
	async clearPage() {
		this.print("clearPage()");
		if (this.clearRuns) {
			return;
		}
		this.clearRuns = true;
		var list = $(this.clearList).length;
		this.print(list);
		for (var i = this.clearCount || 1; i <= list; i++) {
			await sleep(this.clearDelay || 100);
			this.print(i);
			var titleCc = $(this.clearList + this.clearElement.format(i) + this.clearTitle).html();
			var channelCc = $(this.clearList + this.clearElement.format(i) + this.clearChannel).html();
			if (titleCc && channelCc && $(this.clearList + this.clearElement.format(i)).css("display") !== "none") {
				titleCc = titleCc.trim();
				channelCc = channelCc.trim();
				var title = titleCc.toLowerCase();
				var channel = channelCc.toLowerCase();
				var found = false;
				searchTermsLoop:
				for (var j = 0; j < searchTerms.length; j++) {
					var except = searchTerms[j]["except"] || {};
					for (var l = 0; l < (searchTerms[j]["block"] || {}).length; l++) {
						var block = searchTerms[j]["block"][l];
						if (block["channel"] && block["channel"].toLowerCase() === channel && block["title"] && title.indexOf(block["title"].toLowerCase()) !== -1) {
							found = true;
							for (var k = 0; k < except.length; k++) {
								if (except[k]["title"] && title.indexOf(except[k]["title"].toLowerCase()) !== -1) {
									found = false;
									break;
								}
							}
						} else if (block["title"] && title.indexOf(block["title"].toLowerCase()) !== -1) {
							found = true;
							for (var k = 0; k < except.length; k++) {
								if ((except[k]["channel"] && channel === except[k]["channel"].toLowerCase()) || (except[k]["title"] && title.indexOf(except[k]["title"].toLowerCase()) !== -1)) {
									found = false;
									break;
								}
							}
						} else if (block["channel"] && block["channel"].toLowerCase() === channel) {
							found = true;
							for (var k = 0; k < except.length; k++) {
								if (except[k]["title"] && title.indexOf(except[k]["title"].toLowerCase()) !== -1) {
									found = false;
									break;
								}
							}
						}
						if (found) {
							$(this.clearList + this.clearElement.format(i)).css("display", "none");
							this.print("Removed: %s from %s".format(titleCc, channelCc));
							break searchTermsLoop;
						}
					}
				}
			} else if (! titleCc || ! channelCc) {
				if (! $(this.clearList + this.clearElement.format(i + 1) + this.clearTitle).html()) {
					this.print("Title not found");
					console.log({"i": i,
								 "elementString": this.clearList + this.clearElement.format(i),
								 "element": $(this.clearList + this.clearElement.format(i)),
								 "titleString": this.clearList + this.clearElement.format(i) + this.clearTitle,
								 "title": titleCc,
								 "channelString": this.clearList + this.clearElement.format(i) + this.clearChannel,
								 "channel": channelCc,
								 "nextString": this.clearList + this.clearElement.format(i + 1) + this.clearTitle,
								 "nextElement": $(this.clearList + this.clearElement.format(i + 1) + this.clearTitle),
								 "next": $(this.clearList + this.clearElement.format(i + 1) + this.clearTitle).html()});
					this.clearCount = i;
					this.clearRuns = false;
					return;
				} else {
					this.print("Title skiped");
					console.log({"i": i,
								 "elementString": this.clearList + this.clearElement.format(i),
								 "element": $(this.clearList + this.clearElement.format(i)),
								 "titleString": this.clearList + this.clearElement.format(i) + this.clearTitle,
								 "title": titleCc,
								 "channelString": this.clearList + this.clearElement.format(i) + this.clearChannel,
								 "channel": channelCc,
								 "nextString": this.clearList + this.clearElement.format(i + 1) + this.clearTitle,
								 "nextElement": $(this.clearList + this.clearElement.format(i + 1) + this.clearTitle),
								 "next": $(this.clearList + this.clearElement.format(i + 1) + this.clearTitle).html()});
				}
			}
		}
		this.clearCount = i;
		this.clearRuns = false;
	}
}


var ytStartpage = new Page("ytStartpage");
ytStartpage.startDetector('ytd-rich-item-renderer.ytd-rich-grid-renderer:nth-child(1) > div:nth-child(1) > ytd-rich-grid-video-renderer:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(2)');
ytStartpage.setClearOptions({"list": 'ytd-rich-item-renderer.ytd-rich-grid-renderer',
							 "element": ':nth-child(%s)',
							 "title": ' > div:nth-child(1) > ytd-rich-grid-video-renderer:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(2) > yt-formatted-string:nth-child(1)',
							 "channel": ' > div:nth-child(1) > ytd-rich-grid-video-renderer:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > ytd-video-meta-block:nth-child(2) > div:nth-child(1) > div:nth-child(1) > ytd-channel-name:nth-child(1) > div:nth-child(1) > div:nth-child(1) > yt-formatted-string:nth-child(1) > a:nth-child(1)',
							 "delay": 50});


var ytRecommended = new Page("ytRecommended");
ytRecommended.startDetector('ytd-compact-video-renderer.style-scope:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)');
ytRecommended.setClearOptions({"list": 'ytd-compact-video-renderer.style-scope',
							   "element": ':nth-child(%s)',
							   "title": ' > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > h3:nth-child(1) > span:nth-child(2)',
							   "channel": ' > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > div:nth-child(2) > ytd-video-meta-block:nth-child(1) > div:nth-child(1) > div:nth-child(1) > ytd-channel-name:nth-child(1) > div:nth-child(1) > div:nth-child(1) > yt-formatted-string:nth-child(1)',
							   "delay": 200});


$(document).on("scroll", function() {
	var position = $(document).scrollTop();
	ytStartpage.scroll(position);
	ytRecommended.scroll(position);
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 1) {
		searchTerms = request.searchTerms;
	}
});