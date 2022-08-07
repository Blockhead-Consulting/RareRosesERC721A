const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "*",
    },
    ropsten: {
     provider: () =>
       new HDWalletProvider({
         mnemonic: {
           phrase: process.env.MNEMONIC
         },
         providerOrUrl: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
         numberOfAddress: 1
       }),
     network_id: 3,
     gas: 6721975,
     gasPrice: 40000000000
    },
    rinkeby: {
     provider: () =>
       new HDWalletProvider({
         mnemonic: {
           phrase: process.env.MNEMONIC
         },
         providerOrUrl: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
         numberOfAddress: 1
       }),
     network_id: 4,
     gas: 6721975,
    },
    mainnet: {
     provider: () =>
       new HDWalletProvider({
         mnemonic: {
           phrase: process.env.MAIN_MNEMONIC
         },
         providerOrUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
         numberOfAddress: 2
       }),
     network_id: 1,
     gas: 6721975,
    },
  },
  contracts_build_directory: './abis/',
  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.15",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       }
     }
    }
  }
}
