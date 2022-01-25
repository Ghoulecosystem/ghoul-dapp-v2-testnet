import React, { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { useLocation } from "react-router-dom";
import classes from "./Navbar.module.css";
import logo from "../../assets/ghoul_logo_final.svg";
import bnbLogo from "../../assets/bnb_logo.svg";
import vault from "../../assets/vault-non-active.png";
import vaultActive from "../../assets/vaults-active.png";
import governance from "../../assets/governance.svg";
import socials from "../../assets/socials.svg";
import docsSupprt from "../../assets/docs_support.svg";
import { NavLink } from "react-router-dom";
import Web3Context from "../../store/Web3-context";
import ThemeContext from "../../store/Theme-context";
import swapLogo from "../../assets/swap.png";
import swapLogoActive from "../../assets/swap-active.png";
import farmLogo from "../../assets/farm.png";
import farmLogoActive from "../../assets/farm-active.png";
import exchangeLogo from "../../assets/exchange.png";
import bondLogo from "../../assets/bonds.png";
import prifiLogo from "../../assets/prifi.png";
import ghoulXLogo from "../../assets/GhoulX logo.png";
import ghoulTokenLogo from "../../assets/ghoul_logo_final.png";
import twitterLogo from "../../assets/twitterlogo.png";
import vaultLogoLm from "../../assets/vault-lm.png";
import swapLogoLm from "../../assets/swap-lm.png";
import farmLogoLm from "../../assets/farm-lm.png";
import exchangeLogoLm from "../../assets/exchange-lm.png";
import bondsLogoLm from "../../assets/bonds-lm.png";
import prifiLogoLm from "../../assets/prifi-lm.png";
import governanceLogoLm from "../../assets/governance-lm.svg";
import Switch from "@mui/material/Switch";
import ghoulXDarkMode from "../../assets/GhoulXDARKMODE.png";
import ghoulDarkMode from "../../assets/GHOULDARKMODE.png";
import gDaiDarkMode from "../../assets/gDAIDARKMODE.png";

const label = { inputProps: { "aria-label": "Switch demo" } };

const Navbar = () => {
  const web3Ctx = useContext(Web3Context);
  const themeCtx = useContext(ThemeContext);
  const [gDaiBalance, setgDaiBalance] = useState(0);
  const [ghoulBalance, setGhoulBalance] = useState(0);
  const [bnbBlance, setBNBBalance] = useState(0);
  const [ghoulXBalance, setGhoulXBalance] = useState(0);
  const tokenContract = web3Ctx.tokenContract;
  const ghoulContract = web3Ctx.ghoulContract;
  // const ghoulXContract = web3Ctx.ghoulXContract;
  // const daiContract = web3Ctx.daiContract;
  const walletAddress = web3Ctx.walletAddress;

  const location = useLocation();

  let bgColor;
  let filter;
  let elemColor;
  let txtColor;
  let txtColor2;
  let vaultIm = vault;
  let swapIm = swapLogo;
  let farmIm = farmLogo;
  let exchangeIm = exchangeLogo;
  let bondsIm = bondLogo;
  let prifiIm = prifiLogo;
  let governanceIm = governance;
  let ghoulxIm = ghoulXLogo;
  let ghoulIm = logo;
  let gdaiIm = ghoulTokenLogo;
  if (!themeCtx.darkMode) {
    bgColor =
      "linear-gradient(170.43deg, #FFFFFF 0%, rgba(234, 234, 234, 0) 99.52%)";
    filter = "drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25))";
    elemColor = "rgba(0, 0, 0, 0.05)";
    txtColor = "#000000";
    txtColor2 = "rgba(0, 0, 0, 0.3)";
    vaultIm = vaultLogoLm;
    farmIm = farmLogoLm;
    swapIm = swapLogoLm;
    exchangeIm = exchangeLogoLm;
    bondsIm = bondsLogoLm;
    prifiIm = prifiLogoLm;
    governanceIm = governanceLogoLm;
    ghoulxIm = ghoulXDarkMode;
    ghoulIm = ghoulDarkMode;
    gdaiIm = gDaiDarkMode;
  }

  const darkModeHandler = () => {
    themeCtx.toggleDarkMode();
  };

  useEffect(() => {}, [ghoulContract, tokenContract, walletAddress]);

  useEffect(() => {
    const loadBalances = async () => {
      let gdaiBalance = await tokenContract.balanceOf(walletAddress);
      let ghoulBalance = await ghoulContract.balanceOf(walletAddress);
      let gdaiBalanceFormat = parseFloat(
        ethers.utils.formatEther(gdaiBalance)
      ).toFixed(2);
      let ghoulBalanceFormat = parseFloat(
        ethers.utils.formatEther(ghoulBalance)
      ).toFixed(2);
      let ghoulXbalance = await web3Ctx.ghoulXContract.balanceOf(walletAddress);
      let ghoulXbalanceFormat = parseFloat(
        ethers.utils.formatEther(ghoulXbalance)
      ).toFixed(2);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(walletAddress);
      const balanceFormat = parseFloat(
        ethers.utils.formatEther(balance)
      ).toFixed(2);
      setBNBBalance(balanceFormat);
      setgDaiBalance(gdaiBalanceFormat);
      setGhoulBalance(ghoulBalanceFormat);
      setGhoulXBalance(ghoulXbalanceFormat);
    };

    loadBalances();
  }, [ghoulContract, tokenContract, walletAddress, web3Ctx.ghoulXContract]);

  return (
    <div
      className={classes["navbar-container"]}
      style={{
        background: !themeCtx.darkMode ? bgColor : undefined,
        filter: !themeCtx.darkMode ? filter : undefined,
      }}
    >
      <div className={classes["logo-container"]}>
        <img src={logo} alt="" width={46} height={46} />
      </div>
      <div className={classes["navbar-header"]}>
        <div className={classes["row-nav"]}>
          <div
            className={classes["row-elem"]}
            style={{
              background: !themeCtx.darkMode ? elemColor : undefined,
            }}
          >
            <span>
              <img src={ghoulIm} alt="" />
            </span>
            <h3
              style={{
                color: !themeCtx.darkMode ? txtColor : undefined,
              }}
            >
              {gDaiBalance}
            </h3>
          </div>
          <div
            className={classes["row-elem"]}
            style={{
              background: !themeCtx.darkMode ? elemColor : undefined,
            }}
          >
            <span>
              <img src={gdaiIm} alt="gl" width="24.72" height="16.41" />
            </span>
            <h3
              style={{
                color: !themeCtx.darkMode ? txtColor : undefined,
              }}
            >
              {ghoulBalance}
            </h3>
          </div>
        </div>
        <div className={classes["row-nav"]}>
          <div
            className={classes["row-elem"]}
            style={{
              background: !themeCtx.darkMode ? elemColor : undefined,
            }}
          >
            <span>
              <img src={ghoulxIm} alt="gxl" width="24.72" height="16.41" />
            </span>
            <h3
              style={{
                color: !themeCtx.darkMode ? txtColor : undefined,
              }}
            >
              {ghoulXBalance}
            </h3>
          </div>
          <div
            className={classes["row-elem"]}
            style={{
              background: !themeCtx.darkMode ? elemColor : undefined,
            }}
          >
            <span>
              <img src={bnbLogo} alt="" />
            </span>
            <h3
              style={{
                color: !themeCtx.darkMode ? txtColor : undefined,
              }}
            >
              {bnbBlance}
            </h3>
          </div>
        </div>
      </div>
      <h1
        id={classes["features-h1"]}
        style={{
          color: !themeCtx.darkMode ? txtColor2 : undefined,
        }}
      >
        FEATURES
      </h1>
      <div className={classes.features}>
        <NavLink
          activeClassName={classes["feature-elem-active"]}
          to="/vaults"
          style={{ textDecoration: "none" }}
        >
          <div className={classes["feature-elem"]}>
            <img
              className={classes["feature-community-img"]}
              src={location.pathname === "/vaults" ? vaultActive : vaultIm}
              alt=""
            />
            <h4>Vaults</h4>
          </div>
        </NavLink>

        <NavLink
          activeClassName={classes["feature-elem-active"]}
          to="/swap"
          style={{ textDecoration: "none" }}
        >
          <div className={classes["feature-elem"]}>
            <img
              className={classes["feature-community-img"]}
              src={location.pathname === "/swap" ? swapLogoActive : swapIm}
              alt=""
            />
            <h4>Swap</h4>
          </div>
        </NavLink>

        <NavLink
          activeClassName={classes["feature-elem-active"]}
          to="/farm"
          style={{ textDecoration: "none" }}
        >
          <div className={classes["feature-elem"]}>
            <img
              className={classes["feature-community-img"]}
              src={location.pathname === "/farm" ? farmLogoActive : farmIm}
              alt="farm"
            />
            <h4>Farm</h4>
          </div>
        </NavLink>

        <NavLink
          activeClassName={classes["feature-elem-active"]}
          to="/exchange"
          style={{ textDecoration: "none" }}
        >
          <div className={classes["feature-elem"]}>
            <img
              className={classes["feature-community-img"]}
              src={exchangeIm}
              alt=""
            />
            <h4>Exchange</h4>
          </div>
        </NavLink>

        <div className={classes["feature-elem"]}>
          <img
            className={classes["feature-community-img"]}
            src={bondsIm}
            alt=""
          />
          Bonds (soon)
        </div>

        <div className={classes["feature-elem"]}>
          <img
            className={classes["feature-community-img"]}
            src={prifiIm}
            alt=""
          />
          PRIFI (soon)
        </div>
      </div>

      <h1
        id={classes["community-h1"]}
        style={{
          color: !themeCtx.darkMode ? txtColor2 : undefined,
        }}
      >
        COMMUNITY
      </h1>
      <div className={classes.features}>
        <div className={classes["feature-elem"]}>
          <a
            href="https://snapshot.org/#/ghouldao.eth"
            target="_blank"
            style={{ textDecoration: "none" }}
            style={{ textDecoration: "none", color: "#5B5D64" }}
          >
            <img
              className={classes["feature-community-img"]}
              src={governanceIm}
              alt=""
              width="20"
              height="20"
            />
            Governance
          </a>
        </div>

        <div className={classes["feature-elem"]}>
          <a
            href="https://t.me/poltergeistlabs"
            target="_blank"
            style={{ textDecoration: "none", color: "#5B5D64" }}
          >
            <img
              className={classes["feature-community-img"]}
              src={socials}
              alt=""
              width="20"
              height="20"
            />
            Telegram{" "}
          </a>
        </div>
        <div className={classes["feature-elem"]}>
          <a
            href="http://twitter.com/poltergeistlabs"
            target="_blank"
            style={{ textDecoration: "none" }}
            style={{ textDecoration: "none", color: "#5B5D64" }}
          >
            <img
              className={classes["feature-community-img"]}
              src={twitterLogo}
              alt=""
              width="20"
              height="20"
            />
            Twitter{" "}
          </a>
        </div>

        <div className={classes["feature-elem"]}>
          <a
            href="https://docs.ghoul.finance/"
            target="_blank"
            style={{ textDecoration: "none", color: "#5B5D64" }}
          >
            <img
              className={classes["feature-community-img"]}
              src={docsSupprt}
              alt=""
              width="20"
              height="20"
            />
            Docs &#38; Support
          </a>
        </div>

        <div className={classes["feature-elem-2"]}>
          <div className={classes["dark-mode"]}>Dark Mode</div>
          <div className={classes["ios-switch"]}>
            {" "}
            <Switch
              {...label}
              checked={themeCtx.darkMode}
              color="default"
              onChange={darkModeHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
