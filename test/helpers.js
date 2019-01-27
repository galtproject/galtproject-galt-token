const Web3 = require('web3');

const { BN } = Web3.utils;

let web3;

const Helpers = {
  initHelperWeb3(_web3) {
    web3 = new Web3(_web3.currentProvider);
  },
  zeroAddress: '0x0000000000000000000000000000000000000000',
  hex(input) {
    return web3.utils.toHex(input);
  },
  gwei(number) {
    return web3.utils.toWei(number.toString(), 'gwei');
  },
  szabo(number) {
    return web3.utils.toWei(number.toString(), 'szabo');
  },
  ether(number) {
    return web3.utils.toWei(number.toString(), 'ether');
  },
  galt(number) {
    return web3.utils.toWei(number.toString(), 'ether');
  },
  roundToPrecision(number, precision = 4) {
    return Math.round(number * 10 ** precision) / 10 ** precision;
  },
  weiToEtherRound(wei, precision = 4) {
    return Helpers.roundToPrecision(parseFloat(web3.utils.fromWei(wei.toFixed(), 'ether')), precision);
  },
  log(...args) {
    console.log('>>>', new Date().toLocaleTimeString(), '>>>', ...args);
  },
  async sleep(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  },
  async assertInvalid(promise) {
    try {
      await promise;
    } catch (error) {
      const revert = error.message.search('invalid opcode') >= 0;
      assert(revert, `Expected INVALID (0xfe), got '${error}' instead`);
      return;
    }
    assert.fail('Expected INVALID (0xfe) not received');
  },
  async assertRevert(promise) {
    try {
      await promise;
    } catch (error) {
      const revert = error.message.search('revert') >= 0;
      assert(revert, `Expected throw, got '${error}' instead`);
      return;
    }
    assert.fail('Expected throw not received');
  },
  assertEqualBN(actual, expected) {
    assert(actual instanceof BN, 'Actual value isn not a BN instance');
    assert(expected instanceof BN, 'Expected value isn not a BN instance');

    assert(
      actual.toString(10) === expected.toString(10),
      `Expected ${web3.utils.fromWei(actual)} (actual) ether to be equal ${web3.utils.fromWei(
        expected
      )} ether (expected)`
    );
  },

  getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
  },

  degreeToRad(degree) {
    return (degree * Math.PI) / 180;
  },

  radToDegree(radians) {
    return (radians * 180) / Math.PI;
  }
};

module.exports = Helpers;
