// import ColaList from "./ColaList.js";

export default class ColaGenerator {
	constructor() {
		this.firstContainer = document.querySelector('.first-container');
	}

	generate(cola) {
		this.addColaLi(cola);
	}

	async addColaLi(cola) {
		// console.log(this.colaList.getColaList());
		const title = document.createElement('h2');
		cola.getColaList.forEach((cur, i) => {
			const fragment = document.createDocumentFragment();
		})
	}
}