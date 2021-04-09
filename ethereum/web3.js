import Web3 from 'web3';
const config = require("../environmentConfig.json");


let web3;

//we are on the server or the user is not running metamask
const provider = new Web3.providers.HttpProvider(config.dev.ethereum.testnet.infuraApi);
web3 = new Web3(provider);

export default web3;