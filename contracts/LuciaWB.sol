pragma solidity 0.8.21;


contract LuciaContract {


  constructor(){}

  function executeCode(address contractAddress, bytes calldata encodedSignature) public {
   (bool success, bytes memory data) = contractAddress.call(encodedSignature);
   require(success, "Call failed");
  }

}


contract RandomContract {
    
    uint256 public callCounter;

    event ContractCalled(uint256 count, address sender);
    constructor() {
      callCounter = 0;
    }

   function increaseCounter(uint256 _counterIncrease) public {
    callCounter += _counterIncrease;
    emit ContractCalled(callCounter, msg.sender);
  }

}

// Javascript pseudocode for preparing call


// const Web3 = require('web3');
// const web3 = new Web3(/* provider */);
// const executionContractABI = [...];
// const executionContractAddress = "0x...";

// const randomContractABI = [...];
// const randomContractAddress = "0x...";

// // Encode the method call for RandomContract's increaseCounter function
// const encodedSignature = web3.eth.abi.encodeParameters(['uint256'], [10]);

// const randomContract = new web3.eth.Contract(randomContractABI, randomContractAddress);
// const exContract = new web3.eth.Contract(executionContractABI, executionContractAddress);

// // Execute the method
// exContract.methods.executeCode(randomContractAddress, encodedSignature)
//     .send({ from: /* sender address */ })
//     .then(console.log)
//     .catch(console.error);
