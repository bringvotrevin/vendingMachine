import util from "./utils/util.js";

export default class VendingMachine {
	constructor() {
		this.myAccount = document.querySelector('.wallet .money strong');
		this.inputBalance = document.querySelector('.balance .money');
		this.addDepositButtonEvent();
	}

	deposit(event) {
		if (util.getNumber(this.myAccount) < util.getNumber(event.target)) {
			// TODO error처리
			console.log('소지금 부족');
		} else {
			this.inputBalance.textContent = util.formatNumber(util.getNumber(this.inputBalance) + util.getNumber(event.target));
			this.myAccount.textContent = util.formatNumber(util.getNumber(this.myAccount) - util.getNumber(event.target));
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
}