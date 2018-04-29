pragma solidity ^0.4.21;

import "./SafeMath.sol";
import "./Users.sol";
import "./Basic.sol";


contract Factory is Users, Basic {

    using SafeMath for uint;

    bytes32 public symbol;
    bytes32 public  tokenName;
    uint8 public decimals;
    uint public rate;
    mapping(address => bool) internal whitelist;

    function Factory() public {
        symbol = "KYC";
        tokenName = "KYC";
        decimals = 18;
    }

    modifier isWhitelisted(address _beneficiary) {
        require(whitelist[_beneficiary]);
        _;
    }

    function setRate(uint _rate) public onlyOwner {
        rate = _rate;
    }

    function () public payable isWhitelisted(msg.sender) {
        uint256 _weiAmount = msg.value;
        address _beneficiary = msg.sender;
        require(_beneficiary != address(0));
        require(_weiAmount > 0);

        uint tokens = SafeMath.mul(msg.value, rate);

        require(!reentrancyLock);
        reentrancyLock = true;
        balances[_beneficiary] = SafeMath.add(balances[_beneficiary], tokens);
        _totalSupply = SafeMath.add(_totalSupply, tokens);
        emit Transfer(address(0), _beneficiary, tokens);
        owner.transfer(_weiAmount);
        reentrancyLock = false;
    }

    function safeTransfer(address _to, uint256 _tokens) internal {
        assert(transfer(_to, _tokens));
    }

    function reclaimToken(address _tokenOwner) public onlyOwner returns (bool) {
        uint256 balance = balanceOf(_tokenOwner);
        safeTransfer(owner, balance);
        return true;
    }

    function addToWhitelist(address _manager) public onlyOwner {
        whitelist[_manager] = true;
    }

    function addManyToWhitelist(address[] _managers) public onlyOwner {
        for (uint256 i = 0; i < _managers.length; i++) {
            whitelist[_managers[i]] = true;
        }
    }

    function removeFromWhitelist(address _manager) public onlyOwner {
        whitelist[_manager] = false;
    }

    function getWhitelistStatus(address _manager) public view onlyOwner returns (bool) {
        return whitelist[_manager];
    }

}
