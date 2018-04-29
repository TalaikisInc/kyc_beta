pragma solidity ^0.4.21;

import "./Ownable.sol";


contract Fees is Ownable {

    uint public fee;

    function setFee(uint _fee) public onlyOwner {
        fee = _fee;
    }

}
