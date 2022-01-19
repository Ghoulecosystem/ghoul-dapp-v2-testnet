import React, { useState, useContext } from "react";
import classes from "./LiqiduidateVaultModal.module.css";
import cancelIcon from "../../assets/cancel.svg";
import SnackbarUI from "../snackbar/SnackbarUI";
import Web3Context from "../../store/Web3-context";
import { liquidatorAddress } from "../../utils/contract_abis";

const LiquidateVaultModal = (props) => {
  const [gDaiApproved, setgDaiApproved] = useState(false);
  const web3Ctx = useContext(Web3Context);

  const liquidateVaultHandler = async () => {
    try {
      await props.liquidateVault(props.id, props.isBNB);
    } catch (error) {}
  };

  const approvegDaiHandler = async () => {
    props.approvegDaiLiquidator(props.isBNB);
  };

  if (props.isBNB) {
    if (parseInt(props.allowanceLiquidator) !== 0) {
      if (!gDaiApproved) {
        setgDaiApproved(true);
      }
    }
  } else {
    if (parseInt(props.allowanceLiquidatorWeth) !== 0) {
      if (!gDaiApproved) {
        setgDaiApproved(true);
      }
    }
  }

  const renderButtons = () => {
    if (!gDaiApproved) {
      return (
        <div className={classes["deposit-bnb"]} onClick={approvegDaiHandler}>
          Approve gDAI
        </div>
      );
    } else {
      return (
        <div className={classes["deposit-bnb"]} onClick={liquidateVaultHandler}>
          Liquidate Vault
        </div>
      );
    }
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
          <span className={classes["col-two"]}>{props.debt} gDAI</span>
          <span id={classes["debt-value"]}>${props.debt}</span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span className={classes["col-one"]}>Collateral to Debt Ratio</span>
          <span className={classes["col-two"]}>{props.ratio} %</span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span className={classes["col-one"]}>Available to Borrow</span>
          <span className={classes["col-two"]}>
            {props.availableBorrow} gDAI
          </span>
        </div>
      </div>
      {renderButtons()}
    </div>
  );
};

export default LiquidateVaultModal;
