const util = {
	addHiddenTitle(tag, text) {
		const title = document.createElement(tag);
		title.className = 'a11y-hidden';
		title.textContent = text;
		return title;
	},

	getNumber(node) {
		return parseInt(node.textContent.replaceAll(',', ''));
	},

	formatNumber(number) {
		return Intl.NumberFormat().format(number) + '원';
	}
}

export default util;