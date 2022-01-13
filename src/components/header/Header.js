import React, { useContext, useEffect, useState } from "react";
import Web3Context from "../../store/Web3-context";
import classes from "./Header.module.css";
import pin from "../../assets/vault_pin.svg";
import bscLogo from "../../assets/bsc_logo.png";
import hamburgerIcon from "../../assets/hamburger_menu.png";
import NavbarHamburger from "../navbar/NavbarHamburger";

const Header = (props) => {
  const web3Ctx = useContext(Web3Context);

  const [showHamburger, setShowHamburger] = useState(false);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  useEffect(() => {
    if (!web3Ctx.walletAddress) {
      web3Ctx.manualConnect();
    }

    web3Ctx.checkIfWalletConnected();
  }, []);

  const showHamburgerHandler = () => {
    setShowHamburger(true);
  };

  const hideHamburgerHandler = () => {
    setShowHamburger(false);
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

      <div className={classes["vault-header"]}>
        <div id={classes["hamburger-icon"]} onClick={showHamburgerHandler}>
          <img src={hamburgerIcon} alt="hamburger-icon" />
        </div>
        <div className={classes["vault-info"]}>
          <div id={classes.vaults}>{props.title}</div>
        </div>
        <div className={classes["chain-wallet"]}>
          <div>
            {!web3Ctx.walletAddress ? (
              <p>CHAIN</p>
            ) : (
              <div id={classes["chain-connect"]}>
                <img src={bscLogo} alt="" />
                <div>BSC Network</div>
              </div>
            )}
          </div>

          {web3Ctx.walletAddress ? (
            <div onClick={() => {}} id={classes.connected}>
              <p>{shortenAddress(web3Ctx.walletAddress)}</p>
            </div>
          ) : (
            <div onClick={web3Ctx.connectWallet} id={classes.connect}>
              <p>Connect Wallet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
