import React, { useContext, useEffect, useState } from "react";
import Web3Context from "../../store/Web3-context";
import ThemeContext from "../../store/Theme-context";
import classes from "./Header.module.css";
import pin from "../../assets/vault_pin.svg";
import bscLogo from "../../assets/bsc_logo.png";
import hamburgerIcon from "../../assets/hamburger_menu.png";
import hamburgerIconDark from "../../assets/blackhamburger.svg";
import NavbarHamburger from "../navbar/NavbarHamburger";

const Header = (props) => {
  const web3Ctx = useContext(Web3Context);
  const themeCtx = useContext(ThemeContext);
  const [showHamburger, setShowHamburger] = useState(false);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  let bgColor;
  let bgColorBox;
  let txtColor;
  let inputColor;
  let hamburgerIm = hamburgerIcon;
  if (!themeCtx.darkMode) {
    bgColor = "#FFFFFF";
    bgColorBox = "rgba(0, 0, 0, 0.05)";
    txtColor = "#000000";
    inputColor = "rgba(0, 0, 0, 0.1)";
    hamburgerIm = hamburgerIconDark;
  }

  useEffect(() => {
    if (!web3Ctx.walletAddress) {
      web3Ctx.manualConnect();
    }

    web3Ctx.checkIfWalletConnected();
  }, []);

  const showHamburgerHandler = () => {
    setShowHamburger(true);
    themeCtx.toggleHamburger();
  };

  const hideHamburgerHandler = () => {
    setShowHamburger(false);
    themeCtx.toggleHamburger();
  };

  return (
    <>
      {showHamburger && (
        <div className={classes["hamburger-container"]}>
          <NavbarHamburger
            closeHandler={hideHamburgerHandler}
          ></NavbarHamburger>
        </div>
      )}

      <div
        className={classes["vault-header"]}
        style={{ background: !themeCtx.darkMode ? bgColor : undefined }}
      >
        <div id={classes["hamburger-icon"]} onClick={showHamburgerHandler}>
          <img src={hamburgerIm} alt="hamburger-icon" />
        </div>
        <div className={classes["vault-info"]}>
          <div
            id={classes.vaults}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {props.title}
          </div>
        </div>
        <div className={classes["chain-wallet"]}>
          <div
            style={{ background: !themeCtx.darkMode ? bgColorBox : undefined }}
          >
            {!web3Ctx.walletAddress ? (
              <p style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
                {" "}
                CHAIN
              </p>
            ) : (
              <div id={classes["chain-connect"]}>
                <img src={bscLogo} alt="" />
                <div
                  style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                >
                  BSC Network
                </div>
              </div>
            )}
          </div>

          {web3Ctx.walletAddress ? (
            <div
              onClick={() => {}}
              id={classes.connected}
              style={{
                background: !themeCtx.darkMode ? bgColorBox : undefined,
              }}
            >
              <p
                style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                onClick={web3Ctx.disconnect}
              >
                {shortenAddress(web3Ctx.walletAddress)}
              </p>
            </div>
          ) : (
            <div
              onClick={web3Ctx.connectWallet}
              id={classes.connect}
              style={{
                background: !themeCtx.darkMode ? bgColorBox : undefined,
              }}
            >
              <p style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
                Connect Wallet
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
