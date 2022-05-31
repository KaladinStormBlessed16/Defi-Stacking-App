import React, { Component } from "react";
import Navbar from "./Navbar";
import Web3 from "web3";
import "./App.css";
import Main from "./Main";
import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";
import ParticleSettings from "./ParticleSettings";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      tether: {},
      rwd: {},
      decentralBank: {},
      tetherBalance: "0",
      rwdTokenBalance: "0",
      stakingBalance: "0",
      timestamp: "0",
      loadingMainComponent: true,
      loadingTransaction: false,
    };
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();

    //LOAD Tether TOKEN
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      this.setState({ tether });
      let tetherBalance = await tether.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ tetherBalance: tetherBalance.toString() });
    } else {
      window.alert("tether contract not deployed to detect network");
    }

    //LOAD RWD TOKEN
    const rwdTokenData = RWD.networks[networkId];
    if (rwdTokenData) {
      const rwd = new web3.eth.Contract(RWD.abi, rwdTokenData.address);
      this.setState({ RWD });
      let rwdTokenBalance = await rwd.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ rwdTokenBalance: rwdTokenBalance.toString() });
    } else {
      window.alert("Reward Token contract not deployed to detect network");
    }

    //Load DecentralBank
    const decentralBankData = DecentralBank.networks[networkId];
    if (decentralBankData) {
      const decentralBank = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      this.setState({ decentralBank });
      let stakingBalance = await decentralBank.methods
        .stakingBalance(this.state.account)
        .call();
      this.setState({
        stakingBalance: stakingBalance.toString(),
      });
      let timestamp = await decentralBank.methods
        .timestamps(this.state.account)
        .call();
      this.setState({
        timestamp: timestamp.toString(),
      });
    } else {
      window.alert("TokenForm contract not deployed to detect network");
    }

    this.setState({ loadingMainComponent: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non ethereum browser detected. You should consider Metamask!"
      );
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loadingTransaction: true });
    this.state.tether.methods
      .approve(this.state.decentralBank._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.decentralBank.methods
          .depositTokens(amount)
          .send({ from: this.state.account })
          .on("receipt", async (hash) => {
            this.setState({ loadingTransaction: false });
            await this.loadBlockchainData();
          });
      });
  };

  unstakeTokens = () => {
    this.setState({ loadingTransaction: true });
    this.state.decentralBank.methods
      .unstakeTokens()
      .send({ from: this.state.account })
      .on("receipt", async (hash) => {
        this.setState({ loadingTransaction: false });
        await this.loadBlockchainData();
      });
  };

  rewardTokens = async () => {
    this.setState({ loadingTransaction: true });
    this.state.decentralBank.methods
      .issueTokens(this.state.account)
      .send({ from: this.state.account })
      .on("receipt", async (hash) => {
        this.setState({ loadingTransaction: false });
        await this.loadBlockchainData();
      });
  };

  render() {
    let content;

    this.state.loadingMainComponent
      ? (content = (
          <p
            id="loader"
            className="text-center"
            style={{ color: "white", margin: "30px" }}
          >
            LOADING PLEASE...
          </p>
        ))
      : (content = (
          <Main
            tetherBalance={this.state.tetherBalance}
            rwdBalance={this.state.rwdTokenBalance}
            stakingBalance={this.state.stakingBalance}
            timestamp={this.state.timestamp}
            stakeTokens={this.stakeTokens}
            unstakeTokens={this.unstakeTokens}
            rewardTokens={this.rewardTokens}
            decentralBankContract={this.decentralBank}
          />
        ));

    return (
      <>
        <div className="App" style={{ position: "relative" }}>
          <div style={{ position: "absolute" }}>
            <ParticleSettings />
          </div>
          <Navbar account={this.state.account} />
          <div className="container-fluid mt-5">
            <div className="row">
              <main
                role="main"
                className="col-lg-12 ml-auto mr-auto"
                style={{ maxWidth: "600px" }}
              >
                <div>{content}</div>
              </main>
            </div>
          </div>
        </div>
        {(this.state.loadingTransaction || this.state.loadingMainComponent) && (
          <div className="loadingSpinner" style={{ position: 'absolute', top: '50%', left: '48%', zIndex: '3'}}>
            <div
              className="spinner-border text-warning"
              role="status"
              style={{ width: "4rem", height: "4rem" }}
            >
              <span className="sr-only" />
            </div>
          </div>
        )}
      </>
    );
  }
}

export default App;
