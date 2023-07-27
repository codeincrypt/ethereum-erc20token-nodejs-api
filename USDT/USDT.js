const express = require("express");
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const ABI = require("./usdtabi.json");

const app = express();
const PORT = process.env.PORT || 4000
app.use(express.json());

app.listen(PORT, () => {
	console.log(`USDT app is running on port :: ${PORT}`);
});

const CONTRACT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

app.get("/balance/:address", asyncHandler(async (req, res, next) => {
	let address = req.params.address;
	try {
		const CONTRACT = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
		const response = await CONTRACT.methods.balanceOf(address).call()
		let balance_bn = new BigNumber(web3.utils.fromWei(response, "ether")).multipliedBy(new BigNumber("1000000000000"))
		res.json({balance : balance_bn.toString() });
	} catch (error) {
		console.log('Error in getting balance', error)
	}
}));

app.get('/transfer', async (req, res) => {
	let { privKey, amount, receiverAddress} = req.body
	try {
		const CONTRACT = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
        const account = await web3.eth.accounts.privateKeyToAccount(privKey)
        await web3.eth.accounts.wallet.add(privKey);

        // Checking Sender Account Balance
        const balanceResponse = await CONTRACT.methods.balanceOf(account.address).call();
        let newBalance = new BigNumber(web3.utils.fromWei(balanceResponse, "ether")).multipliedBy(new BigNumber("1000000000000"))
        console.log('Sender USDT balance :: ',  newBalance.toString());

        const gasPrice = new BigNumber("10").multipliedBy(new BigNumber("1000000000")).toString();
        let  finalAmount = new BigNumber(web3.utils.toWei(amount, "ether")).dividedBy(new BigNumber("1000000")).toString();

		const transactionResponse = await CONTRACT.methods.transfer(receiverAddress, finalAmount).send({ from: account.address, gas: 90000, gasPrice: gasPrice});

		await web3.eth.accounts.wallet.remove(account.address);
		res.json(transactionResponse)
	} catch (error) {
		console.log('Error in transfer ', error)
	}
});