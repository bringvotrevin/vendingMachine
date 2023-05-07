import util from "./utils/util.js";

export default class VendingMachine {
	constructor(cola) {
		this.merchandiseContainer = document.querySelector('merchandise-wrapper');
		this.myAccount = document.querySelector('.wallet .money strong');
		this.inputBalance = document.querySelector('.balance .money');
		this.cart = document.querySelector('.order-list .product-in-cart');
		this.addDepositButtonEvent();
		this.addColaButtonEvent(cola);
		this.addReturnButtonEvent();
		this.addPurchaseButtonEvent();
	}

	deposit(event) {
		if (util.getNumber(this.myAccount) >= util.getNumber(event.target)) {
			this.inputBalance.textContent = util.formatMoney(util.getNumber(this.inputBalance) + util.getNumber(event.target));
			this.myAccount.textContent = util.formatMoney(util.getNumber(this.myAccount) - util.getNumber(event.target));
		} else {
			// TODO error처리
			alert('소지금이 부족합니다.');
		}
	}

	addDepositButtonEvent() {
		const btnHundred = document.querySelector('.btn-100');
		const btnFiveHundred = document.querySelector('.btn-500');
		const btnThousand = document.querySelector('.btn-1000');
		const btnFiveThousand = document.querySelector('.btn-5000');
		btnHundred.addEventListener('click', this.deposit.bind(this));
		btnFiveHundred.addEventListener('click', this.deposit.bind(this));
		btnThousand.addEventListener('click', this.deposit.bind(this));
		btnFiveThousand.addEventListener('click', this.deposit.bind(this));
	}

	checkBalance(merchandise) {
		const merchandiseCost = util.getNumber(merchandise.querySelector('.product-cost'));
		const currentBalance = util.getNumber(this.inputBalance);
		return currentBalance >= merchandiseCost ? true : false;
	}

	checkQuantity(merchandise, cola) {
		cola.getList.forEach((cur) => {
			if (cur.name === merchandise.dataset.name) return cur.count;
		})
	}

	addColaButtonEvent(cola) {
		const merchandiseList = document.querySelectorAll('.product');
		merchandiseList.forEach((merchandise) => {
			const curCola = cola.getDetail(merchandise.dataset.name);
			merchandise.addEventListener('click', () => {
				if (curCola.count === 0) {
					return ;
				}
				if (!this.checkBalance(merchandise)) {
					// TODO error처리
					alert('잔액이 적습니다.')
					return ;
				}

				// TODO 분리
				const liInCart = this.cart.querySelectorAll('li');
				// this.addList(liInCart, curCola);
				let isInCart = false;
				liInCart.forEach((li) => {
					if (li.dataset.name === curCola.name) {
						const quantity = li.querySelector('.product-quantity');
						quantity.textContent = parseInt(quantity.textContent) + 1;
						isInCart = true;
					}
				})
				if (isInCart === false) {
					const newLi = document.createElement('li');
					newLi.className = 'product';
					newLi.dataset.name = curCola.name;
					newLi.dataset.cost = curCola.cost;
					newLi.innerHTML = `
					<img src="img/${curCola.img}" alt="${curCola.name}" />
					<p class="product-name">${curCola.name}</p>
					<p class="product-quantity">1</p>
					`;
					this.cart.appendChild(newLi);
				}
				curCola.count--;
				this.inputBalance.textContent = util.formatMoney(util.getNumber(this.inputBalance) - curCola.cost);
				if (curCola.count === 0) {
					merchandise.classList.add('disabled');
					const soldOutDiv = merchandise.querySelector('.sold-out');
					soldOutDiv.classList.remove('a11y-hidden');
				}
			})
		})
	}

	addReturnButtonEvent() {
		const returnButton = document.querySelector('.btn-return-change');
		returnButton.addEventListener('click', () => {
			const balance = util.getNumber(this.inputBalance);
			const myAccount = util.getNumber(this.myAccount);
			this.myAccount.textContent = util.formatMoney(myAccount + balance);
			this.inputBalance.textContent = util.formatMoney(0);
		})
	}

	setTotalAmount(liPurchased) {
		const totalDiv = document.querySelector('.total-amount');
		const totalAmount = [...liPurchased].reduce((acc, cur) => {
			return acc += cur.querySelector('.product-quantity').textContent * cur.dataset.cost;
		}, 0);
		totalDiv.textContent = `총금액 : ${util.formatMoney(totalAmount)}`;
	}

	addPurchaseButtonEvent() {
		const purchaseButton = document.querySelector('.order-list .btn-order');
		const purchased = document.querySelector('.third-container .product-in-cart');
		purchaseButton.addEventListener('click', () => {
			const liInCart = this.cart.querySelectorAll('li');
			const liPurchased = purchased.querySelectorAll('li');
			liInCart.forEach((inCart) => {
				let isPurchased = false;
				for(let purchased of liPurchased) {
					if (purchased.dataset.name === inCart.dataset.name) {
						const quantity = inCart.querySelector('.product-quantity');
						const newQ = purchased.querySelector('.product-quantity');
						newQ.textContent = util.getNumber(quantity) + util.getNumber(newQ);
						isPurchased = true;
						break;
					}
				}
				if (isPurchased === false) {
						const newLi = document.createElement('li');
						newLi.className = 'product';
						newLi.dataset.name = inCart.dataset.name;
						newLi.dataset.cost = inCart.dataset.cost;
						newLi.innerHTML = inCart.innerHTML;
						purchased.appendChild(newLi);
				}
			})
			this.cart.innerHTML = '';
			this.setTotalAmount(purchased.querySelectorAll('li'));
		})
	}
}
