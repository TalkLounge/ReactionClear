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

function copyJSON(json) {
	return JSON.parse(JSON.stringify(json));
}

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
	var rowCountBlock = -1;
	var rowCountExcept = -1;
	for (var i = 0; i < searchTerms.length; i++) {
		rowCountBlock++;
		rowCountExcept++;
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
		
		var tdBlock = {"class": "block"};
		if (except.length > 1 && block.length <= 1) {
			tdBlock["rowspan"] = except.length;
		}
		
		var tdExcept = {"class": "except"};
		if (block.length > 1 && except.length <= 1) {
			tdExcept["rowspan"] = block.length;
		}
		
		var tdBlockIcons = copyJSON(tdBlock);
		tdBlockIcons["data-row"] = rowCountBlock;
		tdBlockIcons["data-type"] = "block";
		tdBlockIcons["data-typeid"] = 0;
		
		var tdExceptIcons = copyJSON(tdExcept);
		tdExceptIcons["data-row"] = rowCountExcept;
		tdExceptIcons["data-type"] = "except";
		tdExceptIcons["data-typeid"] = 0;
		
		tbody += newElement("tr", {"data-id": i},
							newElement("td", tdOuter, name) +
							newElement("td", tdBlock, block[0] ? block[0]["channel"] || "" : "") +
							newElement("td", tdBlock, block[0] ? block[0]["title"] || "" : "") +
							newElement("td", tdBlockIcons,
									   newElement("span", {"class": "iconEdit"}, "&#x270F") +
									   newElement("span", {"class": "iconAdd"}, "&#x2795") +
									   newElement("span", {"class": "iconSave noneDisplay"}, "&#x2714") +
									   newElement("span", {"class": "iconDelete noneDisplay"}, "&#x274c")) +
							newElement("td", tdExcept, except[0] ? except[0]["channel"] || "" : "") +
							newElement("td", tdExcept, except[0] ? except[0]["title"] || "" : "") +
							newElement("td", tdExceptIcons,
									   newElement("span", {"class": "iconEdit"}, "&#x270F") +
									   newElement("span", {"class": "iconAdd"}, "&#x2795") +
									   newElement("span", {"class": "iconSave noneDisplay"}, "&#x2714") +
									   newElement("span", {"class": "iconDelete noneDisplay"}, "&#x274c")) +
							newElement("td", tdOuter,
									   newElement("span", {"class": "iconEdit"}, "&#x270F") +
									   newElement("span", {"class": "iconAdd"}, "&#x2795") +
									   newElement("span", {"class": "iconSave noneDisplay"}, "&#x2714") +
									   newElement("span", {"class": "iconDelete noneDisplay"}, "&#x274c")));
		
		for (var j = 1; j < rowspan; j++) {
			if (block[j]) {
				rowCountBlock++;
			}
			
			if (except[j]) {
				rowCountExcept++;
			}
			
			tdBlock = {"class": "block"};
			if (j === block.length - 1 && except.length > block.length) {
				tdBlock["rowspan"] = except.length - block.length + 1;
			}
			
			tdExcept = {"class": "except"};
			if (j === except.length - 1 && block.length > except.length) {
				tdExcept["rowspan"] = block.length - except.length + 1;
			}
			
			tdBlockIcons = copyJSON(tdBlock);
			tdBlockIcons["data-row"] = rowCountBlock;
			tdBlockIcons["data-type"] = "block";
			tdBlockIcons["data-typeid"] = j;
			
			tdExceptIcons = copyJSON(tdExcept);
			tdExceptIcons["data-row"] = rowCountExcept;
			tdExceptIcons["data-type"] = "except";
			tdExceptIcons["data-typeid"] = j;
			
			tbody += newElement("tr", {"data-id": i},
								(block[j] ? newElement("td", tdBlock, block[j]["channel"] || "") : "") +
								(block[j] ? newElement("td", tdBlock, block[j]["title"] || "") : "") +
								(block[j] ? newElement("td", tdBlockIcons,
													   newElement("span", {"class": "iconEdit"}, "&#x270F") +
													   newElement("span", {"class": "iconAdd"}, "&#x2795") +
													   newElement("span", {"class": "iconSave noneDisplay"}, "&#x2714") +
													   newElement("span", {"class": "iconDelete noneDisplay"}, "&#x274c")) : "") +
								(except[j] ? newElement("td", tdExcept, except[j]["channel"] || "") : "") +
								(except[j] ? newElement("td", tdExcept, except[j]["title"] || "") : "") +
								(except[j] ? newElement("td", tdExceptIcons,
														newElement("span", {"class": "iconEdit"}, "&#x270F") +
														newElement("span", {"class": "iconAdd"}, "&#x2795") +
														newElement("span", {"class": "iconSave noneDisplay"}, "&#x2714") +
														newElement("span", {"class": "iconDelete noneDisplay"}, "&#x274c")) : ""));
		}
	}
	
	if (! searchTerms.length) {
		searchTerms[0] = {"block": [{}], "except": [{}]};
		tbody += newElement("tr", {"data-id": 0},
							newElement("td") +
							newElement("td", {"class": "block"}) +
							newElement("td", {"class": "block"}) +
							newElement("td", {"data-type": "block", "data-typeid": 0},
									   newElement("span", {"class": "iconEdit"}, "&#x270F") +
									   newElement("span", {"class": "iconAdd"}, "&#x2795") +
									   newElement("span", {"class": "iconSave noneDisplay"}, "&#x2714") +
									   newElement("span", {"class": "iconDelete noneDisplay"}, "&#x274c")) +
							newElement("td", {"class": "except"}) +
							newElement("td", {"class": "except"}) +
							newElement("td", {"data-type": "except", "data-typeid": 0},
									   newElement("span", {"class": "iconEdit"}, "&#x270F") +
									   newElement("span", {"class": "iconAdd"}, "&#x2795") +
									   newElement("span", {"class": "iconSave noneDisplay"}, "&#x2714") +
									   newElement("span", {"class": "iconDelete noneDisplay"}, "&#x274c")) +
							newElement("td", null,
									   newElement("span", {"class": "iconEdit"}, "&#x270F") +
									   newElement("span", {"class": "iconAdd"}, "&#x2795") +
									   newElement("span", {"class": "iconSave noneDisplay"}, "&#x2714") +
									   newElement("span", {"class": "iconDelete noneDisplay"}, "&#x274c")));
	}
	
	$("tbody").empty();
	$("tbody").append(tbody);
	
	$(".iconEdit").click(function() {
		var span = $(this);
		var td = span.parent();
		var tr = td.parent();
		
		var dataType = td.data("type");
		var dataTypeId = td.data("typeid");
		if (typeof(dataType) === "undefined") {
			var name = tr.find("td").eq(0);
			name.toggleClass("no-padding");
			name.html('<input type="text" class="form-control text-center inputs" value="'+ name.html() +'">');
		} else {
			var channel = tr.find("td."+ dataType).eq(0);
			
			var klass = "no-padding"
			if (typeof(channel.attr("rowspan")) === "undefined") {
				klass += " align-middle";
			}
			
			channel.toggleClass(klass);
			channel.html('<input type="text" class="form-control text-center inputs" value="'+ channel.html() +'">');
			
			var title = tr.find("td."+ dataType).eq(1);
			title.toggleClass(klass);
			title.html('<input type="text" class="form-control text-center inputs" value="'+ title.html() +'">');
		}
		
		td.find("span").eq(0).toggleClass("noneDisplay");
		td.find("span").eq(1).toggleClass("noneDisplay");
		td.find("span").eq(2).toggleClass("noneDisplay");
		td.find("span").eq(3).toggleClass("noneDisplay");
	});
	$(".iconSave").click(function() {
		var span = $(this);
		var td = span.parent();
		var tr = td.parent();
		
		var dataType = td.data("type");
		var dataTypeId = td.data("typeid");
		var dataId = tr.data("id");
		if (typeof(dataType) === "undefined") {
			var name = tr.find("td").eq(0);
			var input = name.find("input").eq(0).val().trim();
			
			name.toggleClass("no-padding");
			name.html(input);
			
			if (input.length > 0) {
				searchTerms[dataId]["name"] = input;
			} else {
				delete searchTerms[dataId]["name"];
			}
			
			chrome.storage.sync.set({"searchTerms": searchTerms});
			chrome.runtime.sendMessage({"action": 1, "searchTerms": searchTerms});
		} else {
			var channel = tr.find("td."+ dataType).eq(0);
			var channelInput = channel.find("input").eq(0).val().trim();
			
			var title = tr.find("td."+ dataType).eq(1);
			var titleInput = title.find("input").eq(0).val().trim();
			
			var klass = "no-padding"
			if (typeof(channel.attr("rowspan")) === "undefined") {
				klass += " align-middle";
			}
			
			channel.toggleClass(klass);
			channel.html(channelInput);
			
			title.toggleClass(klass);
			title.html(titleInput);
			
			if (typeof(searchTerms[dataId][dataType]) === "undefined") {
				searchTerms[dataId][dataType] = [];
			}
			
			searchTerms[dataId][dataType][dataTypeId] = {"channel": channelInput, "title": titleInput};
			chrome.storage.sync.set({"searchTerms": searchTerms});
			chrome.runtime.sendMessage({"action": 1, "searchTerms": searchTerms});
		}
		td.find("span").eq(0).toggleClass("noneDisplay");
		td.find("span").eq(1).toggleClass("noneDisplay");
		td.find("span").eq(2).toggleClass("noneDisplay");
		td.find("span").eq(3).toggleClass("noneDisplay");
	});
	$(".iconDelete").click(function() {
		var span = $(this);
		var td = span.parent();
		var tr = td.parent();
		
		var dataType = td.data("type");
		var dataTypeId = td.data("typeid");
		var dataId = tr.data("id");
		if (typeof(dataType) === "undefined") {
			searchTerms.splice(dataId, 1);
			
			chrome.storage.sync.set({"searchTerms": searchTerms});
			chrome.runtime.sendMessage({"action": 1, "searchTerms": searchTerms});
		} else {
			if (typeof(searchTerms[dataId][dataType]) === "undefined") {
				searchTerms[dataId][dataType] = [];
			}
			
			searchTerms[dataId][dataType].splice(dataTypeId, 1);
			if (! searchTerms[dataId][dataType].length) {
				delete searchTerms[dataId][dataType];
			}
			
			chrome.storage.sync.set({"searchTerms": searchTerms});
			chrome.runtime.sendMessage({"action": 1, "searchTerms": searchTerms});
		}
		generateTable();
	});
	$(".iconAdd").click(function() {
		var span = $(this);
		var td = span.parent();
		var tr = td.parent();
		
		var dataType = td.data("type");
		var dataTypeId = td.data("typeid");
		var dataId = tr.data("id");
		if (typeof(dataType) === "undefined") {
			searchTerms.splice(dataId + 1, 0, {});
		} else {
			if (typeof(searchTerms[dataId][dataType]) === "undefined") {
				searchTerms[dataId][dataType] = [{}];
			}
			
			searchTerms[dataId][dataType].splice(dataTypeId + 1, 0, {});
		}
		generateTable();
	});
}

function getSearchTerms() {
	chrome.storage.sync.get(["searchTerms"], function(data) {
		if (typeof(data) !== "undefined" && typeof(data["searchTerms"]) !== "undefined")  {
			searchTerms = data["searchTerms"];
			
			for (var i = 0; i < searchTerms.length; i++) {
				if (searchTerms[i]["block"]) {
					for (var j = 0; j < searchTerms[i]["block"].length; j++) {
						if (! searchTerms[i]["block"][j]["channel"]) {
							delete searchTerms[i]["block"][j]["channel"];
						}
						if (! searchTerms[i]["block"][j]["title"]) {
							delete searchTerms[i]["block"][j]["title"];
						}
						if (! searchTerms[i]["block"][j]["channel"] && ! searchTerms[i]["block"][j]["title"]) {
							searchTerms[i]["block"].splice(j, 1);
							j--;
						}
					}
					if (! searchTerms[i]["block"].length) {
						delete searchTerms[i]["block"];
					}
				}
				if (searchTerms[i]["except"]) {
					for (var j = 0; j < searchTerms[i]["except"].length; j++) {
						if (! searchTerms[i]["except"][j]["channel"]) {
							delete searchTerms[i]["except"][j]["channel"];
						}
						if (! searchTerms[i]["except"][j]["title"]) {
							delete searchTerms[i]["except"][j]["title"];
						}
						if (! searchTerms[i]["except"][j]["channel"] && ! searchTerms[i]["except"][j]["title"]) {
							searchTerms[i]["except"].splice(j, 1);
							j--;
						}
					}
					if (! searchTerms[i]["except"].length) {
						delete searchTerms[i]["except"];
					}
				}
				if (! searchTerms[i]["block"] && ! searchTerms[i]["except"]) {
					searchTerms.splice(i, 1);
					i--;
				}
			}
			
			chrome.storage.sync.set({"searchTerms": searchTerms});
			chrome.runtime.sendMessage({"action": 1, "searchTerms": searchTerms});
		}
		generateTable();
	});
}

getSearchTerms();