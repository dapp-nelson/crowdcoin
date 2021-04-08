const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    let contract = await new web3.eth.Contract(compiledFactory.abi);
    
    let deployed = await contract.deploy({ data: compiledFactory.evm.bytecode.object});

    let gasFactory = await deployed.estimateGas();
    factory = await deployed.send({
        from: accounts[0],
        gas: gasFactory
    })

    let gasEstimated = await factory.methods.createCampaign('100').estimateGas({from: accounts[0]});
    let transactionFactory = await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: gasEstimated
    });

    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress
    );

});

describe('Campaigns', () => {
    it('Implanta os contratos Factory e Campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('Marca o caller como o gerente da campanha', async () => {
        const manager = await campaign.methods.manager().call();

        assert.strictEqual(accounts[0], manager);
    });

    it('Permite que as pessoas contribuam com dinheiro e inclui na lista de aprovadores', async() => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('Requer uma contribuição mínima', async() => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            });
            assert(false);
        }catch(e) {
            console.log(e.results);
            assert(e);
        }
    });

    it('Permite que um gerente faça uma solicitação de pagamento', async() => {
        await campaign.methods.createRequest("Compra de baterias", '100', accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        const request = await campaign.methods.requests(0).call();
        assert.strictEqual('Compra de baterias', request.description);
    });

    it('Pedidos de solicitações', async() => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        
        assert(balance > 104);
    });
});