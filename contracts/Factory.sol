pragma solidity ^0.4.21;

import "./Users.sol";


contract Factory is Users {

    bytes32 public symbol;
    bytes32 public  tokenName;
    uint8 public decimals;
    uint public fee;

    function Factory() public {
        symbol = "KYC";
        tokenName = "KYC";
        decimals = 18;
    }

    function setFee(uint _fee) public onlyOwner {
        fee = _fee;
    }

}
