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
		var pubkey = response.address
		var privkey = response.privateKey
		console.log('Ethereum address :: ', pubkey)
		console.log('Ethereum private key (password) :: ', privkey)
		res.json(response)
	} catch (error) {
		console.log("Error in creating new address", error)
	}
})