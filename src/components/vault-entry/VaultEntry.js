import React, { useState, useContext } from "react";
import bscLogo from "../../assets/bsc_logo.png";
import wethLogo from "../../assets/wEth_logo.svg";
import classes from "./VaultEntry.module.css";
import vaultArrow from "../../assets/responsive_vault_arrow.svg";
import ThemeContext from "../../store/Theme-context";

const VaultEntry = (props) => {
  const returnVaultData = () => {
    props.openModal(props.id, props.isBNB);
  };

  const themeCtx = useContext(ThemeContext);

  let bgColorBox;
  let txtColor;
  if (!themeCtx.darkMode) {
    bgColorBox = "rgba(0, 0, 0, 0.03)";
    txtColor = "#000000";
  }

  return (
    <>
      <div
        onClick={returnVaultData}
        className={classes["vault-item"]}
        data-id="123"
        style={{ background: !themeCtx.darkMode ? bgColorBox : undefined }}
      >
        <div
          className={classes["vault-item-text"]}
          style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
        >
          <div id={classes["vault-id"]}>
            <img src={props.isBNB ? bscLogo : wethLogo} alt="" />
            <div>#{props.id}</div>
          </div>

          <div id={classes["one"]}>{props.collateral}</div>
          <div id={classes["two"]}>{props.debt}</div>
          {props.isLiq ? (
            <div id={classes["three-liq"]}>{props.ratio}%</div>
          ) : props.ratio > 1 && props.ratio <= 150 ? (
            <div id={classes["three-liq"]}>{props.ratio}%</div>
          ) : (
            <div id={classes["three"]}>{props.ratio}%</div>
          )}

          <span id={classes.arrow}>&gt;</span>
        </div>
      </div>
      <div
        onClick={returnVaultData}
        className={classes["vault-item-mobile"]}
        data-id="123"
        style={{ background: !themeCtx.darkMode ? bgColorBox : undefined }}
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
            <span style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
              VAULT ID
            </span>
          </div>
          <div style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
            #{props.id}
          </div>
        </div>
        <div id={classes["one-mobile"]}>
          <span style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
            COLLATERAL {props.isBNB ? "(BNB)" : "(wETH)"}
          </span>
          <div style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
            {props.collateral}
          </div>
        </div>
        <div id={classes["two-mobile"]}>
          <span style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
            DEBT (gDAI)
          </span>
          <div style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
            {" "}
            {props.debt}
          </div>
        </div>
        <div id={classes["three-mobile"]}>
          <span style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
            RATIO{" "}
          </span>

          {props.isLiq ? (
            <div id={classes["yellow-ratio"]}>{props.ratio}%</div>
          ) : (
            <div style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
              {props.ratio}%
            </div>
          )}
        </div>
        <img src={vaultArrow} alt="vArrow" id={classes["vault-arrow"]} />
      </div>
    </>
  );
};

export default VaultEntry;
