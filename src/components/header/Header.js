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
  const [showLogout, setShowLogout] = useState(false);

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

  let link;
  switch (props.title) {
    case "Farms":
      link = "https://docs.ghoul.finance/resources/how-to/farm";
      break;
    case "Vaults":
      link = "https://docs.ghoul.finance/resources/how-to/vaults";
      break;
    case "Swap":
      link = "https://docs.ghoul.finance/resources/how-to/swap";
      break;
    default:
      break;
  }

  useEffect(() => {
    if (!web3Ctx.walletAddress) {
      web3Ctx.manualConnect();
    }
    themeCtx.toggleHamburgerFalse();
    web3Ctx.checkIfWalletConnected();
  }, []);

  const showHamburgerHandler = () => {
    setShowHamburger(true);
    themeCtx.toggleHamburger();
  };

  const hideHamburgerHandler = () => {
    setShowHamburger(false);
    themeCtx.toggleHamburgerFalse();
  };

  const enterHandler = () => {
    setShowLogout(true);
  };

  const outHandler = () => {
    setShowLogout(false);
  };

  const navigateDocs = () => {
    const newWindow = window.open(link, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
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
            <img src={pin} alt="" onClick={navigateDocs} />
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
                  BNB Smart Chain
                </div>
              </div>
            )}
          </div>

          {web3Ctx.walletAddress ? (
            <div
              onClick={web3Ctx.disconnect}
              id={classes.connected}
              style={{
                background: !themeCtx.darkMode ? bgColorBox : undefined,
              }}
              onMouseEnter={enterHandler}
              onMouseOut={outHandler}
            >
              <p
                style={{
                  color: !themeCtx.darkMode ? txtColor : undefined,
                  borderColor: showLogout ? "red" : undefined,
                  zIndex: 0,
                }}
                onMouseEnter={enterHandler}
                onMouseOut={outHandler}
              >
                {showLogout ? (
                  <span style={{ color: "red" }}>Disconnect</span>
                ) : (
                  shortenAddress(web3Ctx.walletAddress)
                )}
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
