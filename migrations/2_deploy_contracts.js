/*
 * Copyright ©️ 2019 GaltProject Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *  
 *  Copyright ©️ 2019 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

const GaltToken = artifacts.require('./GaltToken');
const Web3 = require('web3');

const fs = require('fs');
const packageVersion = require('../package.json').version;

const web3 = new Web3(GaltToken.web3.currentProvider);

module.exports = async function(deployer, network, accounts) {
  if (network === 'test' || network === 'local_test' || network === 'development') {
    console.log('Skipping deployment migration');
    return;
  }

  deployer.then(async () => {
    const coreTeam = accounts[0];

    const galtToken = await GaltToken.new({ from: coreTeam });

    const blockNumber = await web3.eth.getBlockNumber();
    const networkId = await web3.eth.net.getId();

    await new Promise(resolve => {
      const deployDirectory = `${__dirname}/../deployed`;
      if (!fs.existsSync(deployDirectory)) {
        fs.mkdirSync(deployDirectory);
      }

      const deployFile = `${deployDirectory}/${networkId}.json`;
      console.log(`saved to ${deployFile}`);

      fs.writeFile(
        deployFile,
        JSON.stringify(
          {
            packageVersion,
            networkId,
            blockNumber,
            galtTokenAddress: galtToken.address,
            galtTokenAbi: galtToken.abi
          },
          null,
          2
        ),
        resolve
      );
    });
  });
};
