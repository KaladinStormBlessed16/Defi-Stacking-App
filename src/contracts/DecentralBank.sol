pragma solidity ^0.5.0;

import "./Tether.sol";
import "./RWD.sol";

contract DecentralBank {
    address public owner;
    string public name = "Decentral Bank";
    Tether public tether;
    RWD public rwd;
    uint256 private WELCOME_REWARD = 100000000000000000000;
    
    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public timestamps;
    mapping(address => bool) public welcomeGranted;

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

    function issueTokens() public {
        require(stakingBalance[msg.sender] > 0);
        require(    
            now >= timestamps[msg.sender] + 60 minutes ,
            "Stacking cycle has not finished"
        );

        uint256 balance = stakingBalance[msg.sender] / 50;
        if (balance > 0) {
            rwd.transfer(msg.sender, balance);
            timestamps[msg.sender] = now;
        }
    }

    function issueTether() public {
        require(stakingBalance[msg.sender] == 0);
        require(!welcomeGranted[msg.sender]);

        tether.transfer(msg.sender, WELCOME_REWARD);
        welcomeGranted[msg.sender] = true;
    }

    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        tether.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        timestamps[msg.sender] = 0;
    }
}
