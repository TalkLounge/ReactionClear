var observerOptions = {"subtree": true, "childList": true, "attributes": true};
var observerNode = document.getElementsByTagName("ytd-page-manager")[0];
var list = []; /*[
	{"name": "Reactions",
	 "block": [
		 {"title": "Reaktion"},
		 {"title": "reagier"},
		 {"title": "reaction"},
		 {"title": "react"},
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
];*/

// Initialize list from storage
chrome.storage.sync.get(["list"], function(data) {
	if (data && data["list"]) {
		list = data["list"];
	}
});

// Update list on popup list change
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 1) {
		list = request.list;
	}
});

function searchList(title, channel) {
	var titleLow = tl(title);
	var channelLow = tl(channel);
	var found = false;
	
	for (var j = 0; j < list.length; j++) {
		var except = list[j]["except"] || {};
		for (var l = 0; l < (list[j]["block"] || {}).length; l++) {
			var block = list[j]["block"][l];
			if (block["channel"] && tl(block["channel"]) === channelLow && block["title"] && titleLow.indexOf(tl(block["title"])) !== -1) {
				found = true;
				for (var k = 0; k < except.length; k++) {
					if (except[k]["title"] && titleLow.indexOf(tl(except[k]["title"])) !== -1) {
						found = false;
						break;
					}
				}
			} else if (block["title"] && titleLow.indexOf(tl(block["title"])) !== -1) {
				found = true;
				for (var k = 0; k < except.length; k++) {
					if ((except[k]["channel"] && channelLow === tl(except[k]["channel"])) || (except[k]["title"] && titleLow.indexOf(tl(except[k]["title"])) !== -1)) {
						found = false;
						break;
					}
				}
			} else if (block["channel"] && tl(block["channel"]) === channelLow) {
				found = true;
				for (var k = 0; k < except.length; k++) {
					if (except[k]["title"] && titleLow.indexOf(tl(except[k]["title"])) !== -1) {
						found = false;
						break;
					}
				}
			}
			if (found) {
				return true;
			}
		}
	}
}

// YouTube Startpage
var observerStartpage = new MutationObserver(function(mutationsList, observer) {
	for(var mutation of mutationsList) {
		// Page initialize load
		if (mutation.type === "childList") {
			for(var node of mutation.addedNodes.values()) {
				if (node.nodeName.toLowerCase() === "ytd-thumbnail-overlay-now-playing-renderer") {
					var title = $(node).parents("#dismissable").first().find("#video-title").text().trim();
					var channel = $(node).parents("#dismissable").first().find("#text").text().trim();
					if (searchList(title, channel)) {
						$(node).parents("ytd-rich-item-renderer").css("display", "none");
						print("Startpage", "Removed: %s from %s".format(title, channel));
					}
					break;
				}
			}
		//Page refresh load
		} else if (mutation.type === "attributes" && mutation.attributeName === "src" && mutation.target.nodeName.toLowerCase() === "img") {
			var node = mutation.target;
			var title = $(node).parents("#dismissable").first().find("#video-title").text().trim();
			var channel = $(node).parents("#dismissable").first().find("#text").text().trim();
			if (searchList(title, channel)) {
				$(node).parents("ytd-rich-item-renderer").css("display", "none");
				print("Startpage2", "Removed: %s from %s".format(title, channel));
			} else {
				$(node).parents("ytd-rich-item-renderer").css("display", "");
			}
		}
	}
});

// YouTube Recommended
var observerRecommended = new MutationObserver(function(mutationsList, observer) {
	for(var mutation of mutationsList) {
		// Page initialize load
		if (mutation.type === "childList") {
			for(var node of mutation.addedNodes.values()) {
				if (node.nodeName.toLowerCase() === "ytd-thumbnail-overlay-now-playing-renderer") {
					var title = $(node).parents("#dismissable").first().find("#video-title").text().trim();
					var channel = $(node).parents("#dismissable").first().find("#text").text().trim();
					if (searchList(title, channel)) {
						$(node).parents("ytd-compact-video-renderer").css("display", "none");
						print("Recommended", "Removed: %s from %s".format(title, channel));
					}
					break;
				}
			}
		//Page refresh load
		} else if (mutation.type === "attributes") {
			var node = mutation.target;
			var title = $(node).parents("#dismissable").first().find("#video-title").text().trim();
			var channel = $(node).parents("#dismissable").first().find("#text").text().trim();
			if (searchList(title, channel)) {
				$(node).parents("ytd-compact-video-renderer").css("display", "none");
				print("Recommended2", "Removed: %s from %s".format(title, channel));
			} else {
				$(node).parents("ytd-compact-video-renderer").css("display", "");
			}
		}
	}
});

observerStartpage.observe(observerNode, observerOptions);
observerRecommended.observe(observerNode, observerOptions);