if (typeof disabledWords == "undefined") {
	console.log("ReactionClear: Loaded");
	var disabledWords = ["reaktion", "reagiert", "reagieren", "reaction", "reacts", "ungeklickt"];

	function youtubeStartpage() {
		for (var i = 1; i <= document.getElementsByClassName('style-scope ytd-rich-grid-renderer').length; i++) {
			var title = $('ytd-rich-item-renderer.ytd-rich-grid-renderer:nth-child('+ i +') > div:nth-child(1) > ytd-rich-grid-video-renderer:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(2) > yt-formatted-string:nth-child(1)');
			if (title !== null && typeof title !== "undefined") {
				title = title[0];
				if (title !== null && typeof title !== "undefined") {
					title = title.textContent;
					if (typeof title === "string") {
						title = title.toLowerCase();
						for (var j = 0; j < disabledWords.length; j++) {
							if (title.indexOf(disabledWords[j]) !== -1) {
								$('ytd-rich-item-renderer.ytd-rich-grid-renderer:nth-child('+ i +')')[0].style.display = "none";
								console.log("ReactionClear: Removed: "+ title.trim());
								break;
							}
						}
					}
				}
			}
		}
	}

	function youtubeRecommended() {
		for (var i = 1; i <= document.getElementsByClassName('style-scope ytd-watch-next-secondary-results-renderer').length; i++) {
			var title = $('ytd-compact-video-renderer.style-scope:nth-child('+ i +') > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > h3:nth-child(1) > span:nth-child(2)');
			if (title !== null && typeof title !== "undefined") {
				title = title[0];
				if (title !== null && typeof title !== "undefined") {
					title = title.textContent;
					if (typeof title === "string") {
						title = title.toLowerCase();
						for (var j = 0; j < disabledWords.length; j++) {
							if (title.indexOf(disabledWords[j]) !== -1) {
								$('ytd-compact-video-renderer.style-scope:nth-child('+ i +')')[0].style.display = "none";
								console.log("ReactionClear: Removed: "+ title.trim());
								break;
							}
						}
					}
				}
			}
		}
	}

	function youtubeClear() {
		youtubeStartpage();
		youtubeRecommended();
	}

	setTimeout(youtubeClear, 1000);

	var lastHeight = document.documentElement.scrollHeight;
	var newHeight;
	(function run() {
		newHeight = document.documentElement.scrollHeight;
		if (lastHeight !== newHeight) {
			setTimeout(youtubeClear, 1000);
		}
		lastHeight = newHeight;
		if (document.body.onElementHeightChangeTimer) {
			clearTimeout(document.body.onElementHeightChangeTimer);
		}
		document.body.onElementHeightChangeTimer = setTimeout(run, 1000);
	})();
}

