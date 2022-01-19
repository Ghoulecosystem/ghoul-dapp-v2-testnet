import React, { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { useLocation } from "react-router-dom";
import classes from "./Navbar.module.css";
import logo from "../../assets/ghoul_logo.svg";
import bnbLogo from "../../assets/bnb_logo.svg";
import vault from "../../assets/vault-non-active.png";
import vaultActive from "../../assets/vaults-active.png";
import governance from "../../assets/governance.svg";
import socials from "../../assets/socials.svg";
import docsSupprt from "../../assets/docs_support.svg";
import { NavLink } from "react-router-dom";
import Web3Context from "../../store/Web3-context";
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

const Navbar = () => {
  const web3Ctx = useContext(Web3Context);
  const [gDaiBalance, setgDaiBalance] = useState(0);
  const [ghoulBalance, setGhoulBalance] = useState(0);
  const [bnbBlance, setBNBBalance] = useState(0);
  const [darkMode, setDarkmode] = useState(true);
  const tokenContract = web3Ctx.tokenContract;
  const ghoulContract = web3Ctx.goulContract;
  // const ghoulXContract = web3Ctx.goulXContract;
  // const daiContract = web3Ctx.daiContract;
  const walletAddress = web3Ctx.walletAddress;

  const location = useLocation();

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

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(walletAddress);
      const balanceFormat = parseFloat(
        ethers.utils.formatEther(balance)
      ).toFixed(2);
      setBNBBalance(balanceFormat);
      setgDaiBalance(gdaiBalanceFormat);
      setGhoulBalance(ghoulBalanceFormat);
    };

    loadBalances();
  }, [ghoulContract, tokenContract, walletAddress]);

  const darkModeHandler = (event) => {
    setDarkmode(event.target.checked);
    localStorage.setItem("darkMode", event.target.checked.toString());
  };

  return (
    <div className={classes["navbar-container"]}>
      <div className={classes["logo-container"]}>
        <img src={logo} alt="" />
      </div>
      <div className={classes["navbar-header"]}>
        <div className={classes["row-nav"]}>
          <div className={classes["row-elem"]}>
            <span>
              <img src={logo} alt="" />
            </span>
            <h3>{gDaiBalance}</h3>
          </div>
          <div className={classes["row-elem"]}>
            <span>
              <img src={ghoulTokenLogo} alt="gl" width="24.72" height="16.41" />
            </span>
            <h3>{ghoulBalance}</h3>
          </div>
        </div>
        <div className={classes["row-nav"]}>
          <div className={classes["row-elem"]}>
            <span>
              <img src={ghoulXLogo} alt="gxl" width="24.72" height="16.41" />
            </span>
            <h3>2.00</h3>
          </div>
          <div className={classes["row-elem"]}>
            <span>
              <img src={bnbLogo} alt="" />
            </span>
            <h3>{bnbBlance}</h3>
          </div>
        </div>
      </div>
      <h1 id={classes["features-h1"]}>FEATURES</h1>
      <div className={classes.features}>
        <NavLink
          activeClassName={classes["feature-elem-active"]}
          to="/vaults"
          style={{ textDecoration: "none" }}
        >
          <div className={classes["feature-elem"]}>
            <img
              className={classes["feature-community-img"]}
              src={location.pathname === "/vaults" ? vaultActive : vault}
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
              src={location.pathname === "/swap" ? swapLogoActive : swapLogo}
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
              src={location.pathname === "/farm" ? farmLogoActive : farmLogo}
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
              src={exchangeLogo}
              alt=""
            />
            <h4>Exchange</h4>
          </div>
        </NavLink>

        <div className={classes["feature-elem"]}>
          <img
            className={classes["feature-community-img"]}
            src={bondLogo}
            alt=""
          />
          Bonds (soon)
        </div>

        <div className={classes["feature-elem"]}>
          <img
            className={classes["feature-community-img"]}
            src={prifiLogo}
            alt=""
          />
          PRIFI (soon)
        </div>
      </div>

      <h1 id={classes["community-h1"]}>COMMUNITY</h1>
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
              src={governance}
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

        <div className={classes["feature-elem"]}>
          <div className={classes["dark-mode"]}>Dark Mode</div>
          <div className={classes["ios-switch"]}>
            {" "}
            {/* <FormControlLabel
              checked={darkMode}
              onChange={darkModeHandler}
              control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
              label=""
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
