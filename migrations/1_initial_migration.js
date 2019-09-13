/*
 * Copyright ©️ 2019 GaltProject Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *  
 *  Copyright ©️ 2019 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

const Migrations = artifacts.require('./Migrations.sol');

const Web3 = require('web3');

const web3 = new Web3(Migrations.web3.currentProvider);
console.log('web3', web3.version.toString());

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
