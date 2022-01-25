import React, { useEffect, useState, useContext, useCallback } from "react";
import classes from "./Swap.module.css";
import Header from "../../components/header/Header";
import ghoulLogo from "../../assets/ghoul_logo.svg";
import daiLogo from "../../assets/dai_logo.svg";
import busdLogo from "../../assets/Currency226.png";
import usdtLogo from "../../assets/Currency=Tether.png";
import swapArrows from "../../assets/swap-arrows.svg";
import swapArrowsLm from "../../assets/swap-lm.png";
import {
  swapAddress,
  busdSwapAddress,
  usdcSwapAddress,
  usdtSwapAddress,
} from "../../utils/contract_abis_mainnet";
import Web3Context from "../../store/Web3-context";
import LoadingImg from "../../components/loading-img-component/LoadingImg";
import { ethers } from "ethers";
import SnackbarUI from "../../components/snackbar/SnackbarUI";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import ThemeContext from "../../store/Theme-context";

const Swap = () => {
  const web3Ctx = useContext(Web3Context);
  const [isLoadingReserves, setIsLoadingReserves] = useState(false);
  const [reserves, setReserves] = useState({});
  const [togDai, setTogDai] = useState(true);
  const [daiApproved, setDaiApproved] = useState(false);
  const [gDaiApproved, setgDaiApproved] = useState(false);
  const [busdApproved, setBusdApproved] = useState(false);
  const [gDaiBusdApproved, setgDaiBusdApproved] = useState(false);
  const [usdcApproved, setUsdcApproved] = useState(false);
  const [gDaiUsdcApproved, setgDaiUsdcApproved] = useState(false);
  const [usdtApproved, setUsdtApproved] = useState(false);
  const [gDaiUsdtApproved, setgDaiUsdtApproved] = useState(false);
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
  const [anchorElTwo, setAnchorElTwo] = useState(null);
  const [coin, setCoin] = useState("DAI");
  const [coinBalance, setCoinBalance] = useState(0);
  const [coinReserve, setCoinReserve] = useState(0);

  const themeCtx = useContext(ThemeContext);
  const { innerWidth: width, innerHeight: height } = window;
  let anchorLocation = "translateX(-0px) translateY(-0px)";
  let anchorLocationTwo = "translateX(-0px) translateY(-0px)";
  // if (height > 920 && width > 2000) {
  //   anchorLocation = "translateX(20px) translateY(0px)";
  //   anchorLocationTwo = "translateX(30px) translateY(0px)";
  // } else if (height > 920) {
  //   anchorLocation = "translateX(-150px) translateY(-120px)";
  //   anchorLocationTwo = "translateX(-150px) translateY(-140px)";
  // } else if (height > 805) {
  //   anchorLocation = "translateX(-80px) translateY(-50px)";
  //   anchorLocationTwo = "translateX(-80px) translateY(-60px)";
  // } else {
  //   anchorLocation = "translateX(-300px) translateY(-120px)";
  //   anchorLocationTwo = "translateX(-300px) translateY(-120px)";
  // }

  // if (width < 450) {
  //   anchorLocation = "translateX(-0px) translateY(-0px)";
  //   anchorLocationTwo = "translateX(-0px) translateY(-0px)";
  // }

  // if (width >= 1505 && width <= 1999) {
  //   anchorLocation = "translateX(-200px) translateY(-120px)";
  //   anchorLocationTwo = "translateX(-200px) translateY(-150px)";
  // }

  // if (width < 1504) {
  //   anchorLocation = "translateX(-520px) translateY(-380px)";
  //   anchorLocationTwo = "translateX(-520px) translateY(-280px)";
  // }

  // if (width < 450) {
  //   anchorLocation = "translateX(-0px) translateY(-0px)";
  //   anchorLocationTwo = "translateX(-0px) translateY(-0px)";
  // }

  let bgColor;
  let bgColor2;
  let bgColorBox;
  let txtColor;
  let inputColor;
  let imgSrc = swapArrows;
  if (!themeCtx.darkMode) {
    bgColor = "#FFFFFF";
    bgColorBox = "rgba(0, 0, 0, 0.03)";
    txtColor = "#000000";
    inputColor = "rgba(0, 0, 0, 0.1)";
    bgColor2 = "rgba(0, 0, 0, 0.5)";
    imgSrc = swapArrowsLm;
  }

  const open = Boolean(anchorEl);
  const openTwo = Boolean(anchorElTwo);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickTwo = (event) => {
    setAnchorElTwo(event.currentTarget);
  };

  const handleClose = (event) => {
    if (!togDai) {
      setAnchorEl(null);
      return;
    }

    const { myValue } = event.currentTarget.dataset;
    if (!myValue) {
      setAnchorEl(null);
      return;
    }

    setInputOneValue(0);
    setInputTwoValue(0);

    setCoin(myValue);
    setAnchorEl(null);
  };

  const handleCloseTwo = (event) => {
    // if (!togDai) {
    //   setAnchorEl(null);
    //   return;
    // }

    const { myValue } = event.currentTarget.dataset;
    if (!myValue) {
      setAnchorElTwo(null);
      return;
    }

    setInputOneValue(0);
    setInputTwoValue(0);

    setCoin(myValue);
    setAnchorElTwo(null);
  };

  const loadReserves = useCallback(async () => {
    try {
      setIsLoadingReserves(true);
      // BALANCES;
      const gDaiBalance = await web3Ctx.tokenContract.balanceOf(
        web3Ctx.walletAddress
      );
      const gDaiBalanceFormat = ethers.utils.formatEther(gDaiBalance);

      const daiBalance = await web3Ctx.daiContract.balanceOf(
        web3Ctx.walletAddress
      );
      const daiBalanceFormat = ethers.utils.formatEther(daiBalance);

      const busdBalance = await web3Ctx.busdTokenContract.balanceOf(
        web3Ctx.walletAddress
      );
      const busdBalanceFormat = ethers.utils.formatEther(busdBalance);

      // const usdtBalanace = await web3Ctx.usdtTokenContract.balanceOf(
      //   web3Ctx.walletAddress
      // );
      // const usdtBalanceformat = ethers.utils.formatEther(usdtBalanace);

      const usdcBalance = await web3Ctx.usdcTokenContract.balanceOf(
        web3Ctx.walletAddress
      );
      const usdcBalanceFormat = ethers.utils.formatEther(usdcBalance);

      // const usdtBalance = await web3Ctx.usdtSwapContract.balanceOf(
      //   web3Ctx.walletAddress
      // );
      // const usdtBalanceFormat = ethers.utils.formatEther(usdtBalance);

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

      ////

      const gDaiAllowanceBusd = await web3Ctx.tokenContract.allowance(
        web3Ctx.walletAddress,
        busdSwapAddress
      );
      const gDaiAllowanceBusdFormat =
        ethers.utils.formatEther(gDaiAllowanceBusd);

      const busdAllowance = await web3Ctx.busdTokenContract.allowance(
        web3Ctx.walletAddress,
        busdSwapAddress
      );

      const busdAllowanceFormat = ethers.utils.formatEther(busdAllowance);

      ////

      // const gDaiAllowanceUsdc = await web3Ctx.tokenContract.allowance(
      //   web3Ctx.walletAddress,
      //   usdcSwapAddress
      // );

      // const gDaiAllowanceUsdcFormat =
      //   ethers.utils.formatEther(gDaiAllowanceUsdc);

      // const usdcAllowance = await web3Ctx.usdcSwapContract.allowance(
      //   web3Ctx.walletAddress,
      //   usdcSwapAddress
      // );
      // const usdcAllowanceFormat = ethers.utils.formatEther(usdcAllowance);

      ////
      const gDaiAllowanceUsdt = await web3Ctx.tokenContract.allowance(
        web3Ctx.walletAddress,
        usdtSwapAddress
      );
      const gDaiAllowanceUsdtFormat =
        ethers.utils.formatEther(gDaiAllowanceUsdt);

      const usdtAllowance = await web3Ctx.usdtTokenContract.allowance(
        web3Ctx.walletAddress,
        usdtSwapAddress
      );

      const usdtAllowanceFormat = ethers.utils.formatEther(usdtAllowance);
      ///

      if (parseInt(gDaiAllowanceFormat) !== 0) {
        setgDaiApproved(true);
      }

      if (parseInt(daiAllowanceFormat) !== 0) {
        setDaiApproved(true);
      }

      if (parseInt(gDaiAllowanceBusdFormat) !== 0) {
        setgDaiBusdApproved(true);
      }

      if (parseInt(busdAllowanceFormat !== 0)) {
        setBusdApproved(true);
      }

      // // if (usdcAllowanceFormat !== 0) {
      // setUsdcApproved(true);
      // // }

      if (parseInt(gDaiAllowanceUsdtFormat)) {
        setgDaiUsdtApproved(true);
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

      // const usdcReserves = await web3Ctx.usdcSwapContract.getReserves();
      // const usdcRate = await web3Ctx.usdcSwapContract.usdcRate();
      // const usdcRateFormat = parseInt(usdcRate._hex, 16);
      // const gDaiRateUsdc = await web3Ctx.usdcSwapContract.ghostdaiRate();
      // const gDaiRateUsdcFormat = parseInt(gDaiRateUsdc._hex, 16);

      // const gdaiReserveFormatUsdc = parseFloat(
      //   ethers.utils.formatEther(usdcReserves[0].toString())
      // ).toFixed(2);
      // const usdcReserveFormat = parseFloat(
      //   ethers.utils.formatEther(usdcReserves[1].toString())
      // ).toFixed(2);

      // const usdtReserves = await web3Ctx.usdtSwapContract.getReserves();
      // const usdtRate = await web3Ctx.usdtSwapContract.usdtRate();
      // const usdtRateFormat = parseInt(usdtRate._hex, 16);

      const gDaiRateUsdt = await web3Ctx.usdtSwapContract.ghostdaiRate();
      const gDaiRateUsdtFormat = parseInt(gDaiRateUsdt._hex, 16);

      // const gdaiReserveFormatUsdt = parseFloat(
      //   ethers.utils.formatEther(usdtReserves[0].toString())
      // ).toFixed(2);
      // const usdtReserveFormat = parseFloat(
      //   ethers.utils.formatEther(usdtReserves[1].toString())
      // ).toFixed(2);

      setReserves({
        gDaiBalance: parseFloat(gDaiBalanceFormat).toFixed(2),
        daiBalance: daiBalanceFormat,
        busdBalance: busdBalanceFormat,
        // usdtBalance: usdtBalanceformat,
        usdcBalance: usdcBalanceFormat,
        gDaiAllowance: gDaiAllowanceFormat,
        daiAllowance: daiAllowanceFormat,
        daiRate: daiRateFormat,
        gDaiRate: gDaiRateFormat,
        gDaiReserve: gdaiReserveFormat,
        daiReserve: daiReserveFormat,
        busdRate: busdRateFormat,
        gdaiRateBusd: gDaiRateBusdFormat,
        gdaiReserveBusd: gdaiReserveFormatBusd,
        busdReserve: busdReserveFormat,
        // usdtRate: usdtRateFormat,
        gdaiRateUsdt: gDaiRateUsdtFormat,
        // gdaiReserveUsdt: gdaiReserveFormatUsdt,
        // usdtReserve: usdtReserveFormat,
      });

      // setReserves({
      //   gDaiBalance: parseFloat(71.77).toFixed(2),
      //   daiBalance: 28.2,
      //   busdBalance: 10,
      //   usdtBalance: 0,
      //   gDaiAllowance: 9999999999,
      //   daiAllowance: 9999999999,
      //   daiRate: 101,
      //   gDaiRate: 99,
      //   gDaiReserve: 124.39,
      //   daiReserve: 174.2,
      //   busdRate: 101,
      //   gdaiRateBusd: 99,
      //   gdaiReserveBusd: 0.0,
      //   busdReserve: 0.0,
      //   usdtRate: 101,
      //   gdaiRateUsdt: 99,
      //   gdaiReserveUsdt: 0.0,
      //   usdtReserve: 0.0,
      // });

      setIsLoadingReserves(false);
    } catch (error) {
      setIsLoadingReserves(false);
      console.log(error);
    }
  }, [
    web3Ctx.busdSwapContract,
    web3Ctx.busdTokenContract,
    web3Ctx.daiContract,
    web3Ctx.swapContract,
    web3Ctx.tokenContract,
    web3Ctx.usdtSwapContract,
    web3Ctx.usdtTokenContract,
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
        let tx;
        switch (coin) {
          case "DAI":
            tx = await web3Ctx.daiContract.approve(
              swapAddress,
              ethers.utils.parseEther("1000000000000000")
            );

            await tx.wait();
            setSnackbarOpen({ open: true, error: false });
            break;
          case "BUSD":
            tx = await web3Ctx.busdTokenContract.approve(
              busdSwapAddress,
              ethers.utils.parseEther("1000000000000000")
            );

            await tx.wait();
            setSnackbarOpen({ open: true, error: false });
            break;
          case "USDT":
            tx = await web3Ctx.usdtTokenContract.approve(
              usdtSwapAddress,
              ethers.utils.parseEther("1000000000000000")
            );

            await tx.wait();
            setSnackbarOpen({ open: true, error: false });
            break;
          default:
            break;
        }
      } else {
        const tx = await web3Ctx.tokenContract.approve(
          swapAddress,
          ethers.utils.parseEther("1000000000000000")
        );

        await tx.wait();
        setSnackbarOpen({ open: true, error: false });
      }
    } catch (e) {
      setSnackbarOpen({ open: true, error: true });
      console.log(e);
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
      let tx;
      if (togDai) {
        switch (coin) {
          case "DAI":
            tx = await web3Ctx.swapContract.swapFrom(
              ethers.utils.parseEther(inputOneValue.toString())
            );

            await tx.wait();
            setSnackbarOpen({ open: true, error: false });
            break;
          case "BUSD":
            tx = await web3Ctx.busdSwapContract.swapFrom(
              ethers.utils.parseEther(inputOneValue.toString())
            );

            await tx.wait();
            setSnackbarOpen({ open: true, error: false });
            break;
          case "USDT":
            tx = await web3Ctx.usdtSwapContract.swapFrom(
              ethers.utils.parseEther(inputOneValue.toString())
            );

            await tx.wait();
            setSnackbarOpen({ open: true, error: false });
            break;
          default:
            break;
        }

        loadReserves();
        setInputOneValue(0);
        setInputTwoValue(0);
        setIsLoadingSwap(false);
      } else {
        switch (coin) {
          case "DAI":
            tx = await web3Ctx.swapContract.swapTo(
              ethers.utils.parseEther(inputOneValue.toString())
            );
            await tx.wait();
            setSnackbarOpen({ open: true, error: false });
            break;
          case "BUSD":
            tx = await web3Ctx.busdSwapContract.swapTo(
              ethers.utils.parseEther(inputOneValue.toString())
            );
            await tx.wait();
            setSnackbarOpen({ open: true, error: false });
            break;
          case "USDT":
            tx = await web3Ctx.usdtSwapContract.swapTo(
              ethers.utils.parseEther(inputOneValue.toString())
            );
            await tx.wait();
            setSnackbarOpen({ open: true, error: false });
            break;
          default:
            break;
        }

        loadReserves();
        setInputOneValue(0);
        setInputTwoValue(0);
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
    if (!togDai) {
      let value = reserves.gDaiBalance;
      setInputOneValue(reserves.gDaiBalance);

      switch (coin) {
        case "DAI":
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
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }
          break;
        case "BUSD":
          recieveValue = (
            (parseFloat(value) * parseFloat(reserves.gdaiRateBusd)) /
            100
          ).toFixed(2);

          if (recieveValue > parseFloat(reserves.busdReserve)) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }

          if (value > reserves.gDaiBalance) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }
          break;
        case "USDC":
          break;
        case "USDT":
          recieveValue = (
            (parseFloat(value) * parseFloat(reserves.gdaiRateUsdt)) /
            100
          ).toFixed(2);

          if (recieveValue > parseFloat(reserves.usdtReserve)) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }

          if (value > reserves.usdtBalance) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }
          break;

        default:
          break;
      }

      setInputTwoValue(parseFloat(recieveValue).toFixed(5));
    } else {
      let value;
      switch (coin) {
        case "DAI":
          value = reserves.daiBalance;
          recieveValue = (
            (parseFloat(value) * parseFloat(reserves.daiRate)) /
            100
          ).toFixed(2);

          recieveValue = recieveValue - recieveValue * 0.001;

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
          value = reserves.busdBalance;
          recieveValue = (
            (parseFloat(value) * parseFloat(reserves.busdRate)) /
            100
          ).toFixed(2);

          recieveValue = recieveValue - recieveValue * 0.01;

          if (recieveValue > parseFloat(reserves.gdaiReserveBusd)) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }

          if (value > reserves.busdBalance) {
            setExceedingBalanceWallet(true);
          } else {
            setExceedingBalanceWallet(false);
          }
          break;
        case "USDC":
          break;
        case "USDT":
          value = reserves.usdtBalance;
          recieveValue = (
            (parseFloat(value) * parseFloat(reserves.usdtRate)) /
            100
          ).toFixed(2);

          recieveValue = recieveValue - recieveValue * 0.01;

          if (recieveValue > parseFloat(reserves.gdaiReserveUsdt)) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }

          if (value > reserves.busdBalance) {
            setExceedingBalanceWallet(true);
          } else {
            setExceedingBalanceWallet(false);
          }
          break;

        default:
          break;
      }
      setInputOneValue(value);
      setInputTwoValue(parseFloat(recieveValue).toFixed(5));
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
          recieveValue = recieveValue - (recieveValue - value);
          recieveValue = recieveValue - recieveValue * 0.01;

          if (recieveValue > parseFloat(reserves.gDaiReserve)) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }

          if (parseFloat(value) > parseFloat(reserves.daiBalance)) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }
          break;
        case "BUSD":
          recieveValue = (
            (parseFloat(value) * parseFloat(reserves.busdRate)) /
            100
          ).toFixed(2);
          recieveValue = recieveValue - (recieveValue - value);
          recieveValue = recieveValue - recieveValue * 0.01;

          if (recieveValue > parseFloat(reserves.gdaiReserveBusd)) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }

          if (value > reserves.busdBalance) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }
          break;
        case "USDC":
          break;
        case "USDT":
          recieveValue = (
            (parseFloat(value) * parseFloat(reserves.usdtRate)) /
            100
          ).toFixed(2);
          recieveValue = recieveValue - (recieveValue - value);
          recieveValue = recieveValue - recieveValue * 0.01;

          if (recieveValue > parseFloat(reserves.gdaiReserveUsdt)) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }

          if (value > reserves.busdBalance) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }
          break;

        default:
          break;
      }
    } else {
      switch (coin) {
        case "DAI":
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
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }
          break;
        case "BUSD":
          recieveValue = (
            (parseFloat(value) * parseFloat(reserves.gdaiRateBusd)) /
            100
          ).toFixed(2);

          if (recieveValue > parseFloat(reserves.busdReserve)) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }

          if (value > reserves.gDaiBalance) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }
          break;
        case "USDC":
          break;
        case "USDT":
          recieveValue = (
            (parseFloat(value) * parseFloat(reserves.gdaiRateUsdt)) /
            100
          ).toFixed(2);

          if (recieveValue > parseFloat(reserves.usdtReserve)) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }

          if (value > reserves.usdtBalance) {
            setExceedingBalance(true);
          } else {
            setExceedingBalance(false);
          }
          break;

        default:
          break;
      }
    }

    setInputOneValue(value);
    setInputTwoValue(recieveValue);
  };

  const inputTwoHandler = () => {};
  const renderBalances = () => {
    switch (coin) {
      case "DAI":
        return togDai ? reserves.daiBalance : reserves.gDaiBalance;
      case "BUSD":
        return togDai ? reserves.busdBalance : reserves.gDaiBalance;
      case "USDT":
        return togDai ? reserves.usdtBalance : reserves.gDaiBalance;
      default:
        break;
    }
  };

  const renderReserves = () => {
    switch (coin) {
      case "DAI":
        return togDai ? reserves.gDaiBalance : reserves.daiReserve;
      case "BUSD":
        return togDai ? reserves.gdaiReserveBusd : reserves.busdReserve;
      case "USDT":
        return togDai ? reserves.gdaiReserveUsdt : reserves.usdtReserve;
      default:
        break;
    }
  };

  const renderIcons = () => {
    switch (coin) {
      case "DAI":
        return daiLogo;
      case "BUSD":
        return busdLogo;
      case "USDT":
        return usdtLogo;
      default:
        break;
    }
  };

  const renderButtons = () => {
    if (togDai) {
      switch (coin) {
        case "DAI":
          if (daiApproved && !exceedingBalance) {
            return (
              <button id={classes["swap-btn"]} onClick={swapHandler}>
                Swap
              </button>
            );
          }

          if (exceedingBalance) {
            return (
              <button id={classes["approve-btn"]}>
                Deposit Exceeds Available Reserves or User Balance
              </button>
            );
          }

          if (!daiApproved) {
            return (
              <button id={classes["approve-btn"]} onClick={approveHandler}>
                Approve DAI
              </button>
            );
          }

          break;
        case "BUSD":
          if (busdApproved && !exceedingBalance) {
            return (
              <button id={classes["swap-btn"]} onClick={swapHandler}>
                Swap
              </button>
            );
          }

          if (exceedingBalance) {
            return (
              <button id={classes["approve-btn"]}>
                Deposit Exceeds Available Reserves or User Balance
              </button>
            );
          }

          if (!busdApproved) {
            return (
              <button id={classes["approve-btn"]} onClick={approveHandler}>
                Approve BUSD
              </button>
            );
          }

          break;
        case "USDT":
          if (daiApproved && !exceedingBalance) {
            return (
              <button id={classes["swap-btn"]} onClick={swapHandler}>
                Swap
              </button>
            );
          }

          if (exceedingBalance) {
            return (
              <button id={classes["approve-btn"]}>
                Deposit Exceeds Available Reserves or User Balance
              </button>
            );
          }

          if (!usdtApproved) {
            return (
              <button id={classes["approve-btn"]} onClick={approveHandler}>
                Approve USDT
              </button>
            );
          }

          break;
        default:
          break;
      }
    } else {
      if (!gDaiApproved) {
        return (
          <button id={classes["approve-btn"]} onClick={approveHandler}>
            Approve gDAI
          </button>
        );
      }

      if (exceedingBalance) {
        return (
          <button id={classes["approve-btn"]}>
            Deposit Exceeds Available Reserves or User Balance
          </button>
        );
      }

      if (gDaiApproved && !exceedingBalance) {
        return (
          <button id={classes["swap-btn"]} onClick={swapHandler}>
            Swap
          </button>
        );
      }
    }
  };

  return (
    <>
      <div
        className={classes["swap-container"]}
        style={{ background: !themeCtx.darkMode ? bgColor : undefined }}
      >
        <Header title="Swap"></Header>
        <div
          id={classes["vault-line"]}
          style={{ background: !themeCtx.darkMode ? bgColor2 : undefined }}
        ></div>
        {isLoadingReserves ? (
          <LoadingImg />
        ) : (
          <div
            className={classes["swap-box"]}
            style={{ background: !themeCtx.darkMode ? bgColorBox : undefined }}
          >
            <>
              <h1
                id={classes["mint-gdai"]}
                style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
              >
                {" "}
                {togDai
                  ? "Mint gDAI with Stablecoins"
                  : "Mint Stablecoins with gDAI"}
              </h1>
              <div className={classes["swap-line"]}></div>
              <div
                className={classes["swap-box-header"]}
                style={{
                  background: !themeCtx.darkMode ? bgColorBox : undefined,
                }}
              >
                <span
                  className={classes["col-one"]}
                  style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                >
                  Deposit <span id={classes.dai}>{togDai ? coin : "gDAI"}</span>
                  <div id={classes["dai-2"]}></div>
                </span>
                <span
                  className={classes["col-two"]}
                  style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                >
                  {togDai ? coin : "gDAI"}
                  {" Balance: "}
                  <span id={classes.balance}>{renderBalances()}</span>
                </span>
              </div>
              <div className={classes["swap-input"]}>
                <Button
                  id="fade-button"
                  aria-controls={open ? "fade-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={togDai ? handleClick : undefined}
                  style={{
                    color: "#74ec65",
                    padding: "0",
                    minWidth: 0,
                  }}
                >
                  <img
                    src={togDai ? renderIcons() : ghoulLogo}
                    alt=""
                    id={classes["swap-menu-icon"]}
                    width={34}
                    height={30}
                  />
                  <div
                    className={classes["coin-menu"]}
                    style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                  >
                    {togDai ? coin : "gDai"}
                    {togDai && <KeyboardArrowDownIcon />}
                  </div>
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
                      transform: anchorLocation,
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
                  {/* <MenuItem data-my-value={"USDC"} onClick={handleClose}>
              USDC
            </MenuItem> */}
                  <MenuItem data-my-value={"USDT"} onClick={handleClose}>
                    USDT
                  </MenuItem>
                </Menu>
                <input
                  id={classes["input-one"]}
                  type="number"
                  defaultValue={0}
                  max={togDai ? reserves.daiBalance : reserves.gDaiBalance}
                  value={inputOneValue}
                  onChange={(e) => {
                    inputOneHandler(e.target.value);
                  }}
                  style={{
                    background: !themeCtx.darkMode ? inputColor : undefined,
                  }}
                />
                <span id={classes.max} onClick={maxHandlerOne}>
                  MAX
                </span>
              </div>
              <div className={classes["swap-arrow"]}>
                <img src={imgSrc} alt="" onClick={flipHandler} />
              </div>
              <div className={classes["swap-box-header"]}>
                <span
                  className={classes["col-one"]}
                  style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                >
                  Recieve <span id={classes.dai}>{togDai ? "gDAI" : coin}</span>
                </span>
                <span
                  className={classes["col-two"]}
                  style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                >
                  Availble {togDai ? "gDAI: " : `${coin}: `}
                  <span id={classes.balance}>{renderReserves()}</span>
                </span>
              </div>
              <div className={classes["swap-input"]}>
                {/* <img src={togDai ? ghoulLogo : renderIcons()} alt="" /> */}
                <Button
                  id="fade-button"
                  aria-controls={open ? "fade-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={togDai ? undefined : handleClickTwo}
                  style={{
                    color: "#74ec65",
                    padding: "0",
                    minWidth: 0,
                  }}
                >
                  <img
                    src={togDai ? ghoulLogo : renderIcons()}
                    alt=""
                    id={classes["swap-menu-icon"]}
                    width={34}
                    height={30}
                  />
                  <div
                    className={classes["coin-menu"]}
                    style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                  >
                    {togDai ? "gDai" : coin}
                    {!togDai && <KeyboardArrowDownIcon />}
                  </div>
                </Button>
                <Menu
                  id="fade-menu"
                  MenuListProps={{
                    "aria-labelledby": "fade-button",
                  }}
                  anchorEl={anchorElTwo}
                  open={openTwo}
                  onClose={handleCloseTwo}
                  TransitionComponent={Fade}
                  PaperProps={{
                    style: {
                      transform: anchorLocationTwo,
                      backgroundColor: "#090a10ba",
                      color: "white",
                    },
                  }}
                >
                  <MenuItem data-my-value={"DAI"} onClick={handleCloseTwo}>
                    DAI
                  </MenuItem>
                  <MenuItem data-my-value={"BUSD"} onClick={handleCloseTwo}>
                    BUSD
                  </MenuItem>
                  {/* <MenuItem data-my-value={"USDC"} onClick={handleClose}>
              USDC
            </MenuItem> */}
                  <MenuItem data-my-value={"USDT"} onClick={handleCloseTwo}>
                    USDT
                  </MenuItem>
                </Menu>
                <input
                  id={classes["input-one"]}
                  type="number"
                  defaultValue={0}
                  max={togDai ? reserves.gDaiBalance : reserves.daiBalance}
                  value={inputTwoValue}
                  onChange={(e) => {
                    inputTwoHandler(e.target.value);
                  }}
                  style={{
                    background: !themeCtx.darkMode ? inputColor : undefined,
                  }}
                />
              </div>
              <div id={classes["swap-btn-div"]}>{renderButtons()}</div>
              <div id={classes["footer-text"]}>
                <p style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
                  Static fee of 1%
                </p>
              </div>
            </>
          </div>
        )}
      </div>
      <div className={classes["snackbar-swap-container"]}>
        <>
          {" "}
          {snackbarOpen.open && (
            <SnackbarUI
              error={snackbarOpen.error}
              className={classes["snackbar-swap"]}
            />
          )}
        </>
      </div>
    </>
  );
};

export default Swap;

// {exceedingBalance && (
//   <button id={classes["approve-btn"]}>
//     Deposit Exceeds Available Reserves or User Balance
//   </button>
// )}
// {togDai &&
//   !exceedingBalance &&
//   (daiApproved ? (
//     <button id={classes["swap-btn"]} onClick={swapHandler}>
//       Swap
//     </button>
//   ) : (
//     <button id={classes["approve-btn"]} onClick={approveHandler}>
//       Approve DAI
//     </button>
//   ))}
// {!togDai &&
//   !exceedingBalance &&
//   (gDaiApproved ? (
//     <button id={classes["swap-btn"]} onClick={swapHandler}>
//       Swap
//     </button>
//   ) : (
//     <button id={classes["approve-btn"]} onClick={approveHandler}>
//       Approve gDAI
//     </button>
//   ))}
