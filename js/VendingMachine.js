import util from './utils/util.js';

export default class VendingMachine {
  constructor(cola) {
    this.merchandiseContainer = document.querySelector('merchandise-wrapper');
    this.myAccount = document.querySelector('.wallet .money strong');
    this.inputBalance = document.querySelector('.balance .money');
    this.cart = document.querySelector('.order-list .product-in-cart');
    this.addDepositButtonEvent();
    this.addColaButtonEvent(cola);
    this.addReturnButtonEvent();
    this.addPurchaseButtonEvent(cola);
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
    return currentBalance >= merchandiseCost;
  }

  checkQuantity(merchandise, cola) {
    cola.getList.forEach((cur) => {
      if (cur.name === merchandise.dataset.name) return cur.count;
    });
  }

  addColaButtonEvent(cola) {
    const merchandiseList = document.querySelectorAll('.product');
    merchandiseList.forEach((merchandise) => {
      const curCola = cola.getDetail(merchandise.dataset.name);
      merchandise.addEventListener('click', () => {
        if (curCola.count === 0) {
          return;
        }
        if (!this.checkBalance(merchandise)) {
          // TODO error처리
          alert('잔액이 적습니다.');
          return;
        }

        // TODO 분리
        const liInCart = this.cart.querySelectorAll('li');
        let isInCart = false;
        liInCart.forEach((li) => {
          if (li.dataset.name === curCola.name) {
            const quantity = li.querySelector('.product-quantity');
            quantity.textContent = parseInt(quantity.textContent) + 1;
            isInCart = true;
          }
        });
        if (isInCart === false) {
          const newLi = document.createElement('li');
          newLi.className = 'product';
          newLi.dataset.name = curCola.name;
          newLi.dataset.cost = curCola.cost;
          newLi.innerHTML = `
					<img src="./img/${curCola.img}" alt="${curCola.name}" />
					<p class="product-name">${curCola.name}</p>
					<button class="btn-decrease">-</button>
					<p class="product-quantity">1</p>
					<button class="btn-increase">+</button>
					<butotn class="btn-delete"><button>`;
          this.cart.appendChild(newLi);
          const btnDecrease = newLi.querySelector('.btn-decrease');
          const btnIncrease = newLi.querySelector('.btn-increase');
          const btnDelete = newLi.querySelector('.btn-delete');
          btnDecrease.addEventListener('click', () => {
            const $quantity = newLi.querySelector('.product-quantity');
            let quantity = util.getNumber($quantity);
            if (quantity === 1) {
              // TODO 제거 확인 모달 추가
              return;
            }
            if (cola.getDetail(newLi.dataset.name).count === 0) {
              merchandise.querySelector('.sold-out').classList.add('a11y-hidden');
              merchandise.classList.remove('disabled');
            }
            $quantity.textContent = --quantity;
            cola.getDetail(newLi.dataset.name).count++;
            this.inputBalance.textContent = util.formatMoney(util.getNumber(this.inputBalance) + cola.getDetail(newLi.dataset.name).cost);
            // console.log(cola.getDetail(newLi.dataset.name).count);
          });
          btnIncrease.addEventListener('click', () => {
            const $quantity = newLi.querySelector('.product-quantity');
            let quantity = util.getNumber($quantity);
            if (cola.getDetail(newLi.dataset.name).count === 0) return;
            if (util.getNumber(this.inputBalance) < cola.getDetail(newLi.dataset.name).cost) {
              alert('소지금이 부족합니다');
              return;
            }
            $quantity.textContent = ++quantity;
            cola.getDetail(newLi.dataset.name).count--;
            // console.log(cola.getDetail(newLi.dataset.name).count);
            if (cola.getDetail(newLi.dataset.name).count == 0) {
              merchandise.querySelector('.sold-out').classList.remove('a11y-hidden');
              merchandise.classList.add('disabled');
            }
            this.inputBalance.textContent = util.formatMoney(util.getNumber(this.inputBalance) - cola.getDetail(newLi.dataset.name).cost);
          });
          btnDelete.addEventListener('click', () => {
            const $quantity = newLi.querySelector('.product-quantity');
            const quantity = util.getNumber($quantity);
            if (cola.getDetail(newLi.dataset.name).count === 0) {
              merchandise.querySelector('.sold-out').classList.add('a11y-hidden');
              merchandise.classList.remove('disabled');
            }
            cola.getDetail(newLi.dataset.name).count += quantity;
            this.inputBalance.textContent = util.formatMoney(util.getNumber(this.inputBalance) + cola.getDetail(newLi.dataset.name).cost * quantity);
            this.cart.removeChild(newLi);
          });
        }
        curCola.count--;
        this.inputBalance.textContent = util.formatMoney(util.getNumber(this.inputBalance) - curCola.cost);
        if (curCola.count === 0) {
          merchandise.classList.add('disabled');
          const soldOutDiv = merchandise.querySelector('.sold-out');
          soldOutDiv.classList.remove('a11y-hidden');
        }
      });
    });
  }

  addReturnButtonEvent() {
    const returnButton = document.querySelector('.btn-return-change');
    returnButton.addEventListener('click', () => {
      const balance = util.getNumber(this.inputBalance);
      const myAccount = util.getNumber(this.myAccount);
      this.myAccount.textContent = util.formatMoney(myAccount + balance);
      this.inputBalance.textContent = util.formatMoney(0);
    });
  }

  setTotalAmount(liPurchased) {
    const totalDiv = document.querySelector('.total-amount');
    const totalAmount = [...liPurchased].reduce((acc, cur) => acc += cur.querySelector('.product-quantity').textContent * cur.dataset.cost, 0);
    totalDiv.textContent = `총금액 : ${util.formatMoney(totalAmount)}`;
  }

  addPurchaseButtonEvent(cola) {
    const purchaseButton = document.querySelector('.order-list .btn-order');
    const purchased = document.querySelector('.third-container .product-in-cart');
    purchaseButton.addEventListener('click', () => {
      const liInCart = this.cart.querySelectorAll('li');
      const liPurchased = purchased.querySelectorAll('li');
      liInCart.forEach((inCart) => {
        let isPurchased = false;
        for (const purchased of liPurchased) {
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
          newLi.innerHTML = `
						<img src="./img/${cola.getDetail(inCart.dataset.name).img}" alt="${inCart.dataset.name}" />
						<p class="product-name">${inCart.dataset.name}</p>
						<p class="product-quantity">${util.getNumber(inCart.querySelector('.product-quantity'))}</p>`;
          purchased.appendChild(newLi);
        }
      });
      this.cart.innerHTML = '';
      this.setTotalAmount(purchased.querySelectorAll('li'));
    });
  }
}
