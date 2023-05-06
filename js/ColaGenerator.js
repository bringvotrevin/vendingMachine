// import ColaList from "./ColaList.js";
// import util from "./utils/util";

export default class ColaGenerator {
	constructor() {
		this.$merchandise = document.querySelector('.merchandise-wrapper');
	}

	generate(cola) {
		// NOTE cola 변수 저장?
		// this.cola = cola;
		this.addColaLi(cola);
		
	}

	async addColaLi(cola) {
		// console.log(cola.getList);
		const fragment = document.createDocumentFragment();
		cola.getList.forEach((cur, i) => {
			const li = document.createElement('li');
			li.className = 'product';
			li.dataset.name = cur.name;
			li.innerHTML = `
        <div class="sold-out a11y-hidden"><strong>품절</strong></div>
        <img src="./img/${cur.img}" alt="${cur.name}" />
        <p class="product-name">${cur.name}</p>
        <p class="product-cost">${cur.cost + '원'}</p>
			`
			fragment.appendChild(li);
		})
		this.$merchandise.appendChild(fragment);
	}

	
}