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

	formatMoney(money) {
		return Intl.NumberFormat().format(money) + ' 원';
	}
}

export default util;