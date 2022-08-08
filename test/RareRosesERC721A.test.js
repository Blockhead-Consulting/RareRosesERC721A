var abi = require('ethereumjs-abi')
var EthUtil = require('ethereumjs-util');
var keccak256 = require('keccak256');
var mtjs = require('merkletreejs');

const { BN, constants, ether, expectEvent, expectRevert, balance } = require('@openzeppelin/test-helpers');
const { assertion } = require('@openzeppelin/test-helpers/src/expectRevert');

const ROSES721A = artifacts.require('RAREROSES721A');

const whitelistAddresses = [
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
  "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
  "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
  "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
  "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
  "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
  "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
  "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
  "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
  "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
  "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
  "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
  "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
  "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
  "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
  "0xAe430A6E623D66D1c36cA5Bcd7282C8f504a8e51"
];

contract('RAREROSES721A', accounts => {
  const [deployer, whitelistedUser, buyer, minter2, userA, userB, teamWallet] = accounts;
  const TEST_BASE_URI = "https://test-base-uri.storage/";

  before(async () => {});

  //--------- Deployment ----------

  it('should fail to mint - exceed max supply', async () => {
    let lowSupply721 = await ROSES721A.new("ROSES721", "ROSE721", TEST_BASE_URI, 
      teamWallet, 1, 0, {from: deployer});

    await expectRevert(
      lowSupply721.mint(3,{from: deployer, value: web3.utils.toWei(".06", "ether")}),
      "Max supply exceeded!"
    );
  });

  it('should fail to mint - mint not enabled', async () => {
    let rose721 = await ROSES721A.new("ROSES721", "ROSE721", TEST_BASE_URI, 
      teamWallet, 20, 5, {from: deployer});

    await expectRevert(
      rose721.mint(1,{from: deployer, value: web3.utils.toWei(".06", "ether")}),
      "Minting is disabled."
    );
  });

  it('should fail to mint - insufficient funds', async () => {
    let rose721 = await ROSES721A.new("ROSES721", "ROSE721", TEST_BASE_URI, 
      teamWallet, 20, 5, {from: deployer});

    await expectRevert(
      rose721.mint(2,{from: deployer, value: web3.utils.toWei(".06", "ether")}),
      "Insufficient funds!"
    );
  });

  it('should fail to mint - max supply exceeded when mints reserved', async () => {
    let rose721 = await ROSES721A.new("ROSES721", "ROSE721", TEST_BASE_URI, 
      teamWallet, 3, 2, {from: deployer});
    
    await rose721.toggleMintEnabled();

    await expectRevert(
      rose721.mint(2,{from: deployer, value: web3.utils.toWei(".12", "ether")}),
      "Max supply exceeded!"
    );
  });

  it('Whitelist sale', async function () {
    // Build MerkleTree
    const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new mtjs.MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const rootHash = merkleTree.getRoot();
    let contract = await ROSES721A.new("ROSES721", "ROSE721", TEST_BASE_URI, 
      teamWallet, 5000, 150, {from: deployer});

    // Update the root hash
    await contract.setMerkleRoot('0x' + rootHash.toString('hex'));

    await contract.toggleWhitelistMint();

    await contract.whitelistMint(
      1,
      merkleTree.getHexProof(keccak256(whitelistedUser)),
      {from: whitelistedUser, value: web3.utils.toWei(".06", "ether")},
    );
    // Trying to mint twice
       
    // Pause whitelist sale
    await contract.toggleWhitelistMint();
    await contract.setPrice(web3.utils.toWei(".01", "ether"));

  });

});
