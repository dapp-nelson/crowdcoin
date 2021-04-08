const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
const config = require('../environmentConfig.json');

const provider = new HDWalletProvider(config.dev.ethereum.testnet.seedPhrase, config.dev.ethereum.testnet.infuraApi);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Tentando implantar contrato a partir da conta', accounts[0]);

    let contract = await new web3.eth.Contract(compiledFactory.abi);
    
    let deployed = await contract.deploy({ data: compiledFactory.evm.bytecode.object});

    let gasFactory = await deployed.estimateGas();
    const result = await deployed.send({
        from: accounts[0],
        gas: gasFactory
    })

    console.log('Contrato implantado em', result.options.address);
};
deploy();