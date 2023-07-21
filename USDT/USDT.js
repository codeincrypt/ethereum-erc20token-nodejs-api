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
	if(!address) return res.json({ errorCode : 1, errorMessage:"Please provide USDT address"});
	try {
		const CONTRACT = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
		const response = await CONTRACT.methods.balanceOf(address).call()
		let balance_bn = new BigNumber(web3.utils.fromWei(response, "ether")).multipliedBy(new BigNumber("1000000000000"))
		let output = {
			errorCode		: 0,
			errorMessage	: null,
			balance			: balance_bn.toString() 
		}
		res.json(output);
	} catch (error) {
		console.log('Error in getting balance', error)
		return res.json({ errorCode : 1, errorMessage: "Error in getting balance"})
	}
}));