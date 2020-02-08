var searchTerms = [
	{"name": "Reactions",
	 "block": [
		{"title": "Reaktion"},
		{"title": "reagiert"},
		{"title": "reagiere"},
		{"title": "reaction"},
		{"title": "reacts"},
		{"title": "ungeklickt"},
		{"channel": "KuchenTV Uncut"}
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
	]}
];

function newElement(tagName, attributes, content) {
	var tag = document.createElement(tagName);
	for (var key in attributes || {}) {
		tag.setAttribute(key, attributes[key]);
	}
	tag.innerHTML = content || "";
	return tag.outerHTML;
}

function generateTable() {
	var tbody = "";
	for (var i = 0; i < searchTerms.length; i++) {
		var searchTerm = searchTerms[i];
		var name = searchTerm["name"] || "";
		var block = searchTerm["block"] || [];
		var except = searchTerm["except"] || [];
		
		var tdOuter = {};
		var rowspan = Math.max(block.length, except.length);
		if (rowspan > 1) {
			tdOuter["rowspan"] = rowspan;
			tdOuter["class"] = "align-middle";
		}
		var tdBlock = {};
		if (except.length > 1 && block.length === 1) {
			tdBlock["rowspan"] = except.length;
		}
		var tdExcept = {};
		if (block.length > 1 && except.length === 1) {
			tdExcept["rowspan"] = block.length;
		}
		tbody += newElement("tr", null,
							newElement("td", tdOuter, name) +
							newElement("td", tdBlock, block[0] ? block[0]["channel"] || "" : "") +
							newElement("td", tdBlock, block[0] ? block[0]["title"] || "" : "") +
							newElement("td", tdBlock,
									   newElement("span", null, "&#x270F") +
									   newElement("span", {"class": "iconAdd"}, "&#x2795") +
									   newElement("span", {"class": "noneDisplay"}, "&#x2714") +
									   newElement("span", {"class": "noneDisplay"}, "&#x274c")) +
							newElement("td", tdExcept, except[0] ? except[0]["channel"] || "" : "") +
							newElement("td", tdExcept, except[0] ? except[0]["title"] || "" : "") +
							newElement("td", tdExcept,
									   newElement("span", null, "&#x270F") +
									   newElement("span", {"class": "iconAdd"}, "&#x2795") +
									   newElement("span", {"class": "noneDisplay"}, "&#x2714") +
									   newElement("span", {"class": "noneDisplay"}, "&#x274c")) +
							newElement("td", tdOuter,
									   newElement("span", null, "&#x270F") +
									   newElement("span", {"class": "iconAdd"}, "&#x2795") +
									   newElement("span", {"class": "noneDisplay"}, "&#x2714") +
									   newElement("span", {"class": "noneDisplay"}, "&#x274c")));
		
		for (var j = 1; j < rowspan; j++) {
			tdBlock = {};
			if (j === block.length && except.length > block.length) {
				tdBlock["rowspan"] = except.length - block.length + 1;
			}
			tdExcept = {};
			if (j === except.length && block.length > except.length) {
				tdExcept["rowspan"] = block.length - except.length + 1;
			}
			tbody += newElement("tr", null,
								(block[j] ? newElement("td", tdBlock, block[j]["channel"] || "") : "") +
								(block[j] ? newElement("td", tdBlock, block[j]["title"] || "") : "") +
								(block[j] ? newElement("td", tdBlock,
													   newElement("span", null, "&#x270F") +
													   newElement("span", {"class": "iconAdd"}, "&#x2795") +
													   newElement("span", {"class": "noneDisplay"}, "&#x2714") +
													   newElement("span", {"class": "noneDisplay"}, "&#x274c")) : "") +
								(except[j] ? newElement("td", tdExcept, except[j]["channel"] || "") : "") +
								(except[j] ? newElement("td", tdExcept, except[j]["title"] || "") : "") +
								(except[j] ? newElement("td", tdExcept,
														newElement("span", null, "&#x270F") +
														newElement("span", {"class": "iconAdd"}, "&#x2795") +
														newElement("span", {"class": "noneDisplay"}, "&#x2714") +
														newElement("span", {"class": "noneDisplay"}, "&#x274c")) : ""));
		}
	}
	
	$("tbody").empty();
	$("tbody").append(tbody);
}

function getSearchTerms() {
	browser.storage.sync.get(["searchTerms"], function(data) {
		if (typeof(data) !== "undefined" && typeof(data["searchTerms"]) !== "undefined")  {
			searchTerms = data["searchTerms"];
		}
		generateTable();
	});
}

getSearchTerms();