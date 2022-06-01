const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Tether);
  const tether = await Tether.deployed();
  const tetherTotalSupply = await tether.totalSupply();

  await deployer.deploy(RWD);
  const rwd = await RWD.deployed();
  const rwdTotalSupply = await rwd.totalSupply();

  await deployer.deploy(DecentralBank, rwd.address, tether.address);
  const decentralBank = await DecentralBank.deployed();

  await rwd.transfer(decentralBank.address, rwdTotalSupply.toString());
  await tether.transfer(decentralBank.address, tetherTotalSupply.toString());
};
