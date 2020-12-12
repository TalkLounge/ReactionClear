// Source: https://stackoverflow.com/a/39914235
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Source: https://stackoverflow.com/a/31007976
String.prototype.format = function() {
	return [...arguments].reduce((p, c) => p.replace(/%s/, c), this);
}

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

function tl(text) {
	return text.trim().toLowerCase();
}

function print(type, output) {
	console.log("[ReactionClear]<%s>: %s".format(type, output));
}