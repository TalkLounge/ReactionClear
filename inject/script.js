browser.storage.sync.get(["searchTerms"], function(data) {
	if (typeof(data) === "undefined" || typeof(data["searchTerms"]) === "undefined")  {
		//return;
	}
	var searchTerms = [{"block": {"title": "Reaktion"}}, {"block": {"title": "reagiert"}}, {"block": {"title": "reagiere"}}, {"block": {"title": "reaction"}}, {"block": {"title": "reacts"}}, {"block": {"title": "ungeklickt"}}, {"block": {"channel": "Hochformat"}}, {"block": {"channel": "ConCrafter"}}, {"block": {"channel": "JAUSE"}}];//data["searchTerms"];
	// {{"block": {"channel": "unge", "title": "ungeklickt"}, "exclude": [{"channel": "unge", "title": "ungeklickt"}]}}
	
	/*
	block.channel & block.title = exclude.title
	block.title = exclude.channel | exclude.title
	block.channel = exclude.title
	*/
	
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	var count = {"youtubeStartpage": 0, "youtubeRecommended": 0};
	
	async function youtubeClear(elemList, title1, title2, channel1, channel2, elem1, elem2, countName) {
		elemList = $(elemList).length;
		for (var i = count[countName] + 1; i <= elemList; i++) {
			var titleCc = $(title1 + i + title2).html();
			var channelCc = $(channel1 + i + channel2).html();
			if (titleCc && channelCc) {
				titleCc = titleCc.trim();
				channelCc = channelCc.trim();
				var title = titleCc.toLowerCase();
				var channel = channelCc.toLowerCase();
				var found = false;
				for (var j = 0; j < searchTerms.length; j++) {
					var searchTerm = searchTerms[j];
					var block = searchTerm["block"] || {};
					var exclude = searchTerm["exclude"] || {};
					if (block["channel"] && block["channel"].toLowerCase() === channel && block["title"] && title.indexOf(block["title"].toLowerCase()) !== -1) {
						found = true;
						for (var k = 0; k < exclude.length; k++) {
							if (exclude[k]["title"] && title.indexOf(exclude[k]["title"].toLowerCase()) !== -1) {
								found = false;
								break;
							}
						}
					} else if (block["title"] && title.indexOf(block["title"].toLowerCase()) !== -1) {
						found = true;
						for (var k = 0; k < exclude.length; k++) {
							if ((exclude[k]["channel"] && channel === exclude[k]["channel"].toLowerCase()) || (exclude[k]["title"] && title.indexOf(exclude[k]["title"].toLowerCase()) !== -1)) {
								found = false;
								break;
							}
						}
					} else if (block["channel"] && block["channel"].toLowerCase() === channel) {
						found = true;
						for (var k = 0; k < exclude.length; k++) {
							if (exclude[k]["title"] && title.indexOf(exclude[k]["title"].toLowerCase()) !== -1) {
								found = false;
								break;
							}
						}
					}
					if (found) {
						$(elem1 + i + elem2).css("display", "none");
						console.log('[Addon] ReactionClear: Removed "'+ titleCc +'" from "'+ channelCc +'"');
						break;
					}
				}
			}
			await sleep(100);
		}
		count[countName] = elemList;
	}
	
	function youtubeStartpage() {
		youtubeClear('.style-scope.ytd-rich-grid-renderer', 'ytd-rich-item-renderer.ytd-rich-grid-renderer:nth-child(', ') > div:nth-child(1) > ytd-rich-grid-video-renderer:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(2) > yt-formatted-string:nth-child(1)', 'ytd-rich-item-renderer.ytd-rich-grid-renderer:nth-child(', ') > div:nth-child(1) > ytd-rich-grid-video-renderer:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > ytd-video-meta-block:nth-child(2) > div:nth-child(1) > div:nth-child(1) > ytd-channel-name:nth-child(1) > div:nth-child(1) > div:nth-child(1) > yt-formatted-string:nth-child(1) > a:nth-child(1)', 'ytd-rich-item-renderer.ytd-rich-grid-renderer:nth-child(', ')', "youtubeStartpage");
	}
	
	function youtubeRecommended() {
		youtubeClear('.style-scope.ytd-compact-video-renderer', 'ytd-compact-video-renderer.style-scope:nth-child(', ') > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > h3:nth-child(1) > span:nth-child(2)', 'ytd-compact-video-renderer.style-scope:nth-child(', ') > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > div:nth-child(2) > ytd-video-meta-block:nth-child(1) > div:nth-child(1) > div:nth-child(1) > ytd-channel-name:nth-child(1) > div:nth-child(1) > div:nth-child(1) > yt-formatted-string:nth-child(1)', 'ytd-compact-video-renderer.style-scope:nth-child(', ') > div:nth-child(1)', "youtubeRecommended");
	}
	
	function youtubeClearAll() {
		youtubeStartpage();
		youtubeRecommended();
	}
	
	setTimeout(youtubeClearAll, 1000);
	
	var oldHeight = $(document).height();
	$(document).scroll(function() {
		var newHeight = $(document).height();
		if (newHeight > oldHeight) {
			oldHeight = newHeight;
			setTimeout(youtubeClearAll, 1000);
		}
	});
	
	var oldURL = document.URL;
	function urlChanged() {
		var newURL = document.URL;
		if (newURL !== oldURL) {
			oldURL = newURL;
			count["youtubeStartpage"] = 0;
			count["youtubeRecommended"] = 0;
			setTimeout(youtubeClearAll, 1500);
		}
	}
	
	setInterval(urlChanged, 1000);
});