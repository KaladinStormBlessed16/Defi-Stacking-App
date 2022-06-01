const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", ([owner, customer]) => {
  let tether, rwd, decentralBank;

  function toWei(number) {
    return web3.utils.toWei(number, "ether");
  }

  before(async () => {
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    const rwdTotalSupply = await rwd.totalSupply();
    const tetherTotalSupply = await tether.totalSupply();
    await rwd.transfer(decentralBank.address, rwdTotalSupply.toString());
    await tether.transfer(decentralBank.address, tetherTotalSupply.toString());
  });

  describe("Mock Tether Token", async () => {
    it("matches name succesfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Mock Tether Token");
    });

    it("total supply is sent to decentralBank", async () => {
      const balance = await tether.balanceOf(decentralBank.address);
      const totalSupply = await tether.totalSupply();
      assert.equal(balance.toString(), totalSupply.toString());
    });
  });

  describe("Reward Token", async () => {
    it("matches name succesfully", async () => {
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });

    it("total supply is sent to decentralBank", async () => {
      const balance = await rwd.balanceOf(decentralBank.address);
      const totalSupply = await rwd.totalSupply();
      assert.equal(balance.toString(), totalSupply.toString());
    });
  });

  describe("DecentralBank", async () => {
    it("matches name succesfully", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });

    it("stack and unstack tokens from customer", async () => {
      const FUNDS = toWei("100");
      let stackedBalance, customerBalance;

      await decentralBank.issueTether({ from: customer });

      customerBalance = await tether.balanceOf(customer);
      assert.equal(
        FUNDS,
        customerBalance.toString(),
        "Customer received the welcome funds"
      );

      await tether.approve(decentralBank.address, FUNDS, { from: customer });
      const result = await decentralBank.depositTokens(FUNDS, {
        from: customer,
      });

      customerBalance = await tether.balanceOf(customer);
      assert.equal(
        customerBalance.toString(),
        toWei("0"),
        "Customer has no funds"
      );

      stackedBalance = await decentralBank.stakingBalance(customer);
      assert.equal(
        stackedBalance.toString(),
        FUNDS,
        "Expected funds of customer are staking"
      );

      // function timeout(ms) {
      //   return new Promise((resolve) => setTimeout(resolve, ms));
      // }

      await decentralBank.issueTokens({ from: customer }).should.be.rejected;

      // await timeout(60000);

      // await decentralBank.issueTokens( { from: customer });

      // customerRWDBalance = await rwd.balanceOf(customer);
      // assert.equal(
      //   customerRWDBalance.toString(),
      //   toWei("2"),
      //   "Customer has received the reward tokens for staking"
      // );

      // await decentralBank.unstakeTokens({ from: customer });
      // stackedBalance = await decentralBank.stakingBalance(customer);
      // assert.equal(
      //   stackedBalance.toString(),
      //   toWei("0"),
      //   "Expected funds of customer are unstaking"
      // );
      // customerBalance = await tether.balanceOf(customer);
      // assert.equal(
      //   customerBalance.toString(),
      //   FUNDS,
      //   "Customer has funds back"
      // );
    });
  });
});
