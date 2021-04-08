import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && window.web3 !== 'undefined') {
    //we are ub the browser and metamask is running.
    web3 = new Web3(window.web3.currentProvider);
} else {
    //we are on the server or the user is not running metamask
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/dd6dabd904c44c478dc6bfe7b22ca036');
    web3 = new Web3(provider);
}

export default web3;