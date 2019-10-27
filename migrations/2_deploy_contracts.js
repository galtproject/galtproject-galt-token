const GaltToken = artifacts.require('./GaltToken');

const fs = require('fs');
const packageVersion = require('../package.json').version;

const { web3 } = GaltToken;

function ether(number) {
  return web3.utils.toWei(number.toString(), 'ether');
}

module.exports = async function(deployer, network, accounts) {
  if (network === 'test' || network === 'local_test' || network === 'development') {
    console.log('Skipping deployment migration');
    return;
  }

  // eslint-disable-next-line import/no-dynamic-require,global-require
  const globalConfig = require(`@galtproject/deployment-config/static/${network}.js`);

  const { coreMultiSigAddress } = globalConfig;

  deployer.then(async () => {
    const coreTeam = accounts[0];

    const galtToken = await GaltToken.new(coreMultiSigAddress, ether(42 * 1000 * 1000), { from: coreTeam });

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
