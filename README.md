Welcome to Defi Staking App!

In this application you will be able to stack your mTether to win a reward token, RWD
Connect your Ethereum wallet at Rinkeby testnet and deposit the ERC20 mTether
and you will be earning RWD each hour.

To build it I used Truffle + Solidity for the contracts, deployed in the Rinkeby testnet with Infura.
In the frontend I used React + Web3.js.

To run the test of the contract just run:
truffle test --network rinkeby

To deploy the contracts run: 
truffle migrate --reset --network rinkeby

Or use development network with Ganache locally.