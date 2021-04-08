const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

//obtendo o path da pasta build
const buildPath = path.resolve(__dirname, 'build');
//removendo a pasta build
fs.removeSync(buildPath);

//lendo o arquivo campaign.sol
// loading the source code from a solidity file
let input = {
    language: 'Solidity',
    sources: {
        // CampaignFactory
        'CampaignFactory.sol': {
            content: fs.readFileSync('contracts/CampaignFactory.sol', 'utf8'),
        },
        // Campaign.sol
        'Campaign.sol': {
            content: fs.readFileSync('contracts/Campaign.sol', 'utf8'),
        }
    },
    settings: {
        outputSelection: {'*': {'*': ['*']}}
    }
};

//compilando contrato
let compiled = solc.compile(JSON.stringify(input));
let output = JSON.parse(compiled);
//console.log(output)
//recriar pasta build
fs.ensureDirSync(buildPath);

//obter os dois contratos de campaign
for(let contractJson in output.contracts) {
    if (contractJson.startsWith("Campaign.") || contractJson.startsWith("CampaignFactory.")) {
       
        fs.writeFile(buildPath + '/' + contractJson.replace(".sol", ".json"), JSON.stringify(output.contracts[contractJson][contractJson.replace(".sol", "")]), function (err) {
            console.log("\nJSON saved   -> OK\n    "+ buildPath + contractJson.replace(".sol", ".json"));
            if (err) throw err;
        });


    }
}