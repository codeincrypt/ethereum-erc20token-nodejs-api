const express = require("express");
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const app = express();
const PORT = process.env.PORT || 3000
app.use(express.json());

app.listen(PORT, () => {
	console.log(`Ethereum app is running on port :: ${PORT}`);
});

app.get("/create", async (req, res) => {
	try {
		const response = await web3.eth.accounts.create()
		let pubkey = response.address
		let privkey = response.privateKey
		console.log('Ethereum address :: ', pubkey)
		console.log('Ethereum private key (password) :: ', privkey)
		res.json(response)
	} catch (error) {
		console.log("Error in creating new address", error)
	}
})

app.get("/balance/:address", async (req, res) => {
  let address = req.params.address
  try {
    let balance = await web3.eth.getBalance(address);
    let result = web3.utils.fromWei(balance, 'ether');
    console.log('balance', result);
    res.json(result);
  } catch (error) {
    console.log('Error in fetching balance', error);
  }
})

app.get("/transaction/:txnid", async (req, res) => {
  let txnid = req.params.txnid
  try {
    var result = await web3.eth.getTransaction(txnid)
    res.json(result);
  } catch (error) {
    console.log('Error in getting Transaction Details', error);
  }
})