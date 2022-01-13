import React, { useState } from "react";
import bscLogo from "../../assets/bsc_logo.png";
import wethLogo from "../../assets/wEth_logo.svg";
import classes from "./VaultEntry.module.css";
import vaultArrow from "../../assets/responsive_vault_arrow.svg";

const VaultEntry = (props) => {
  const returnVaultData = () => {
    props.openModal(props.id, props.isBNB);
  };

  return (
    <>
      <div
        onClick={returnVaultData}
        className={classes["vault-item"]}
        data-id="123"
      >
        <div className={classes["vault-item-text"]}>
          <div id={classes["vault-id"]}>
            <img src={props.isBNB ? bscLogo : wethLogo} alt="" />
            <div>#{props.id}</div>
          </div>

          <div id={classes["one"]}>{props.collateral}</div>
          <div id={classes["two"]}>{props.debt}</div>
          {props.isLiq ? (
            <div id={classes["three-liq"]}>{props.ratio}</div>
          ) : (
            <div id={classes["three"]}>{props.ratio}</div>
          )}

          <span id={classes.arrow}>&gt;</span>
        </div>
      </div>
      <div
        onClick={returnVaultData}
        className={classes["vault-item-mobile"]}
        data-id="123"
      >
        {/* <div className={classes["vault-item-text-mobile"]}>
          <div id={classes["vault-id-mobile"]}>
            <img src={props.isBNB ? bscLogo : wethLogo} alt="" />
            <div>#{props.id}</div>
          </div>

          <div id={classes["one-mobile"]}>{props.collateral}</div>
          <div id={classes["two-mobile"]}>{props.debt}</div>
          <div id={classes["three-mobile"]}>{props.ratio}</div>
          <span id={classes.arrow}>&gt;</span>
        </div> */}
        <img
          src={props.isBNB ? bscLogo : wethLogo}
          alt=""
          id={classes["logo-img"]}
        />
        <div id={classes["vault-id-mobile"]}>
          <div>
            <span>VAULT ID</span>
          </div>
          <div>#{props.id}</div>
        </div>
        <div id={classes["one-mobile"]}>
          <span>COLLATERAL {props.isBNB ? "(BNB)" : "(wETH)"}</span>
          <div>{props.collateral}</div>
        </div>
        <div id={classes["two-mobile"]}>
          <span>DEBT (gDAI)</span>
          <div>{props.debt}</div>
        </div>
        <div id={classes["three-mobile"]}>
          <span>RATIO </span>

          {props.isLiq ? (
            <div id={classes["yellow-ratio"]}>{props.ratio}</div>
          ) : (
            <div>{props.ratio}</div>
          )}
        </div>
        <img src={vaultArrow} alt="vArrow" id={classes["vault-arrow"]} />
      </div>
    </>
  );
};

export default VaultEntry;
