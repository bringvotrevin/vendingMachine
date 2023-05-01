export default class ColaList {
	constructor() {
	}

	getColaList() {
		return this.colaList;
	}

	getLength() {
		return this.colaList.length;
	}

	async setColaList(resource) {
		try {
			const response = await fetch(resource);
			if (!response.ok)	throw new Error(`response status : ${response.status}`);
			this.colaList = await response.json();
		} catch(e) {
			console.log(e);
		}
	}
}
