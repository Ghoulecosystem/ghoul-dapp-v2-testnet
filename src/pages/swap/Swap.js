import React, { useEffect, useState, useContext, useCallback } from "react";
import classes from "./Swap.module.css";
import Header from "../../components/header/Header";
import ghoulLogo from "../../assets/ghoul_logo.svg";
import daiLogo from "../../assets/dai_logo.svg";
import swapArrows from "../../assets/swap-arrows.svg";
import {
  swapAddress,
  busdSwapAddress,
  usdcSwapAddress,
  usdtSwapAddress,
} from "../../utils/contract_test_abis_repo";
import Web3Context from "../../store/Web3-context";
import LoadingImg from "../../components/loading-img-component/LoadingImg";
import { ethers } from "ethers";
import SnackbarUI from "../../components/snackbar/SnackbarUI";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";

const Swap = () => {
  const web3Ctx = useContext(Web3Context);
  const [isLoadingReserves, setIsLoadingReserves] = useState(false);
  const [reserves, setReserves] = useState({});
  const [togDai, setTogDai] = useState(true);
  const [daiApproved, setDaiApproved] = useState(false);
  const [gDaiApproved, setgDaiApproved] = useState(false);
  const [busdApproved, setBusdApproved] = useState(false);
  const [usdcApproved, setUsdcApproved] = useState(false);
  const [usdtApproved, setUsdtApproved] = useState(false);
  const [isLoadingSwap, setIsLoadingSwap] = useState(false);
  const [exceedingBalance, setExceedingBalance] = useState(false);
  const [exceedingBalanceWallet, setExceedingBalanceWallet] = useState(false);
  const [inputOneValue, setInputOneValue] = useState(0);
  const [inputTwoValue, setInputTwoValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    error: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [coin, setCoin] = useState("DAI");
  const [coinBalance, setCoinBalance] = useState(0);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    const { myValue } = event.currentTarget.dataset;
    if (!myValue) {
      setAnchorEl(null);
      return;
    }
    setCoin(myValue);
    setAnchorEl(null);
  };

  const loadReserves = useCallback(async () => {
    try {
      setIsLoadingReserves(true);
      // BALANCES
      const gDaiBalance = await web3Ctx.tokenContract.balanceOf(
        web3Ctx.walletAddress
      );
      const gDaiBalanceFormat = ethers.utils.formatEther(gDaiBalance);

      console.log(web3Ctx.daiContract);
      const daiBalance = await web3Ctx.daiContract.balanceOf(
        web3Ctx.walletAddress
      );
      const daiBalanceFormat = ethers.utils.formatEther(daiBalance);

      console.log(web3Ctx.busdSwapContract);
      const busdBalance = await web3Ctx.busdSwapContract.balanceOf(
        web3Ctx.walletAddress
      );
      const busdBalanceFormat = ethers.utils.formatEther(busdBalance);

      const usdcBalance = await web3Ctx.usdcSwapContract.balanceOf(
        web3Ctx.walletAddress
      );
      const usdcBalanceFormat = ethers.utils.formatEther(usdcBalance);
      const usdtBalance = await web3Ctx.usdtSwapContract.balanceOf(
        web3Ctx.walletAddress
      );
      const usdtBalanceFormat = ethers.utils.formatEther(usdtBalance);

      // ALLOWANCES
      const gDaiAllowance = await web3Ctx.tokenContract.allowance(
        web3Ctx.walletAddress,
        swapAddress
      );
      const gDaiAllowanceFormat = ethers.utils.formatEther(gDaiAllowance);

      const daiAllowance = await web3Ctx.daiContract.allowance(
        web3Ctx.walletAddress,
        swapAddress
      );
      const daiAllowanceFormat = ethers.utils.formatEther(
        daiAllowance.toString()
      );

      const busdAllowance = await web3Ctx.busdSwapContract.allowance(
        web3Ctx.walletAddress,
        busdSwapAddress
      );
      const busdAllowanceFormat = ethers.utils.formatEther(busdAllowance);

      const usdcAllowance = await web3Ctx.usdcSwapContract.allowance(
        web3Ctx.walletAddress,
        usdcSwapAddress
      );
      const usdcAllowanceFormat = ethers.utils.formatEther(usdcAllowance);

      const usdtAllowance = await web3Ctx.usdtSwapContract.allowance(
        web3Ctx.walletAddress,
        usdtSwapAddress
      );
      const usdtAllowanceFormat = ethers.utils.formatEther(usdtAllowance);

      if (parseInt(gDaiAllowanceFormat) !== 0) {
        setgDaiApproved(true);
      }

      if (daiAllowanceFormat !== 0) {
        setDaiApproved(true);
      }

      if (busdAllowanceFormat !== 0) {
        setBusdApproved(true);
      }

      if (usdcAllowanceFormat !== 0) {
        setUsdcApproved(true);
      }

      if (usdtAllowanceFormat !== 0) {
        setUsdtApproved(true);
      }

      // RESERVES
      const reserve = await web3Ctx.swapContract.getReserves();
      const daiRate = await web3Ctx.swapContract.daiRate();
      const daiRateFormat = parseInt(daiRate._hex, 16);
      const gDaiRate = await web3Ctx.swapContract.ghostdaiRate();
      const gDaiRateFormat = parseInt(gDaiRate._hex, 16);

      const gdaiReserveFormat = parseFloat(
        ethers.utils.formatEther(reserve[0].toString())
      ).toFixed(2);
      const daiReserveFormat = parseFloat(
        ethers.utils.formatEther(reserve[1].toString())
      ).toFixed(2);

      const busdReserves = await web3Ctx.busdSwapContract.getReserves();
      const busdRate = await web3Ctx.busdSwapContract.busdRate();
      const busdRateFormat = parseInt(busdRate._hex, 16);
      const gDaiRateBusd = await web3Ctx.busdSwapContract.ghostdaiRate();
      const gDaiRateBusdFormat = parseInt(gDaiRateBusd._hex, 16);

      const gdaiReserveFormatBusd = parseFloat(
        ethers.utils.formatEther(busdReserves[0].toString())
      ).toFixed(2);
      const busdReserveFormat = parseFloat(
        ethers.utils.formatEther(busdReserves[1].toString())
      ).toFixed(2);

      const usdcReserves = await web3Ctx.usdcSwapContract.getReserves();
      const usdcRate = await web3Ctx.usdcSwapContract.usdcRate();
      const usdcRateFormat = parseInt(usdcRate._hex, 16);
      const gDaiRateUsdc = await web3Ctx.usdcSwapContract.ghostdaiRate();
      const gDaiRateUsdcFormat = parseInt(gDaiRateUsdc._hex, 16);

      const gdaiReserveFormatUsdc = parseFloat(
        ethers.utils.formatEther(usdcReserves[0].toString())
      ).toFixed(2);
      const usdcReserveFormat = parseFloat(
        ethers.utils.formatEther(usdcReserves[1].toString())
      ).toFixed(2);

      const usdtReserves = await web3Ctx.usdtSwapContract.getReserves();
      const usdtRate = await web3Ctx.usdtSwapContract.usdtRate();
      const usdtRateFormat = parseInt(usdtRate._hex, 16);
      const gDaiRateUsdt = await web3Ctx.usdtSwapContract.ghostdaiRate();
      const gDaiRateUsdtFormat = parseInt(gDaiRateUsdt._hex, 16);

      const gdaiReserveFormatUsdt = parseFloat(
        ethers.utils.formatEther(usdtReserves[0].toString())
      ).toFixed(2);
      const usdtReserveFormat = parseFloat(
        ethers.utils.formatEther(usdtReserves[1].toString())
      ).toFixed(2);

      setReserves({
        gDaiBalance: gDaiBalanceFormat,
        daiBalance: daiBalanceFormat,
        gDaiAllowance: gDaiAllowanceFormat,
        daiAllowance: daiAllowanceFormat,
        daiRate: daiRateFormat,
        gDaiRate: gDaiRateFormat,
        gDaiReserve: gdaiReserveFormat,
        daiReserve: daiReserveFormat,
      });
      setIsLoadingReserves(false);
    } catch (error) {
      setIsLoadingReserves(false);
      console.log(error);
    }
  }, [
    web3Ctx.busdSwapContract,
    web3Ctx.daiContract,
    web3Ctx.swapContract,
    web3Ctx.tokenContract,
    web3Ctx.usdcSwapContract,
    web3Ctx.usdtSwapContract,
    web3Ctx.walletAddress,
  ]);

  useEffect(() => {
    loadReserves();
    return () => {
      setReserves({});
    };
  }, [
    loadReserves,
    web3Ctx.daiContract,
    web3Ctx.swapContract,
    web3Ctx.tokenContract,
    web3Ctx.walletAddress,
  ]);

  const flipHandler = () => {
    setTogDai(!togDai);
    setInputOneValue(0);
    setInputTwoValue(0);
    setExceedingBalance(false);
  };

  const approveHandler = async () => {
    setIsLoadingSwap(true);

    try {
      if (togDai) {
        const tx = await web3Ctx.daiContract.approve(
          swapAddress,
          ethers.utils.parseEther("1000000000000000")
        );

        setSnackbarOpen({ open: true, error: false });
        await tx.wait();
      } else {
        const tx = await web3Ctx.tokenContract.approve(
          swapAddress,
          ethers.utils.parseEther("1000000000000000")
        );

        setSnackbarOpen({ open: true, error: false });
        await tx.wait();
      }

      loadReserves();
    } catch (error) {
      setSnackbarOpen({ open: true, error: true });
      console.log(error);
    }

    setIsLoadingSwap(false);
  };

  const swapHandler = async () => {
    if (inputOneValue <= 0) {
      setSnackbarOpen({ open: true, error: true });
      return;
    }

    try {
      setIsLoadingSwap(true);
      if (togDai) {
        console.log(inputOneValue);
        console.log(ethers.utils.parseEther(inputOneValue.toString()));
        const tx = await web3Ctx.swapContract.swapFrom(
          ethers.utils.parseEther(inputOneValue.toString())
        );
        setSnackbarOpen({ open: true, error: false });
        await tx.wait();
        loadReserves();
        setInputOneValue(0);
        setInputTwoValue(0);
        setIsLoadingSwap(false);
      } else {
        console.log(inputOneValue);
        console.log(ethers.utils.parseEther(inputOneValue.toString()));
        const tx = await web3Ctx.swapContract.swapTo(
          ethers.utils.parseEther(inputOneValue.toString())
        );
        setSnackbarOpen({ open: true, error: false });
        await tx.wait();
        setInputOneValue(0);
        setInputTwoValue(0);
        loadReserves();

        setIsLoadingSwap(false);
      }
    } catch (error) {
      console.log(error);
      setSnackbarOpen({ open: true, error: true });
      setIsLoadingSwap(false);
    }
  };

  const maxHandlerOne = () => {
    let recieveValue;

    if (togDai) {
      recieveValue = (
        (parseFloat(reserves.daiBalance) * parseFloat(reserves.daiRate)) /
        100
      ).toFixed(2);

      recieveValue = recieveValue - recieveValue * (1 / 100);
      if (recieveValue > parseFloat(reserves.gDaiReserve)) {
        setExceedingBalance(true);
      } else {
        setExceedingBalance(false);
      }
      setInputOneValue(parseFloat(reserves.daiBalance).toFixed(2));
      setInputTwoValue(recieveValue);
    } else {
      recieveValue = (
        (parseFloat(reserves.gDaiBalance) * parseFloat(reserves.gDaiRate)) /
        100
      ).toFixed(2);
      recieveValue = recieveValue - recieveValue * (1 / 100);

      if (recieveValue > parseFloat(reserves.daiReserve)) {
        setExceedingBalance(true);
      } else {
        setExceedingBalance(false);
      }

      setInputOneValue(parseFloat(reserves.gDaiBalance).toFixed(2));
      setInputTwoValue(recieveValue);
    }
  };

  const inputOneHandler = (value) => {
    if (value < 0) {
      value = Math.abs(value);
    }

    if (togDai && value > parseFloat(reserves.daiAllowance)) {
      setDaiApproved(false);
    }

    if (!togDai && value > parseFloat(reserves.gDaiAllowance)) {
      setgDaiApproved(false);
    }

    // if (togDai && value > parseFloat(reserves.daiBalance)) {
    //   value = reserves.daiBalance;
    // }

    // if (!togDai && value > parseFloat(reserves.gDaiBalance)) {
    //   value = reserves.gDaiBalance;
    // }

    let recieveValue;

    if (togDai) {
      // LOGIC HERE TO HANDLE 3 OTHER COINS

      switch (coin) {
        case "DAI":
          recieveValue = (
            (parseFloat(value) * parseFloat(reserves.daiRate)) /
            100
          ).toFixed(2);

          recieveValue = recieveValue - recieveValue * (1 / 100);

          if (recieveValue > parseFloat(reserves.gDaiReserve)) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }

          if (value > reserves.daiBalance) {
            setExceedingBalanceWallet(true);
          } else {
            setExceedingBalanceWallet(false);
          }
          break;
        case "BUSD":
          break;
        case "USDC":
          break;
        case "USDT":
          break;

        default:
          break;
      }
    } else {
      switch (coin) {
        case "DAI":
          break;
        case "BUSD":
          break;
        case "USDC":
          break;
        case "USDT":
          break;

        default:
          break;
      }
      recieveValue = (
        (parseFloat(value) * parseFloat(reserves.gDaiRate)) /
        100
      ).toFixed(2);

      if (recieveValue > parseFloat(reserves.daiReserve)) {
        setExceedingBalance(true);
      } else {
        setExceedingBalance(false);
      }

      if (value > reserves.gDaiBalance) {
        setExceedingBalanceWallet(true);
      } else {
        setExceedingBalanceWallet(false);
      }
    }

    setInputOneValue(value);
    setInputTwoValue(recieveValue);
  };

  const inputTwoHandler = () => {};

  return (
    <div className={classes["swap-container"]}>
      <Header title="Swap"></Header>
      <div id={classes["vault-line"]}></div>
      {isLoadingReserves ? (
        <LoadingImg />
      ) : (
        <div className={classes["swap-box"]}>
          <>
            <h1 id={classes["mint-gdai"]}> Mint gDAI with Stablecoins</h1>
            <div className={classes["swap-line"]}></div>
            <div className={classes["swap-box-header"]}>
              <span className={classes["col-one"]}>
                Deposit <span id={classes.dai}>{togDai ? coin : "gDAI"}</span>
                <div id={classes["dai-2"]}></div>
              </span>
              <span className={classes["col-two"]}>
                {togDai ? coin : "gDAI"}
                {" Balance: "}
                <span id={classes.balance}>
                  {togDai ? reserves.daiBalance : reserves.gDaiBalance}
                </span>
              </span>
            </div>
            <div className={classes["swap-input"]}>
              <Button
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                style={{
                  color: "#74ec65",
                  padding: "0",
                  minWidth: 0,
                }}
              >
                <img
                  src={togDai ? daiLogo : ghoulLogo}
                  alt=""
                  id={classes["swap-menu-icon"]}
                />
              </Button>
              <Menu
                id="fade-menu"
                MenuListProps={{
                  "aria-labelledby": "fade-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                PaperProps={{
                  style: {
                    transform: "translateX(-190px) translateY(-120px)",
                    backgroundColor: "#090a10ba",
                    color: "white",
                  },
                }}
              >
                <MenuItem data-my-value={"DAI"} onClick={handleClose}>
                  DAI
                </MenuItem>
                <MenuItem data-my-value={"BUSD"} onClick={handleClose}>
                  BUSD
                </MenuItem>
                <MenuItem data-my-value={"USDC"} onClick={handleClose}>
                  USDC
                </MenuItem>
                <MenuItem data-my-value={"USDT"} onClick={handleClose}>
                  USDT
                </MenuItem>
              </Menu>

              <input
                type="number"
                defaultValue={0}
                max={togDai ? reserves.daiBalance : reserves.gDaiBalance}
                value={inputOneValue}
                onChange={(e) => {
                  inputOneHandler(e.target.value);
                }}
              />
              <span id={classes.max} onClick={maxHandlerOne}>
                MAX
              </span>
            </div>
            <div className={classes["swap-arrow"]}>
              <img src={swapArrows} alt="" onClick={flipHandler} />
            </div>
            <div className={classes["swap-box-header"]}>
              <span className={classes["col-one"]}>
                Recieve <span id={classes.dai}>{togDai ? "gDAI" : coin}</span>
              </span>
              <span className={classes["col-two"]}>
                Availble {togDai ? "gDAI: " : `${coin}:`}
                <span id={classes.balance}>
                  {togDai ? reserves.gDaiReserve : reserves.daiReserve}
                </span>
              </span>
            </div>
            <div className={classes["swap-input"]}>
              <img src={togDai ? ghoulLogo : daiLogo} alt="" />
              <input
                type="number"
                defaultValue={0}
                max={togDai ? reserves.gDaiBalance : reserves.daiBalance}
                value={inputTwoValue}
                onChange={(e) => {
                  inputTwoHandler(e.target.value);
                }}
              />
            </div>
            <div id={classes["swap-btn-div"]}>
              {exceedingBalance && (
                <button id={classes["approve-btn"]}>
                  Deposit Exceeds Available Reserves or User Balance
                </button>
              )}
              {togDai &&
                !exceedingBalance &&
                (daiApproved ? (
                  <button id={classes["swap-btn"]} onClick={swapHandler}>
                    Swap
                  </button>
                ) : (
                  <button id={classes["approve-btn"]} onClick={approveHandler}>
                    Approve DAI
                  </button>
                ))}
              {!togDai &&
                !exceedingBalance &&
                (gDaiApproved ? (
                  <button id={classes["swap-btn"]} onClick={swapHandler}>
                    Swap
                  </button>
                ) : (
                  <button id={classes["approve-btn"]} onClick={approveHandler}>
                    Approve gDAI
                  </button>
                ))}
            </div>
            <div id={classes["footer-text"]}>
              <p>Static fee of 1%</p>
            </div>
          </>
          {snackbarOpen.open && <SnackbarUI error={snackbarOpen.error} />}
        </div>
      )}
    </div>
  );
};

export default Swap;
