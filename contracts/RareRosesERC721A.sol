//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import 'erc721a/contracts/ERC721A.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

contract RareRoses721A is ERC721A, Ownable, ReentrancyGuard {

  using Strings for uint256;

  event StartPresale(address contractAddress);
  event EndPresale(address contractAddress);

  bytes32 public merkleRoot;
  mapping(address => bool) public whitelistClaimed;
  bool public whitelistMintEnabled;
  uint8 public constant perWalletPresale = 6;

  uint16 public constant MAX_SUPPLY = 5000;
  uint8 public constant maxMintAmountPerTx = 3;
  uint256 public price = .06 ether;
  uint16 public reserved = 150;
  bool public mintEnabled;

  string private baseURI;
  address public teamWallet;
 
  /**
   * @notice Setup ERC721A
   */
  constructor(
      string memory _name,
      string memory _symbol,
      string memory _defaultURI,
      address _teamWallet
  ) ERC721A(_name, _symbol) {
      require(_teamWallet != address(0), "Zero address error");
      baseURI = _defaultURI; 
      teamWallet = _teamWallet;
  }

  modifier mintCompliance(uint256 _mintAmount) {
    require(_mintAmount > 0 && _mintAmount <= maxMintAmountPerTx, 'Invalid mint amount!');
    require(_totalMinted() + _mintAmount <= MAX_SUPPLY - reserved, 'Max supply exceeded!');
    _;
  }

  modifier mintPriceCompliance(uint256 _mintAmount) {
    require(msg.value >= price * _mintAmount, 'Insufficient funds!');
    _;
  }

  /**
   * @notice Make New Rare Roses 
   * @param amount Amount of Rare Roses to mint
   * @dev Utilize unchecked {} and calldata for gas savings.
   */
  function mint(uint256 amount) public payable mintCompliance(amount) mintPriceCompliance(amount) {
    require(mintEnabled, "Minting is disabled.");
    _safeMint(_msgSenderERC721A(), amount);
  }

  function whitelistMint(uint256 _mintAmount, bytes32[] calldata _merkleProof) public payable mintCompliance(_mintAmount) mintPriceCompliance(_mintAmount) {
    // Verify whitelist requirements
    require(whitelistMintEnabled, 'The whitelist sale is not enabled!');
    require(
            balanceOf(_msgSenderERC721A()) + _mintAmount <=  perWalletPresale,
            "Amount exceeds current maximum mints per account."
        );
    require(!whitelistClaimed[_msgSenderERC721A()], 'Address already claimed!');
    bytes32 leaf = keccak256(abi.encodePacked(_msgSenderERC721A()));
    require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), 'Invalid proof!');

    whitelistClaimed[_msgSenderERC721A()] = true;
    _safeMint(_msgSenderERC721A(), _mintAmount);
  }

  function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
    merkleRoot = _merkleRoot;
  }

  /**
   * @notice Send ETH to team wallet 
   */
  function teamWithdraw() public onlyOwner {
      uint256 balance = address(this).balance;
      payable(teamWallet).transfer(balance);
  }

  /**
   * @notice Set team wallet.
   * @param _teamWallet new team wallet address 
   * @dev Only authorized accounts.
   */
  function setTeamWallet(address _teamWallet) public onlyOwner {
      require(_teamWallet != address(0), "Zero address error");
      teamWallet = _teamWallet;
  }

  /**
   * @notice Send reserved Rare Roses 
   * @param _to address to send reserved nfts to.
   * @param _amount number of nfts to send 
   */
  function fetchReserved(address _to, uint16 _amount) public onlyOwner
  {
      require( _to !=  address(0), "Zero address error");
      require( _amount <= reserved, "Exceeds reserved supply");
      _safeMint(_to, _amount);
      reserved -= _amount;
  }

  /**
   * @notice Ends presale.
   */
  function toggleWhitelistMint() public onlyOwner {
      whitelistMintEnabled = !whitelistMintEnabled;
      if (whitelistMintEnabled) {
        emit StartPresale(address(this));
      } else {
        emit EndPresale(address(this));
      }
  }


  /**
   * @notice Set price.
   * @param newPrice new minting price
   * @dev Only authorized accounts.
   */
  function setPrice(uint256 newPrice) public onlyOwner {
      price = newPrice;
  }

  /**
   * @notice Toggles minting state.
   */
  function toggleMintEnabled() public onlyOwner {
      mintEnabled = !mintEnabled;
  }

  /**
   * @notice Set base URI.
   */
  function setBaseURI(string memory _newUri) public onlyOwner {
      baseURI = _newUri;
  }

  function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
  }

  function _startTokenId() internal view virtual override returns (uint256) {
      return 1;
  }

  receive() external payable {}

  fallback() external payable {}
}