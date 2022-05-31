pragma solidity ^0.5.0;

import "./Tether.sol";
import "./RWD.sol";

contract DecentralBank {
    address public owner;
    string public name = "Decentral Bank";
    Tether public tether;
    RWD public rwd;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public timestamps;

    constructor(RWD _rwd, Tether _tether) public {
        owner = msg.sender;
        tether = _tether;
        rwd = _rwd;
    }

    function depositTokens(uint256 _amount) public {
        tether.transferFrom(msg.sender, address(this), _amount);
        if (stakingBalance[msg.sender] == 0) {
            stakers.push(msg.sender);
        }
        if (timestamps[msg.sender] == 0) {
            timestamps[msg.sender] = now;
        }
        stakingBalance[msg.sender] += _amount;
    }

    function issueTokens(address _to) public {
        require(stakingBalance[_to] > 0);
        require(    
            now >= timestamps[_to] + 60 minutes ,
            "Stacking cycle has not finished"
        );

        uint256 balance = stakingBalance[_to] / 50;
        if (balance > 0) {
            rwd.transfer(_to, balance);
            timestamps[_to] = now;
        }
    }

    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        tether.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        timestamps[msg.sender] = 0;
    }
}
