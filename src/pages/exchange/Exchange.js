import React from "react";
import classes from "./Exchange.module.css";
import Header from "../../components/header/Header";
import ghoulLogo from "../../assets/ghoul_logo.svg";
import swapArrows from "../../assets/swap-arrows.svg";

const Exchange = () => {
  return (
    <div className={classes["exchange-container"]}>
      <Header title="Exchange"></Header>
      <div id={classes["vault-line"]}></div>
      <div className={classes["swap-box"]}>
        <h1 id={classes["mint-gdai"]}> Exchange</h1>
        <div className={classes["swap-line"]}></div>
        <div className={classes["swap-box-header"]}>
          <span className={classes["col-one"]}>
            Deposit <span id={classes.dai}>Dai</span>
          </span>
          <span className={classes["col-two"]}>
            Dai Balance: <span id={classes.balance}>0.0000</span>
          </span>
        </div>
        <div className={classes["swap-input"]}>
          <img src={ghoulLogo} alt="" />
          <input type="number" defaultValue={0} />
          <span id={classes.max}>MAX</span>
        </div>
        <div className={classes["swap-arrow"]}>
          <img src={swapArrows} alt="" />
        </div>
        <div className={classes["swap-box-header"]}>
          <span className={classes["col-one"]}>
            Recieve <span id={classes.dai}>Dai</span>
          </span>
          <span className={classes["col-two"]}>
            Availble gDai: <span id={classes.balance}>95.11</span>
          </span>
        </div>
        <div className={classes["swap-input"]}>
          <img src={ghoulLogo} alt="" />
          <input type="number" defaultValue={0} />
          <span id={classes.max}>MAX</span>
        </div>
        <div id={classes["swap-btn-div"]}>
          <button id={classes["swap-btn"]}>Swap</button>
        </div>
      </div>
    </div>
  );
};

export default Exchange;
