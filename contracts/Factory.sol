pragma solidity ^0.4.21;

import "./Users.sol";
import "./Basic.sol";
import "./Relay.sol";


contract Factory is Basic, Relay, Users {

    bytes32 public symbol;
    bytes32 public  tokenName;
    uint8 public decimals;
    uint public fee;

    function Factory() public {
        symbol = "KYC";
        tokenName = "identiFormKYC";
        decimals = 18;
    }

    function setFee(uint _fee) public onlyOwner {
        fee = _fee;
    }

}
