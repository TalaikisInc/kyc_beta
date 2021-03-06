pragma solidity ^0.4.21;

import "./Ownable.sol";


contract Roles is Ownable {

    enum Role {
        Owner,
        Admin,
        Manager
    }

    mapping(address => Role) internal roles;

    modifier onlyAs(Role _role) {
        require(roles[msg.sender] == _role);
        _;
    }

    modifier onlyAsOrOwner(Role _role) {
        require(roles[msg.sender] == _role || msg.sender == owner);
        _;
    }

    function addAsRole(address _user, Role _role) public onlyOwner {
        roles[_user] = _role;
    }

    function getRole(address _user) public view onlyOwner returns (uint) {
        return uint(roles[_user]);
    }

}
