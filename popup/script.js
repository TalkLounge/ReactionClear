var popup;
var list = [];/*[{"desc": "Reactions", "block": [
				{"title": "Reaktion"},
				{"title": "reagier"},
				{"title": "react"},
				{"title": "ungeklickt"},
				{"channel": "KuchenTV Uncut"},
				{"channel": "Mehr Anzeigen"}]},
			{"desc": "ConCrafter", "block": [
				{"channel": "Luca"},
				{"channel": "LUCREW"}]},
			{"desc": "Hochformat", "block": [
				{"channel": "Hochformat"}]},
			{"desc": "JAUSE", "block": [
				{"channel": "JAUSE"}]},
			{"desc": "Mois", "block": [
				{"channel": "Mois"}]},
			{"desc": "Monte", "block": [
				{"channel": "Die Crew"},
				{"channel": "Richtiger Kevin"},
				{"channel": "SpontanaBlack"}]},
			{"desc": "Fake", "block": [
				{"channel": "BILD"},
				{"channel": "RT Deutsch"},
				{"channel": "Late Night Berlin"},
				{"channel": "Joko & Klaas"}]},
			{"desc": "ASMR", "block": [
				{"channel": "ASMR Janina"}]},
			{"desc": "Trash", "block": [
				{"channel": "Galileo"},
				{"channel": "taff"},
				{"channel": "Promiflash"}]},
			{"desc": "Tourette", "block": [
				{"channel": "Gewitter im Kopf"},
				{"channel": "Gewitter im Stream"}]},
			{"desc": "orangemorange", "block": [
				{"channel": "orangemorange"}]},
			{"desc": "cengo", "block": [
				{"channel": "cengo"}]},
			{"desc": "Master Your Mind", "block": [
				{"channel": "Master Your Mind"}]},
			{"desc": "Musik", "block": [
				{"title": "Capital Bra"}],
			 				  "except": [
				{"channel": "Trap Nation"},
				{"title": "RIN"},
				{"title": "LEA"}]},
			{"desc": "Autorennen", "block": [
				{"channel": "Felix von der Laden"}]}];*/

function newElement(tagName, attributes, content) {
	var tag = document.createElement(tagName);
	for (var key in attributes || {}) {
		if (attributes[key] !== undefined || attributes[key] !== null) {
			tag.setAttribute(key, attributes[key]);
		}
	}
	tag.innerHTML = content || "";
	return tag.outerHTML;
}

function renderTable() {
	$("tbody").empty();
	
	for (var i = 0; i < (list.length || 1); i++) {
		var listItem = list[i] || {};
		
		var blockLength = listItem.block ? listItem.block.length : 1;
		var exceptLength = listItem.except ? listItem.except.length : 1;
		var maxItems = blockLength > exceptLength ? blockLength : exceptLength;
		
		for (var j = 0; j < maxItems; j++) {
			var htmlContent = "";
			
			if (j === 0) {
				htmlContent += newElement("td", {"rowspan": maxItems, "contenteditable": true, "data-col": 0, "data-listindex": i, "data-type": 0}, listItem.desc);
			}
			
			if ((listItem.block && listItem.block[j]) || j === 0) {
				var rowspan = null;
				
				if (blockLength - 1 === j && blockLength < exceptLength) {
					rowspan = exceptLength - blockLength + 1;
				}
				
				htmlContent += newElement("td", {"rowspan": rowspan, "contenteditable": true, "data-col": 1, "data-listindex": i, "data-type": 1, "data-typeindex": j, "data-typetype": 0}, (listItem.block && listItem.block[j]) ? listItem.block[j].channel : null);
				htmlContent += newElement("td", {"rowspan": rowspan, "contenteditable": true, "data-col": 2, "data-listindex": i, "data-type": 1, "data-typeindex": j, "data-typetype": 1}, (listItem.block && listItem.block[j]) ? listItem.block[j].title : null);
			}
			
			if ((listItem.except && listItem.except[j]) || j === 0) {
				var rowspan = null;
				
				if (exceptLength - 1 === j && exceptLength < blockLength) {
					rowspan = blockLength - exceptLength + 1;
				}
				
				htmlContent += newElement("td", {"rowspan": rowspan, "contenteditable": true, "data-col": 3, "data-listindex": i, "data-type": 2, "data-typeindex": j, "data-typetype": 0}, (listItem.except && listItem.except[j]) ? listItem.except[j].channel : null);
				htmlContent += newElement("td", {"rowspan": rowspan, "contenteditable": true, "data-col": 4, "data-listindex": i, "data-type": 2, "data-typeindex": j, "data-typetype": 1}, (listItem.except && listItem.except[j]) ? listItem.except[j].title : null);
			}
			
			$("tbody").append(newElement("tr", null, htmlContent));
		}
	}
	
	$("td").click(function() {
		if (popup) {
			popup.destroy();
		}

		var content = "";
		
		if ($(this).data("col") === 1 || $(this).data("col") === 2) {
			content += newElement("span", {"data-listindex": $(this).data("listindex"), "data-type": $(this).data("type"), "data-typeindex": $(this).data("typeindex"), "data-action": 0}, "Add Block");
			content += newElement("br");
			content += newElement("span", {"data-listindex": $(this).data("listindex"), "data-type": $(this).data("type"), "data-typeindex": $(this).data("typeindex"), "data-action": 1}, "Delete Block");
			content += newElement("br");
			content += newElement("br");
		} else if ($(this).data("col") === 3 || $(this).data("col") === 4) {
			content += newElement("span", {"data-listindex": $(this).data("listindex"), "data-type": $(this).data("type"), "data-typeindex": $(this).data("typeindex"), "data-action": 0}, "Add Exception");
			content += newElement("br");
			content += newElement("span", {"data-listindex": $(this).data("listindex"), "data-type": $(this).data("type"), "data-typeindex": $(this).data("typeindex"), "data-action": 1}, "Delete Exception");
			content += newElement("br");
			content += newElement("br");
		}
		
		content += newElement("span", {"data-listindex": $(this).data("listindex"), "data-type": 0, "data-action": 0}, "Add Row");
		content += newElement("br");
		content += newElement("span", {"data-listindex": $(this).data("listindex"), "data-type": 0, "data-action": 1}, "Delete Row");

		popup = tippy(this, {
			content: content,
			interactive: true,
			placement: "bottom",
			interactiveBorder: 30,
			allowHTML: true,
			showOnCreate: true,
		});

		$("span").click(function() {
			var listindex = $(this).data("listindex");
			var typeindex = $(this).data("typeindex");
			var type = $(this).data("type");
			var action = $(this).data("action");
			
			if (type === 0) {
				if (action === 0) {
					list.splice(listindex + 1, action, {});
				} else if (action === 1) {
					list.splice(listindex, action);
				}
			} else if (type === 1) {
				if (action === 0) {
					if (! list[listindex].block) {
						list[listindex].block = [];
					}
					list[listindex].block.splice(typeindex + 1, action, {});
				} else if (action === 1 && list[listindex].block) {
					list[listindex].block.splice(typeindex, action);
				}
			} else if (type === 2) {
				if (action === 0) {
					if (! list[listindex].except) {
						list[listindex].except = [];
					}
					list[listindex].except.splice(typeindex + 1, action, {});
				} else if (action === 1 && list[listindex].except) {
					list[listindex].except.splice(typeindex, action);
				}
			}
			
			chrome.storage.sync.set({"list": list});
			renderTable();
		});
	});
	
	$("td").bind("input", function() {
		var listindex = $(this).data("listindex");
		var typeindex = $(this).data("typeindex");
		var type = $(this).data("type");
		var typetype = $(this).data("typetype");
		
		var input = $(this).text();
		
		if (! list[listindex]) {
			list[listindex] = {};
		}
		
		if (type === 0) {
			if (input.length > 0) {
				list[listindex].desc = input;
			} else {
				list[listindex].desc = null;
			}
		} else if (type === 1) {
			if (! list[listindex].block) {
				list[listindex].block = [];
			}
			
			if (! list[listindex].block[typeindex]) {
				list[listindex].block[typeindex] = {};
			}
			
			if (input.length > 0) {
				if (typetype === 0) {
					list[listindex].block[typeindex].channel = input;
				} else if (typetype === 1) {
					list[listindex].block[typeindex].title = input;
				}
			} else {
				if (typetype === 0) {
					list[listindex].block[typeindex].channel = null;
				} else if (typetype === 1) {
					list[listindex].block[typeindex].title = null;
				}
			}
		} else if (type === 2) {
			if (! list[listindex].except) {
				list[listindex].except = [];
			}
			
			if (! list[listindex].except[typeindex]) {
				list[listindex].except[typeindex] = {};
			}
			
			if (input.length > 0) {
				if (typetype === 0) {
					list[listindex].except[typeindex].channel = input;
				} else if (typetype === 1) {
					list[listindex].except[typeindex].title = input;
				}
			} else {
				if (typetype === 0) {
					list[listindex].except[typeindex].channel = null;
				} else if (typetype === 1) {
					list[listindex].except[typeindex].title = null;
				}
			}
		}
		
		chrome.storage.sync.set({"list": list});
    });
}

chrome.storage.sync.get(["list"], function(data) {
	if (data && data["list"]) {
		list = data["list"];
	}
	renderTable();
});

chrome.storage.sync.set({"searchTerms": null}); //Legacy