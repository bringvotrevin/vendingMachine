const util = {
	addHiddenTitle(tag, text) {
		const title = document.createElement(tag);
		title.className = 'a11y-hidden';
		title.textContent = text;
		return title;
	}
}

export default util;