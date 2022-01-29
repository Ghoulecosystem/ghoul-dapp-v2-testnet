import React, { useState, useContext } from "react";
import classes from "./LiquidateVaultModal.module.css";
import cancelIcon from "../../assets/cancel.svg";
import SnackbarUI from "../snackbar/SnackbarUI";
import Web3Context from "../../store/Web3-context";
import { liquidatorAddress } from "../../utils/contract_abis_mainnet";
import ThemeContext from "../../store/Theme-context";
import blackCross from "../../assets/fi_x.svg";

const LiquidateVaultModal = (props) => {
  const [gDaiApproved, setgDaiApproved] = useState(false);
  const web3Ctx = useContext(Web3Context);

  const themeCtx = useContext(ThemeContext);

  let bgColor;
  let bgColor2;
  let bgColorBox;
  let txtColor;
  let inputColor;
  let imgSrc = cancelIcon;
  if (!themeCtx.darkMode) {
    bgColor = "#FFFFFF";
    bgColorBox = "rgba(0, 0, 0, 0.2)";
    txtColor = "#000000";
    inputColor = "rgba(0, 0, 0, 0.1)";
    bgColor2 = "rgba(0, 0, 0, 0.5)";
    imgSrc = blackCross;
  }

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
    <div
      className={classes["vault-modal-container"]}
      style={{ background: !themeCtx.darkMode ? bgColor : undefined }}
    >
      <div className={classes["vault-modal-header"]}>
        <div style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
          {props.isBNB ? " BNB Vault " : " Weth Vault "}#{props.id}
        </div>
        <button onClick={props.closeHandler}>
          <img src={imgSrc} alt="" />
        </button>
      </div>
      <div
        className={classes["modal-line"]}
        style={{ background: !themeCtx.darkMode ? bgColor2 : undefined }}
      ></div>
      <div className={classes["vault-modal-content"]}>
        <div className={classes["vault-modal-content-item"]}>
          <span
            className={classes["col-one"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            Collateral
          </span>
          <span
            className={classes["col-two"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {props.collateralRaw} {props.isBNB ? "BNB" : "wETH"}
          </span>
          <span id={classes["collat-value"]}>${props.collateral}</span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span
            className={classes["col-one"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            Debt
          </span>
          <span
            className={classes["col-two"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {props.debt} gDAI
          </span>
          <span id={classes["debt-value"]}>${props.debt}</span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span
            className={classes["col-one"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            Collateral to Debt Ratio
          </span>
          <span
            className={classes["col-two"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {props.ratio} %
          </span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span
            className={classes["col-one"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            Available to Borrow
          </span>
          <span
            className={classes["col-two"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {props.availableBorrow} gDAI
          </span>
        </div>
      </div>
      {renderButtons()}
    </div>
  );
};

export default LiquidateVaultModal;
