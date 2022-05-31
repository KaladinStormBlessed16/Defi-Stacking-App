import React, { Component } from "react";
import tether from "../tether.png";
import Airdrop from "./Airdrop";

class Main extends Component {
  render() {
    return (
      <div id="content" className="mt-3">
        <table className="table text-muted text-center">
          <thead>
            <tr style={{ color: "white" }}>
              <th scope="col">Staking Balance</th>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ color: "white" }}>
              <td>
                {window.web3.utils.fromWei(this.props.stakingBalance, "Ether")}{" "}
                USDT
              </td>
              <td>
                {window.web3.utils.fromWei(this.props.rwdBalance, "Ether")} RWD
              </td>
            </tr>
          </tbody>
        </table>
        <div className="card mb-2" style={{ opacity: ".9", padding: "1rem" }}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              let amount;
              amount = this.input.value.toString();
              amount = window.web3.utils.toWei(amount, "Ether");
              this.props.stakeTokens(amount);
            }}
            className="mb-3"
          >
            <div style={{ borderSpacing: "0 1em" }}>
              <label className="float-left" style={{ marginLeft: "15px" }}>
                <b>Stake Tokens</b>
              </label>
              <span className="float-right" style={{ marginRight: "8px" }}>
                Balance:
                {window.web3.utils.fromWei(this.props.tetherBalance, "Ether")}
              </span>
              <div className="input-group mb-4">
                <input
                  ref={(input) => {
                    this.input = input;
                  }}
                  type="number"
                  placeholder="0"
                  required
                />
                <div className="input-group-open">
                  <div className="input-group-text">
                    <img src={tether} alt="tether" height="32" />
                    &nbsp;&nbsp;&nbsp; <b>USDT</b>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-success btn-lg btn-block"
              >
                DEPOSIT
              </button>
            </div>
          </form>
          <button
            type="submit"
            onClick={(event) => {
              event.preventDefault(this.props.unstakeTokens());
            }}
            className="btn btn-dark btn-lg btn-block"
          >
            <span style={{ color: "#FCD535" }}>WITHDRAW</span>
          </button>
          <div className="card-body text-center" style={{ color: "green" }}>
            AIRDROP
            <Airdrop
              stakingBalance={this.props.stakingBalance}
              rewardTokens={this.props.rewardTokens}
              timestamp={this.props.timestamp}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
