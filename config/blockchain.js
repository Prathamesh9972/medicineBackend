const Web3 = require('web3');

// Connect to Ganache 
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC_URL));

// Export web3 to use in controllers
module.exports = web3;
