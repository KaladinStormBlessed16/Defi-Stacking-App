const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", ([owner, customer]) => {
  let tether, rwd, decentralBank;

  function toEther(number) {
    return web3.utils.toWei(number, "ether");
  }

  before(async () => {
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    const totalSupply = await rwd.totalSupply();
    await rwd.transfer(decentralBank.address, totalSupply.toString());
    await tether.transfer(customer, toEther("100"), { from: owner });
  });

  describe("Mock Tether Token", async () => {
    it("matches name succesfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Mock Tether Token");
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

  describe("Customer account", async () => {
    it("recieves 100 Tether", async () => {
      const balance = await tether.balanceOf(customer);
      const expectedFunds = toEther("100");
      assert.equal(balance.toString(), expectedFunds);
    });
  });

  describe("DecentralBank", async () => {
    it("matches name succesfully", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });

    it("stack and unstack tokens from customer", async () => {
      const FUNDS = toEther("100");
      let stackedBalance, customerBalance;

      await tether.approve(decentralBank.address, FUNDS, { from: customer });
      const result = await decentralBank.depositTokens(FUNDS, {
        from: customer,
      });

      customerBalance = await tether.balanceOf(customer);
      assert.equal(
        customerBalance.toString(),
        toEther("0"),
        "Customer has no funds"
      );

      stackedBalance = await decentralBank.stakingBalance(customer);
      assert.equal(
        stackedBalance.toString(),
        FUNDS,
        "Expected funds of customer are staking"
      );

      function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await timeout(60000);

      await decentralBank.issueTokens(owner, { from: customer }).should.be.rejected;
      await decentralBank.issueTokens(customer, { from: customer });

      customerRWDBalance = await rwd.balanceOf(customer);
      assert.equal(
        customerRWDBalance.toString(),
        toEther("10"),
        "Customer has received the reward tokens for staking"
      );

      await decentralBank.unstakeTokens({ from: customer });
      stackedBalance = await decentralBank.stakingBalance(customer);
      assert.equal(
        stackedBalance.toString(),
        toEther("0"),
        "Expected funds of customer are unstaking"
      );
      customerBalance = await tether.balanceOf(customer);
      assert.equal(
        customerBalance.toString(),
        FUNDS,
        "Customer has funds back"
      );
    });
  });
});
