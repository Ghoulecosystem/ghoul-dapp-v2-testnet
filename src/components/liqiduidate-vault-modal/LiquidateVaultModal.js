import React from "react";
import classes from "./LiqiduidateVaultModal.module.css";
import cancelIcon from "../../assets/cancel.svg";

const LiquidateVaultModal = (props) => {
  const liquidateVaultHandler = () => {
    props.liquidateVault(props.id, props.isBNB);
  };

  return (
    <div className={classes["vault-modal-container"]}>
      <div className={classes["vault-modal-header"]}>
        <div>
          {props.isBNB ? " BNB Vault " : " Weth Vault "}#{props.id}
        </div>
        <button onClick={props.closeHandler}>
          <img src={cancelIcon} alt="" />
        </button>
      </div>
      <div className={classes["modal-line"]}></div>
      <div className={classes["vault-modal-content"]}>
        <div className={classes["vault-modal-content-item"]}>
          <span className={classes["col-one"]}>Collateral</span>
          <span className={classes["col-two"]}>
            {props.collateralRaw} {props.isBNB ? "BNB" : "wETH"}
          </span>
          <span id={classes["collat-value"]}>${props.collateral}</span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span className={classes["col-one"]}>Debt</span>
          <span className={classes["col-two"]}>{props.debt} gDai</span>
          <span id={classes["debt-value"]}>${props.debt}</span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span className={classes["col-one"]}>Collateral to Debt Ratio</span>
          <span className={classes["col-two"]}>{props.ratio} %</span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span className={classes["col-one"]}>Available to Borrow</span>
          <span className={classes["col-two"]}>
            {props.availableBorrow} gDai
          </span>
        </div>
      </div>
      <div className={classes["deposit-bnb"]} onClick={liquidateVaultHandler}>
        Liquidate Vault
      </div>
    </div>
  );
};

export default LiquidateVaultModal;
