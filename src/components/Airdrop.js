import React, { Component } from "react";

class Airdrop extends Component {
  constructor() {
    super();
    this.state = { time: {}, seconds: 3600 };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  startTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // 1 . countdown one second at a time
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
    
    // 2. stop counting when we hit zero
    if (seconds === 0) {
      clearInterval(this.timer);
    }
  }

  secondsToTime(secs) {
    let hours, minutes, seconds;
    hours = Math.floor(secs / (60 * 60));

    let devisor_for_minutes = secs % (60 * 60);
    minutes = Math.floor(devisor_for_minutes / 60);

    let devisor_for_seconds = devisor_for_minutes % 60;
    seconds = Math.ceil(devisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  }

  componentDidMount() {
    let stackingDate = new Date(this.props.timestamp * 1000);
    stackingDate.setTime(stackingDate.getTime() + (60*60*1000));
    const secondsLeft = ((stackingDate.getTime() - new Date().getTime()) / 1000);
    this.setState({ seconds:  secondsLeft > 0 ? secondsLeft : 1}); 
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  airdropReleaseTokens() {
    let stakingB = this.props.stakingBalance;
    if (stakingB >= window.web3.utils.toWei('50', 'ether')) {
      this.startTimer();
    }
    if(this.state.seconds === 0) {
        this.props.rewardTokens();
    }
  }

  render() {
    this.airdropReleaseTokens();

    return (
      <div style={{ color: "black" }}>
        {this.state.time.h}:{this.state.time.m}:{this.state.time.s}
      </div>
    );
  }
}

export default Airdrop;
