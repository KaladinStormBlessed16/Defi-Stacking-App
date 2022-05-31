pragma solidity ^0.5.0;

contract RWD {
    string public name = 'Reward Token';
    string public symbol = 'RWD';
    uint public totalSupply = 1000000000000000000000000;
    uint public decimals = 18;

    event Transfer (
        address indexed _from,
        address indexed _to,
        uint _value
    );

    event Approval (
        address indexed _owner,
        address indexed _spender,
        uint _value
    );

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowence;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function approve(address _spender, uint _value) public returns(bool success) {
        allowence[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transfer(address _to, uint _value) public returns(bool success) {
        require(_value > 0, 'Amount cannot be 0 or negative');
        require(balanceOf[msg.sender] >= _value, 'Not enough fund for this transaction');

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {
        require(_value > 0, 'Amount cannot be 0 or negative');
        require(balanceOf[_from] >= _value, 'Not enough fund for this transaction');
        require(allowence[msg.sender][_from] >= _value, 'Must approve first');

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowence[msg.sender][_from] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }
}