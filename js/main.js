import ColaGenerator from './ColaGenerator.js';
import ColaList from "./ColaList.js";
import VendingMachine from './VendingMachine.js';



const start = async () => {
	const colaGenerator = new ColaGenerator();
	const cola = new ColaList();
	await cola.setColaList('../item.json');
	colaGenerator.generate(cola);
	const vendingMachine = new VendingMachine();
}


start();