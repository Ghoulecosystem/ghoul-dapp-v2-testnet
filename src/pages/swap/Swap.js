import React, { useEffect, useState, useContext, useCallback } from "react";
import classes from "./Swap.module.css";
import Header from "../../components/header/Header";
import ghoulLogo from "../../assets/ghoul_logo.svg";
import daiLogo from "../../assets/dai_logo.svg";
import swapArrows from "../../assets/swap-arrows.svg";
import { swapAddress } from "../../utils/contract_test_abis_repo";
import Web3Context from "../../store/Web3-context";
import LoadingImg from "../../components/loading-img-component/LoadingImg";
import { ethers } from "ethers";
import SnackbarUI from "../../components/snackbar/SnackbarUI";

const Swap = () => {
  const web3Ctx = useContext(Web3Context);

  const [isLoadingReserves, setIsLoadingReserves] = useState(false);
  const [reserves, setReserves] = useState({});
  const [togDai, setTogDai] = useState(true);
  const [daiApproved, setDaiApproved] = useState(false);
  const [gDaiApproved, setgDaiApproved] = useState(false);
  const [isLoadingSwap, setIsLoadingSwap] = useState(false);
  const [exceedingBalance, setExceedingBalance] = useState(false);
  const [exceedingBalanceWallet, setExceedingBalanceWallet] = useState(false);
  const [inputOneValue, setInputOneValue] = useState(0);
  const [inputTwoValue, setInputTwoValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    error: false,
  });

  const loadReserves = useCallback(async () => {
    try {
      setIsLoadingReserves(true);
      const gDaiBalance = await web3Ctx.tokenContract.balanceOf(
        web3Ctx.walletAddress
      );
      const gDaiBalanceFormat = ethers.utils.formatEther(gDaiBalance);
      const daiBalance = await web3Ctx.daiContract.balanceOf(
        web3Ctx.walletAddress
      );
      const daiBalanceFormat = ethers.utils.formatEther(daiBalance);
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

      if (parseInt(gDaiAllowanceFormat) !== 0) {
        setgDaiApproved(true);
      }

      if (daiAllowanceFormat !== 0) {
        setDaiApproved(true);
      }

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
    web3Ctx.daiContract,
    web3Ctx.swapContract,
    web3Ctx.tokenContract,
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
    } else {
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
                Deposit <span id={classes.dai}>{togDai ? "DAI" : "gDAI"}</span>
              </span>
              <span className={classes["col-two"]}>
                {togDai ? "DAI" : "gDAI"}
                {" Balance: "}
                <span id={classes.balance}>
                  {togDai ? reserves.daiBalance : reserves.gDaiBalance}
                </span>
              </span>
            </div>
            <div className={classes["swap-input"]}>
              <img src={togDai ? daiLogo : ghoulLogo} alt="" />
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
                Recieve <span id={classes.dai}>{togDai ? "gDAI" : "DAI"}</span>
              </span>
              <span className={classes["col-two"]}>
                Availble {togDai ? "gDAI: " : "DAI: "}
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
