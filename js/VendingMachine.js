import util from "./utils/util.js";

export default class VendingMachine {
	constructor(cola) {
		this.merchandiseContainer = document.querySelector('merchandise-wrapper');
		this.myAccount = document.querySelector('.wallet .money strong');
		this.inputBalance = document.querySelector('.balance .money');
		this.cart = document.querySelector('.product-in-cart');
		this.addDepositButtonEvent();
		this.addColaButtonEvent(cola);
	}

	deposit(event) {
		if (util.getNumber(this.myAccount) >= util.getNumber(event.target)) {
			this.inputBalance.textContent = util.formatMoney(util.getNumber(this.inputBalance) + util.getNumber(event.target));
			this.myAccount.textContent = util.formatMoney(util.getNumber(this.myAccount) - util.getNumber(event.target));
		} else {
			// TODO error처리
			console.log('소지금 부족');
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


	// <click Event>
	// 잔고 있는지 확인
	// merchandise 재고 있는지 확인
	// 수량 --하기
	// li 이미 있는지 확인
	// li 추가 or li 내의 수량 ++
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
			// console.log(curCola);
			merchandise.addEventListener('click', () => {
				if (curCola.count === 0) {
					return ;
				}
				if (!this.checkBalance(merchandise)) {
					// TODO error처리
					alert('잔액이 적습니다.')
					return ;
				}
				let isInCart = false;
				const liInCart = this.cart.querySelectorAll('li');
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
	}
