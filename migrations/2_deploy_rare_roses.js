const RAREROSES = artifacts.require("RAREROSES721A");

module.exports = async (deployer, network, accounts) => {
  let name = "TEST721A";
  let symbol = "T721A";
  let baseURI = "https://test-base-uri.storage/";
  let teamWallet = "0xC07e967E9c7e6d992d456801AF00D10E9CBf8886"
  let maxSupply = 5000;
  let reserved = 150;

  await deployer.deploy(RAREROSES, name, symbol, baseURI, teamWallet, maxSupply, reserved);
};
