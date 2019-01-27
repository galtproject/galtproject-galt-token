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

    let commit;
    // eslint-disable-next-line
    const rev = fs.readFileSync('.git/HEAD').toString().replace('\n', '');
    if (rev.indexOf(':') === -1) {
      commit = rev;
    } else {
      // eslint-disable-next-line
      commit = fs.readFileSync(`.git/${rev.substring(5)}`).toString().replace('\n', '');
    }

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
            commit,
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
