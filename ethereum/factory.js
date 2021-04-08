import web from './web3';
import CampaingFactory from './build/CampaignFactory.json';
import web3 from './web3';
const config = require("../environmentConfig.json");

const instance = new web3.eth.Contract(CampaingFactory.abi, config.dev.ethereum.testnet.factoryContractAddress);

export default instance;