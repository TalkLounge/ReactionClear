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
	]}, {"name": "ConCrafter",
		 "block": [
			 {"channel": "ConCrafter"}
	]}, {"name": "Hochformat",
		 "block": [
			 {"channel": "Hochformat"}
	]}, {"name": "JAUSE",
		 "block": [
			 {"channel": "JAUSE"}
	]}, {"block": [
			 {"channel": "Die Crew"},
			 {"channel": "Richtiger Kevin"}
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

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

var running = {"youtubeStartpage": false, "youtubeRecommended": false};
var count = {"youtubeStartpage": 1, "youtubeRecommended": 1};

async function youtubeClear(elemList, title1, title2, channel1, channel2, elem1, elem2, countName, sleepMs) {
	if (running[countName]) {
		return;
	}
	running[countName] = true;
	elemList = $(elemList).length;
	for (var i = count[countName]; i <= elemList; i++) {
		await sleep(sleepMs);
		var titleCc = $(title1 + i + title2).html();
		var channelCc = $(channel1 + i + channel2).html();
		if (titleCc && channelCc && $(elem1 + i + elem2).css("display") !== "none") {
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
						$(elem1 + i + elem2).css("display", "none");
						console.log('[Addon] ReactionClear: Removed "'+ titleCc +'" from "'+ channelCc +'"');
						break searchTermsLoop;
					}
				}
			}
		} else if (! titleCc || ! channelCc) {
			if (! $(title1 + (i + 1) + title2).html()) {
				console.log(countName +" Title not found", i, title1 + i + title2, $(title1 + i + title2), titleCc, channelCc, $(title1 + (i + 1) + title2));
				count[countName] = i;
				running[countName] = false;
				return;
			} else {
				console.log(countName +" Title2 not found", i, title1 + i + title2, $(title1 + i + title2), titleCc, channelCc, $(title1 + (i + 1) + title2));
			}
		}
	}
	running[countName] = false;
}

function youtubeStartpage() {
	youtubeClear('.style-scope.ytd-rich-grid-renderer', 'ytd-rich-item-renderer.ytd-rich-grid-renderer:nth-child(', ') > div:nth-child(1) > ytd-rich-grid-video-renderer:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(2) > yt-formatted-string:nth-child(1)', 'ytd-rich-item-renderer.ytd-rich-grid-renderer:nth-child(', ') > div:nth-child(1) > ytd-rich-grid-video-renderer:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > ytd-video-meta-block:nth-child(2) > div:nth-child(1) > div:nth-child(1) > ytd-channel-name:nth-child(1) > div:nth-child(1) > div:nth-child(1) > yt-formatted-string:nth-child(1) > a:nth-child(1)', 'ytd-rich-item-renderer.ytd-rich-grid-renderer:nth-child(', ')', "youtubeStartpage", 50);
}

function youtubeRecommended() {
	youtubeClear('.style-scope.ytd-compact-video-renderer', 'ytd-compact-video-renderer.style-scope:nth-child(', ') > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > h3:nth-child(1) > span:nth-child(2)', 'ytd-compact-video-renderer.style-scope:nth-child(', ') > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > div:nth-child(2) > ytd-video-meta-block:nth-child(1) > div:nth-child(1) > div:nth-child(1) > ytd-channel-name:nth-child(1) > div:nth-child(1) > div:nth-child(1) > yt-formatted-string:nth-child(1)', 'ytd-compact-video-renderer.style-scope:nth-child(', ') > div:nth-child(1)', "youtubeRecommended", 200);
}

function youtubeClearAll() {
	console.log("youtubeClearAll called");
	youtubeStartpage();
	youtubeRecommended();
}

setTimeout(youtubeClearAll, 1000);

var runningScroll = false;
var oldScroll = $(document).scrollTop();
$(document).on("scroll", function() {
	var newScroll = $(document).scrollTop();
	if (newScroll > oldScroll && ! runningScroll) {
		oldScroll = newScroll;
		runningScroll = true;
		setTimeout(youtubeClearAll, 1000);
		setTimeout(function() {
			runningScroll = false;
		}, 500);
	}
});

var oldURL = document.URL;
function urlChanged() {
	var newURL = document.URL;
	if (newURL !== oldURL) {
		oldURL = newURL;
		oldScroll = $(document).scrollTop();
		count["youtubeStartpage"] = 1;
		count["youtubeRecommended"] = 1;
		setTimeout(youtubeClearAll, 1000);
	}
}

setInterval(urlChanged, 1000);

var listLength = {"youtubeStartpage": 0, "youtubeRecommended": 0};
function checkLength() {
	var youtubeStartpageLength = $('.style-scope.ytd-rich-grid-renderer').length;
	var youtubeRecommendedLength = $('.style-scope.ytd-compact-video-renderer').length;
	if (youtubeStartpageLength < listLength["youtubeStartpage"] || youtubeRecommendedLength < listLength["youtubeRecommended"]) {
		count["youtubeStartpage"] = 1;
		count["youtubeRecommended"] = 1;
		setTimeout(youtubeClearAll, 1000);
	}
	listLength["youtubeStartpage"] = youtubeStartpageLength;
	listLength["youtubeRecommended"] = youtubeRecommendedLength;
}

setInterval(checkLength, 1000);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 1) {
		searchTerms = request.searchTerms;
	}
});