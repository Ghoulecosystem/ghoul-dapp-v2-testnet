import React, { useState, useContext, useEffect, useCallback } from "react";
import classes from "./Vault.module.css";
import Header from "../../components/header/Header";
import VaultEntry from "../../components/vault-entry/VaultEntry";
import Modal from "react-modal";
import VaultModal from "../../components/vault-modal/VaultModal";
import CreateVaultModal from "../../components/create-vault-modal/CreateVaultModal";
import LiquidateVaultModal from "../../components/liqiduidate-vault-modal/LiquidateVaultModal";
import Web3Context from "../../store/Web3-context";
import LoadingImg from "../../components/loading-img-component/LoadingImg";
import allVaultArrow from "../../assets/all_vaults_arrow.svg";
import { ethers } from "ethers";
import {
  wethVaultAddress,
  tokenAddress,
  liquidatorAddress,
} from "../../utils/contract_abis";
import SnackbarUI from "../../components/snackbar/SnackbarUI";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import ThemeContext from "../../store/Theme-context";
import chevronDark from "../../assets/arrow-darkmode.svg";

const axios = require("axios");

const BNBPrice = 529.75;
const gDaiPrice = 1;

const modalStyle = {
  overlay: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    border: "none",
  },
  content: {
    width: "651px",
    height: "812.5px",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    padding: "10px",
    border: "none",
    background: "none",
  },
};

const modalStyleLiq = {
  overlay: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    border: "none",
  },
  content: {
    width: "651px",
    height: "700px",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    padding: "10px",
    border: "none",
    background: "none",
  },
};

const modalStyleMobile = {
  overlay: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    border: "none",
  },
  content: {
    width: "300px",
    height: "600px",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    padding: "10px",
    border: "none",
    background: "none",
  },
};

const modalStyleTwo = {
  overlay: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    border: "none",
  },
  content: {
    width: "651px",
    height: "300px",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    padding: "10px",
    border: "none",
    background: "none",
  },
};

const modalStyleTwoMobile = {
  overlay: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    border: "none",
  },
  content: {
    width: "300px",
    height: "476px",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    padding: "10px",
    border: "none",
    background: "none",
  },
};

const Vault = () => {
  const modalStyleCreate = window.isMobile
    ? modalStyleTwoMobile
    : modalStyleTwo;
  const modalStyleVault = window.isMobile ? modalStyleMobile : modalStyle;
  const modalStyleLiquidate = window.isMobile
    ? modalStyleTwoMobile
    : modalStyleLiq;

  const web3Ctx = useContext(Web3Context);
  const walletAddress = web3Ctx.walletAddress;
  const tokenContract = web3Ctx.tokenContract;
  const wethVaultContract = web3Ctx.wethVaultContract;
  const wethContract = web3Ctx.wethContract;
  const liquidatorContract = web3Ctx.liquidatorContract;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenTwo, setIsOpenTwo] = useState(false);
  const [modalIsOpenThree, setIsOpenThree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWeth, setIsLoadingWeth] = useState(false);
  const [isLoadingLiquidatorBNB, setIsLoadingLiquidatorBNB] = useState(false);
  const [isLoadingLiquidatorWeth, setIsLoadingLiquidatorWeth] = useState(false);
  const [isLoadingVaultCreate, setIsLoadingVaultCreate] = useState(false);
  const [totalGdaiAvailableBNB, setTotalGdaiAvailableBNB] = useState(null);
  const [totalGdaiAvailableWeth, setTotalGdaiAvailableWeth] = useState(null);
  const [userVaultsBNB, setUserVaultsBNB] = useState([]);
  const [userVaultsWeth, setUserVaultsWeth] = useState([]);
  const [vaultModalData, setVaultModalData] = useState([]);
  const [vaultModalDataLiq, setVaultModalDataLiq] = useState([]);
  const [isBNBModal, setIsBNBModal] = useState(false);
  const [balances, setBalances] = useState({
    bnbBalance: 0,
    wethBalance: 0,
  });
  const [allowances, setAllowances] = useState({});
  const [vaultManager, setVaultManager] = useState(true);
  const [liqVaultsBNB, setLiqVaultsBNB] = useState([]);
  const [liqVaultsWeth, setLiqVaultsWeth] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    error: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElMobile, setAnchorElMobile] = useState(null);
  const [vaultDisplayType, setVaultDisplayType] = useState("All Vaults");

  const themeCtx = useContext(ThemeContext);
  let bgColor;
  let bgColor2;
  let bgColorBox;
  let txtColor;
  let txtColor2;
  let inputColor;
  let imgSrc = allVaultArrow;
  if (!themeCtx.darkMode) {
    bgColor = "#FFFFFF";
    bgColorBox = "rgba(0, 0, 0, 0.03)";
    txtColor = "#000000";
    inputColor = "rgba(0, 0, 0, 0.1)";
    txtColor2 = "rgba(0, 0, 0, 0.3)";
    bgColor2 = "rgba(0, 0, 0, 0.5)";
    imgSrc = chevronDark;
  }

  const open = Boolean(anchorEl);
  const openMobile = Boolean(anchorElMobile);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickMobile = (event) => {
    setAnchorElMobile(event.currentTarget);
  };

  const handleClose = (event) => {
    const { myValue } = event.currentTarget.dataset;
    if (!myValue) {
      setAnchorEl(null);
      return;
    }

    setVaultDisplayType(myValue);
    setAnchorEl(null);
  };

  const handleCloseMobile = (event) => {
    const { myValue } = event.currentTarget.dataset;
    if (!myValue) {
      setAnchorElMobile(null);
      return;
    }

    setVaultDisplayType(myValue);
    setAnchorElMobile(null);
  };

  useEffect(() => {
    const loadBNBVaultsLiquidation = async () => {
      setIsLoadingLiquidatorBNB(true);
      const vaultCountHex = await tokenContract.vaultCount();
      const vaultCount = parseInt(vaultCountHex._hex, 16);
      let ethPrice = await tokenContract.getEthPriceSource();
      let ethPriceFormat = ethers.utils.formatEther(ethPrice);
      let liqVaults = [];
      for (let i = 0; i < vaultCount; i++) {
        let vaultCollateral = await tokenContract.vaultCollateral(i);

        if (parseInt(vaultCollateral._hex) === 0) {
          continue;
        }

        let debt = await tokenContract.vaultDebt(i);
        let debtFormat = ethers.utils.formatEther(debt);
        let vaultCollateralFormat = ethers.utils.formatEther(vaultCollateral);
        let vaultCollateralFinal =
          parseFloat(BNBPrice) * parseFloat(vaultCollateralFormat);
        let debtMonitor = parseFloat(gDaiPrice) * debtFormat;
        let debtRatio = (
          (parseFloat(vaultCollateralFinal) / parseFloat(debtMonitor)) *
          100
        ).toFixed(2);
        let availableBorrow =
          ((parseFloat(vaultCollateralFormat) * parseFloat(ethPriceFormat)) /
            (150 * parseFloat(gDaiPrice))) *
            100 -
          parseFloat(debtFormat);
        let ratio = 0;
        if (parseInt(debtMonitor) !== 0) {
          ratio =
            (parseFloat(vaultCollateralFinal) / parseFloat(debtMonitor)) * 100;
        }
        if (
          parseFloat(ratio).toFixed(2) > 0 &&
          parseFloat(ratio).toFixed(2) < 150
        ) {
          liqVaults.push({
            id: i,
            collateralRaw: vaultCollateralFormat,
            ratio: ratio,
            collateral: vaultCollateralFinal,
            debt: debtMonitor,
            availableBorrow: availableBorrow,
          });
        }
      }
      if (liqVaults.length) {
        setLiqVaultsBNB(liqVaults);
      }

      setIsLoadingLiquidatorBNB(false);
    };

    loadBNBVaultsLiquidation();
    return () => {
      setLiqVaultsBNB([]);
    };
  }, [tokenContract]);

  useEffect(() => {
    const loadWethVaultsLiquidation = async () => {
      setIsLoadingLiquidatorWeth(true);
      const vaultCountHex = await wethVaultContract.vaultCount();
      const vaultCount = parseInt(vaultCountHex._hex, 16);
      let ethPrice = await wethVaultContract.getEthPriceSource();
      let ethPriceFormat = ethers.utils.formatUnits(ethPrice, "gwei") * 10;
      let liqVaults = [];
      for (let i = 0; i < vaultCount; i++) {
        let vaultCollateral = await wethVaultContract.vaultCollateral(i);

        if (parseInt(vaultCollateral._hex) === 0) {
          continue;
        }

        let debt = await wethVaultContract.vaultDebt(i);
        let debtFormat = ethers.utils.formatEther(debt);
        let vaultCollateralFormat = ethers.utils.formatEther(vaultCollateral);
        let vaultCollateralFinal =
          parseFloat(ethPriceFormat) * parseFloat(vaultCollateralFormat);
        let debtMonitor = parseFloat(gDaiPrice) * debtFormat;
        let debtRatio = (
          (parseFloat(vaultCollateralFinal) / parseFloat(debtMonitor)) *
          100
        ).toFixed(2);
        let availableBorrow =
          ((parseFloat(vaultCollateralFormat) * parseFloat(ethPriceFormat)) /
            (150 * parseFloat(gDaiPrice))) *
            100 -
          parseFloat(debtFormat);
        let ratio = 0;
        if (parseInt(debtMonitor) !== 0) {
          ratio =
            (parseFloat(vaultCollateralFinal) / parseFloat(debtMonitor)) * 100;
        }
        if (
          parseFloat(ratio).toFixed(2) > 0 &&
          parseFloat(ratio).toFixed(2) < 150
        ) {
          liqVaults.push({
            id: i,
            collateralRaw: vaultCollateralFormat,
            ratio: ratio,
            collateral: vaultCollateralFinal,
            debt: debtMonitor,
            availableBorrow: availableBorrow,
          });
        }
      }
      if (liqVaults.length) {
        setLiqVaultsWeth(liqVaults);
      }

      setIsLoadingLiquidatorWeth(false);
    };

    loadWethVaultsLiquidation();
    return () => {
      setLiqVaultsWeth([]);
    };
  }, [wethVaultContract]);

  const getBalances = useCallback(async () => {
    console.log("getting balances");
    const gdaiBalance = await tokenContract.balanceOf(walletAddress);
    const gdaiBalanceFormat = parseFloat(
      ethers.utils.formatEther(gdaiBalance)
    ).toFixed(2);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const balance = await provider.getBalance(walletAddress);
    const balanceWeth = await wethContract.balanceOf(walletAddress);

    const balanceFormat = ethers.utils.formatEther(balance);
    const balanceWethFormat = ethers.utils.formatEther(balanceWeth);

    const allowanceBNB = await tokenContract.allowance(
      walletAddress,
      tokenAddress
    );

    const allowanceWeth = await tokenContract.allowance(
      walletAddress,
      wethVaultAddress
    );

    const depositAllowance = await wethContract.allowance(
      walletAddress,
      wethVaultAddress
    );

    const allowanceLiquidator = await tokenContract.allowance(
      walletAddress,
      liquidatorAddress
    );

    const allowanceLiquidatorWeth = await tokenContract.allowance(
      walletAddress,
      wethVaultAddress
    );

    const allowanceBNBFormat = ethers.utils.formatEther(allowanceBNB);
    const allowanceWethFormat = ethers.utils.formatEther(allowanceWeth);
    const depositAllowanceFormat = ethers.utils.formatEther(depositAllowance);
    const allowanceLiquidatorFormat =
      ethers.utils.formatEther(allowanceLiquidator);
    const allowanceLiquidatorWethFormat = ethers.utils.formatEther(
      allowanceLiquidatorWeth
    );

    setAllowances({
      allowanceBNB: allowanceBNBFormat,
      allowanceWeth: allowanceWethFormat,
      depositAllowance: depositAllowanceFormat,
      allowanceLiquidator: allowanceLiquidatorFormat,
      allowanceLiquidatorWeth: allowanceLiquidatorWethFormat,
    });

    setBalances({
      bnbBalance: balanceFormat,
      wethBalance: balanceWethFormat,
      gdaiBalance: gdaiBalanceFormat,
    });
  }, [tokenContract, walletAddress, wethContract]);

  useEffect(() => {
    getBalances();
    return () => {
      setBalances({});
      setAllowances({});
    };
  }, []);

  useEffect(() => {
    const getUserVaultDataWeth = async () => {
      let address = walletAddress;
      address = address.toLocaleLowerCase();
      setIsLoadingWeth(true);
      let body = {
        query: `
            query {
                users(where : {id : "${address}"}){
                  id
                    vaults {
                      id
                    }
                }
            }
        `,
        variables: {},
      };

      const res = await axios.post(
        "https://api.thegraph.com/subgraphs/name/blockifi/bsctetnetwethvault",
        body
      );

      if (!res.data.data.users.length) {
        setIsLoadingWeth(false);
        return;
      }

      let gDaiPrice = await tokenContract.getTokenPriceSource();
      let gDaiPriceFormat = ethers.utils.formatEther(gDaiPrice);
      let ethPrice = await tokenContract.getEthPriceSource();
      let ethPriceFormat = ethers.utils.formatUnits(ethPrice, "gwei");
      const userVaultData = res.data.data.users[0].vaults;
      let userVaultArray = [];
      for (let i = 0; i < userVaultData.length; i++) {
        let vaultId = userVaultData[i].id;
        let vaultDebt = await wethVaultContract.vaultDebt(vaultId);
        let vaultDebtFormat = ethers.utils.formatEther(vaultDebt);

        let vaultCollateral = await wethVaultContract.vaultCollateral(vaultId);
        let vaultCollateralFormat = ethers.utils.formatEther(vaultCollateral);

        let availableBorrow =
          ((parseFloat(vaultCollateralFormat) * parseFloat(ethPriceFormat)) /
            (150 * parseFloat(gDaiPriceFormat))) *
            100 -
          parseFloat(vaultDebtFormat);

        let vaultRatio;
        if (parseInt(vaultDebtFormat) !== 0) {
          vaultRatio =
            ((parseFloat(vaultCollateralFormat) * parseFloat(ethPriceFormat)) /
              (parseFloat(vaultDebtFormat) * parseFloat(gDaiPriceFormat))) *
            100;
        } else {
          vaultRatio = 0;
        }

        const vaultObj = {
          id: vaultId,
          debt: vaultDebtFormat,
          collateral: parseFloat(vaultCollateralFormat).toFixed(2),
          availableBorrow: parseFloat(availableBorrow).toFixed(2),
          ratio: vaultRatio,
        };

        userVaultArray.push(vaultObj);
      }
      setUserVaultsWeth((vaults) => [...vaults, ...userVaultArray]);
      setIsLoadingWeth(false);
    };

    getUserVaultDataWeth();
  }, [
    tokenContract,
    walletAddress,
    web3Ctx.walletAddres,
    web3Ctx.walletAddress,
    wethVaultContract,
  ]);

  useEffect(() => {
    const getUserVaultDataBNB = async () => {
      let address = walletAddress;
      address = address.toLocaleLowerCase();
      setIsLoading(true);
      let body = {
        query: `
            query {
                users(where : {id : "${address}"}){
                  id
                    vaults {
                      id
                    }
                }
            }
        `,
        variables: {},
      };
      // https://api.thegraph.com/subgraphs/name/blockifi/ghoulfinancebscmainnet1 MAINNET

      const result = await axios
        .post(
          "https://api.thegraph.com/subgraphs/name/blockifi/ghoulfinancebsc",
          body
        )
        .then(async (res) => {
          if (!res.data.data.users.length) {
            setIsLoading(false);
            return;
          }

          let gDaiPrice = await tokenContract.getTokenPriceSource();
          let gDaiPriceFormat = ethers.utils.formatEther(gDaiPrice);
          let ethPrice = await tokenContract.getEthPriceSource();
          let ethPriceFormat = ethers.utils.formatEther(ethPrice);
          const userVaultData = res.data.data.users[0].vaults;
          let userVaultArray = [];
          for (let i = 0; i < userVaultData.length; i++) {
            let vaultId = userVaultData[i].id;
            let vaultDebt = await tokenContract.vaultDebt(vaultId);
            let vaultDebtFormat = ethers.utils.formatEther(vaultDebt);

            let vaultCollateral = await tokenContract.vaultCollateral(vaultId);
            let vaultCollateralFormat =
              ethers.utils.formatEther(vaultCollateral);

            let availableBorrow =
              ((parseFloat(vaultCollateralFormat) *
                parseFloat(ethPriceFormat)) /
                (150 * parseFloat(gDaiPriceFormat))) *
                100 -
              parseFloat(vaultDebtFormat);

            let vaultRatio;
            if (parseInt(vaultDebtFormat) !== 0) {
              vaultRatio =
                ((parseFloat(vaultCollateralFormat) *
                  parseFloat(ethPriceFormat)) /
                  (parseFloat(vaultDebtFormat) * parseFloat(gDaiPriceFormat))) *
                100;
            } else {
              vaultRatio = 0;
            }

            const vaultObj = {
              id: vaultId,
              debt: vaultDebtFormat,
              collateral: parseFloat(vaultCollateralFormat).toFixed(2),
              availableBorrow: parseFloat(availableBorrow).toFixed(2),
              ratio: vaultRatio,
            };

            userVaultArray.push(vaultObj);
          }

          setUserVaultsBNB((vaults) => [...vaults, ...userVaultArray]);
          setIsLoading(false);
        });
    };

    getUserVaultDataBNB();
  }, [
    tokenContract,
    walletAddress,
    web3Ctx.walletAddres,
    web3Ctx.walletAddress,
  ]);

  useEffect(() => {
    setIsLoadingVaultCreate(true);
    const loadBNBVaultCreate = async () => {
      let maxSupply = await tokenContract.getDebtCeiling();
      let totalSupply = await tokenContract.totalSupply();
      maxSupply = ethers.utils.formatEther(maxSupply);
      totalSupply = ethers.utils.formatEther(totalSupply);
      setTotalGdaiAvailableBNB(
        (parseFloat(maxSupply) - parseFloat(totalSupply)).toFixed(2)
      );
    };

    const loadWethVaultCreate = async () => {
      // let minLiquidation =
      //   await wethVaultContract._minimumCollateralPercentage();
      let gdaiAvailable = await tokenContract.balanceOf(wethVaultAddress);
      gdaiAvailable = ethers.utils.formatEther(gdaiAvailable);
      setTotalGdaiAvailableWeth(gdaiAvailable);
    };

    loadBNBVaultCreate();
    loadWethVaultCreate();
    setIsLoadingVaultCreate(false);
  }, [
    tokenContract,
    wethVaultContract,
    totalGdaiAvailableBNB,
    totalGdaiAvailableWeth,
  ]);

  const approveWeth = async () => {
    try {
      closeModal();
      const tx = await web3Ctx.wethContract.approve(
        wethVaultAddress,
        ethers.utils.parseEther("100000000000")
      );

      await tx.wait();
      setSnackbarOpen({ open: true, error: false });
      getBalances();
    } catch (error) {
      setSnackbarOpen({ open: true, error: true });
      console.log(error);
    }
  };

  const createWethVault = async (vaultId) => {
    closeModalTwo();
    let gDaiPrice = await tokenContract.getTokenPriceSource();
    let gDaiPriceFormat = ethers.utils.formatEther(gDaiPrice);
    let ethPrice = await tokenContract.getEthPriceSource();
    let ethPriceFormat = ethers.utils.formatEther(ethPrice);

    let vaultDebt = await wethVaultContract.vaultDebt(vaultId);
    let vaultDebtFormat = ethers.utils.formatEther(vaultDebt);

    let vaultCollateral = await wethVaultContract.vaultCollateral(vaultId);
    let vaultCollateralFormat = ethers.utils.formatEther(vaultCollateral);
    let availableBorrow =
      ((parseFloat(vaultCollateralFormat) * parseFloat(ethPriceFormat)) /
        (150 * parseFloat(gDaiPriceFormat))) *
        100 -
      parseFloat(vaultDebtFormat);

    let vaultRatio;
    if (parseInt(vaultDebtFormat) !== 0) {
      vaultRatio =
        ((parseFloat(vaultCollateralFormat) * parseFloat(ethPriceFormat)) /
          (parseFloat(vaultDebtFormat) * parseFloat(gDaiPriceFormat))) *
        100;
    } else {
      vaultRatio = 0;
    }

    const vaultObj = {
      id: vaultId,
      debt: vaultDebtFormat,
      collateral: parseFloat(vaultCollateralFormat).toFixed(2),
      availableBorrow: parseFloat(availableBorrow).toFixed(2),
      ratio: vaultRatio,
    };

    setSnackbarOpen({ open: true, error: false });
    setUserVaultsWeth((vaults) => [...vaults, vaultObj]);
  };

  const createBNBVault = async (vaultId) => {
    closeModalTwo();
    let gDaiPrice = await tokenContract.getTokenPriceSource();
    let gDaiPriceFormat = ethers.utils.formatEther(gDaiPrice);
    let ethPrice = await tokenContract.getEthPriceSource();
    let ethPriceFormat = ethers.utils.formatEther(ethPrice);

    let vaultDebt = await tokenContract.vaultDebt(vaultId);
    let vaultDebtFormat = ethers.utils.formatEther(vaultDebt);

    let vaultCollateral = await tokenContract.vaultCollateral(vaultId);
    let vaultCollateralFormat = ethers.utils.formatEther(vaultCollateral);
    let availableBorrow =
      ((parseFloat(vaultCollateralFormat) * parseFloat(ethPriceFormat)) /
        (150 * parseFloat(gDaiPriceFormat))) *
        100 -
      parseFloat(vaultDebtFormat);

    let vaultRatio;
    if (parseInt(vaultDebtFormat) !== 0) {
      vaultRatio =
        ((parseFloat(vaultCollateralFormat) * parseFloat(ethPriceFormat)) /
          (parseFloat(vaultDebtFormat) * parseFloat(gDaiPriceFormat))) *
        100;
    } else {
      vaultRatio = 0;
    }

    const vaultObj = {
      id: vaultId,
      debt: vaultDebtFormat,
      collateral: parseFloat(vaultCollateralFormat).toFixed(2),
      availableBorrow: parseFloat(availableBorrow).toFixed(2),
      ratio: vaultRatio,
    };

    setSnackbarOpen({ open: true, error: false });
    setUserVaultsBNB((vaults) => [...vaults, vaultObj]);
  };

  const depositCollateralBNBVault = async (vaultId) => {
    let newArray = [...userVaultsBNB];
    const existingVaultIndex = newArray.findIndex(
      (vault) => vault.id === vaultId
    );

    let gDaiPrice = await tokenContract.getTokenPriceSource();
    let gDaiPriceFormat = ethers.utils.formatEther(gDaiPrice);
    let ethPrice = await tokenContract.getEthPriceSource();
    let ethPriceFormat = ethers.utils.formatEther(ethPrice);

    let vaultDebt = await tokenContract.vaultDebt(vaultId);
    let vaultDebtFormat = ethers.utils.formatEther(vaultDebt);

    let vaultCollateral = await tokenContract.vaultCollateral(vaultId);
    let vaultCollateralFormat = ethers.utils.formatEther(vaultCollateral);
    let availableBorrow =
      ((parseFloat(vaultCollateralFormat) * parseFloat(ethPriceFormat)) /
        (150 * parseFloat(gDaiPriceFormat))) *
        100 -
      parseFloat(vaultDebtFormat);

    let vaultRatio;
    if (parseInt(vaultDebtFormat) !== 0) {
      vaultRatio =
        ((parseFloat(vaultCollateralFormat) * parseFloat(ethPriceFormat)) /
          (parseFloat(vaultDebtFormat) * parseFloat(gDaiPriceFormat))) *
        100;
    } else {
      vaultRatio = 0;
    }

    const vaultObj = {
      id: vaultId,
      debt: vaultDebtFormat,
      collateral: parseFloat(vaultCollateralFormat).toFixed(2),
      availableBorrow: parseFloat(availableBorrow).toFixed(2),
      ratio: vaultRatio,
    };

    newArray[existingVaultIndex] = vaultObj;

    setUserVaultsBNB(newArray);
    getBalances();
  };

  const depositCollateralWethVault = async (vaultId) => {
    let newArray = [...userVaultsWeth];
    const existingVaultIndex = newArray.findIndex(
      (vault) => vault.id === vaultId
    );

    let gDaiPrice = await tokenContract.getTokenPriceSource();
    let gDaiPriceFormat = ethers.utils.formatEther(gDaiPrice);
    let ethPrice = await tokenContract.getEthPriceSource();
    let ethPriceFormat = ethers.utils.formatEther(ethPrice);

    let vaultDebt = await wethVaultContract.vaultDebt(vaultId);
    let vaultDebtFormat = ethers.utils.formatEther(vaultDebt);

    let vaultCollateral = await wethVaultContract.vaultCollateral(vaultId);
    let vaultCollateralFormat = ethers.utils.formatEther(vaultCollateral);
    let availableBorrow =
      ((parseFloat(vaultCollateralFormat) * parseFloat(ethPriceFormat)) /
        (150 * parseFloat(gDaiPriceFormat))) *
        100 -
      parseFloat(vaultDebtFormat);

    let vaultRatio;
    if (parseInt(vaultDebtFormat) !== 0) {
      vaultRatio =
        ((parseFloat(vaultCollateralFormat) * parseFloat(ethPriceFormat)) /
          (parseFloat(vaultDebtFormat) * parseFloat(gDaiPriceFormat))) *
        100;
    } else {
      vaultRatio = 0;
    }

    const vaultObj = {
      id: vaultId,
      debt: vaultDebtFormat,
      collateral: parseFloat(vaultCollateralFormat).toFixed(2),
      availableBorrow: parseFloat(availableBorrow).toFixed(2),
      ratio: vaultRatio,
    };

    newArray[existingVaultIndex] = vaultObj;

    setUserVaultsWeth(newArray);
    getBalances();
  };

  const liquidateVault = async (id, isBNB) => {
    try {
      setIsOpenThree(false);
      if (isBNB) {
        const tx = await liquidatorContract.liquidateVault(id);
        await tx.wait();
        const txPaid = await liquidatorContract.getPaid();
        await txPaid.wait();

        setLiqVaultsBNB(liqVaultsBNB.filter((vault) => vault.id !== id));
      } else {
        const tx = await wethVaultContract.liquidateVault(id);
        await tx.wait();
        const txPaid = await wethVaultContract.getPaid();
        await txPaid.wait();
      }

      setSnackbarOpen({ open: true, error: false });
    } catch (error) {
      console.log(error);
      setSnackbarOpen({ open: true, error: true });
    }
  };

  const approvegDaiLiquidator = async (isBNB) => {
    try {
      setIsOpenThree(false);
      if (isBNB) {
        const tx = await web3Ctx.tokenContract.approve(
          liquidatorAddress,
          ethers.utils.parseEther("1000000000000000")
        );

        await tx.wait();
      } else {
        const tx = await web3Ctx.tokenContract.approve(
          wethVaultAddress,
          ethers.utils.parseEther("1000000000000000")
        );

        await tx.wait();
      }

      setSnackbarOpen({ open: true, error: false });
      getBalances();
    } catch (e) {
      setSnackbarOpen({ open: true, error: true });
    }
  };

  function openModal(id, isBNB) {
    if (isBNB) {
      setIsBNBModal(isBNB);
      setVaultModalData(userVaultsBNB.find((vault) => vault.id === id));
    } else {
      setIsBNBModal(isBNB);
      setVaultModalData(userVaultsWeth.find((vault) => vault.id === id));
    }

    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModalTwo() {
    setIsOpenTwo(true);
  }

  function openModalThree(id, isBNB) {
    if (isBNB) {
      setIsBNBModal(isBNB);
      setVaultModalDataLiq(liqVaultsBNB.find((vault) => vault.id === id));
    } else {
      setIsBNBModal(isBNB);
      setVaultModalDataLiq(liqVaultsWeth.find((vault) => vault.id === id));
    }

    setIsOpenThree(true);
  }

  function afterOpenModalTwo() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = "#f00";
  }

  function afterOpenModalThree() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = "#f00";
  }

  function closeModalTwo() {
    setIsOpenTwo(false);
  }

  function closeModalThree() {
    setIsOpenThree(false);
  }

  const userVaultJSXBNB = userVaultsBNB
    .filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    )
    .map((vault) => (
      <li key={Math.random(100)}>
        <VaultEntry
          isLiq={false}
          data-id={vault.id}
          id={vault.id}
          collateral={vault.collateral}
          debt={vault.debt}
          ratio={parseFloat(vault.ratio).toFixed(2)}
          availableBorrow={vault.availableBorrow}
          openModal={openModal}
          isBNB={true}
        />
      </li>
    ));

  const userVaultJSXWeth = userVaultsWeth
    .filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    )
    .map((vault) => (
      <li key={Math.random(100)}>
        <VaultEntry
          isLiq={false}
          data-id={vault.id}
          id={vault.id}
          collateral={vault.collateral}
          debt={vault.debt}
          ratio={parseFloat(vault.ratio).toFixed(2)}
          availableBorrow={vault.availableBorrow}
          openModal={openModal}
          isBNB={false}
        />
      </li>
    ));

  const userVaultsBNBLiqJsx = liqVaultsBNB.map((vault) => (
    <li key={Math.random(100)}>
      <VaultEntry
        isLiq={true}
        data-id={vault.id}
        id={vault.id}
        collateral={parseFloat(vault.collateral).toFixed(2)}
        debt={parseFloat(vault.debt).toFixed(2)}
        ratio={parseFloat(vault.ratio).toFixed(2)}
        availableBorrow={parseFloat(vault.availableBorrow).toFixed(2)}
        openModal={openModalThree}
        isBNB={true}
      />
    </li>
  ));

  const userVaultsWethLiqJsx = liqVaultsWeth.map((vault) => (
    <li key={Math.random(100)}>
      <VaultEntry
        isLiq={true}
        data-id={vault.id}
        id={vault.id}
        collateral={parseFloat(vault.collateral).toFixed(2)}
        debt={parseFloat(vault.debt).toFixed(2)}
        ratio={parseFloat(vault.ratio).toFixed(2)}
        availableBorrow={parseFloat(vault.availableBorrow).toFixed(2)}
        openModal={openModalThree}
        isBNB={false}
      />
    </li>
  ));

  return (
    <>
      <div
        className={classes["vault-container"]}
        style={{
          background: !themeCtx.darkMode ? bgColor : undefined,
          overflowY: themeCtx.hamburgerToggled ? "hidden" : undefined,
        }}
      >
        <Header title="Vaults"></Header>
        <div className={classes["vault-navigation"]}>
          <div
            id={classes["vault-navigation-1"]}
            onClick={() => {
              setVaultManager(true);
            }}
            style={{
              backgroundColor:
                !vaultManager &&
                (themeCtx.darkMode ? "#090a10" : "rgba(0, 0, 0, 0.05)"),
              color: !themeCtx.darkMode ? txtColor : undefined,
            }}
          >
            Vault Manager
          </div>
          <div
            id={classes["vault-navigation-2"]}
            onClick={() => {
              setVaultManager(false);
            }}
            style={{
              backgroundColor:
                vaultManager &&
                (themeCtx.darkMode ? "#090a10" : "rgba(0, 0, 0, 0.05)"),
              color: !themeCtx.darkMode ? txtColor : undefined,
            }}
          >
            Vault Monitor
          </div>
        </div>
        <div
          className={classes["vault-line"]}
          style={{
            background: !themeCtx.darkMode ? bgColor2 : undefined,
          }}
        ></div>
        <div className={classes["all-vaults"]}>
          <div
            id={classes["all-vaults-text"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {vaultDisplayType}
            <div className={classes["menu-container"]}>
              <Button
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                style={{
                  color: "#74ec65",
                }}
              >
                <img
                  src={imgSrc}
                  alt="arrow"
                  width={15}
                  height={20}
                  id={classes["all-vaults-arrow"]}
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
                    transform: "translateX(-220px) translateY(-65px)",
                    backgroundColor: "#090a10ba",
                    color: "white",
                  },
                }}
              >
                <MenuItem data-my-value={"All Vaults"} onClick={handleClose}>
                  All Vaults
                </MenuItem>
                <MenuItem data-my-value={"BNB"} onClick={handleClose}>
                  BNB
                </MenuItem>
                <MenuItem data-my-value={"wETH"} onClick={handleClose}>
                  wETH
                </MenuItem>
              </Menu>
            </div>
          </div>
          {!vaultManager && (
            <div
              id={classes["liquidation-text"]}
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              Showing vaults close to liquidation
            </div>
          )}
          <div
            id={
              vaultManager
                ? classes["create-vault"]
                : classes["create-vault-hidden"]
            }
            onClick={openModalTwo}
          >
            Create Vault
          </div>
        </div>
        <div className={classes["all-vaults-mobile"]}>
          <div>
            <div
              className={classes["all-vaults-text-display"]}
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              {vaultDisplayType}{" "}
            </div>
            <div className={classes["all-vaults-mobile-container"]}>
              <Button
                id="fade-button"
                aria-controls={openMobile ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMobile ? "true" : undefined}
                onClick={handleClickMobile}
                style={{
                  color: "#74ec65",
                }}
              >
                <img
                  src={imgSrc}
                  alt="arrow"
                  width={15}
                  height={20}
                  id={classes["all-vaults-arrow-mobile"]}
                />
              </Button>
              <Menu
                id="fade-menu"
                MenuListProps={{
                  "aria-labelledby": "fade-button",
                }}
                anchorEl={anchorElMobile}
                open={openMobile}
                onClose={handleCloseMobile}
                TransitionComponent={Fade}
                PaperProps={{
                  style: {
                    transform: "translateX(-0px) translateY(-0px)",
                    backgroundColor: "#090a10ba",
                    color: "white",
                  },
                }}
              >
                <MenuItem
                  data-my-value={"All Vaults"}
                  onClick={handleCloseMobile}
                >
                  All Vaults
                </MenuItem>
                <MenuItem data-my-value={"BNB"} onClick={handleCloseMobile}>
                  BNB
                </MenuItem>
                <MenuItem data-my-value={"wETH"} onClick={handleCloseMobile}>
                  wETH
                </MenuItem>
              </Menu>
            </div>
          </div>

          {vaultManager ? (
            <div
              className={classes["create-vault-mobile"]}
              onClick={openModalTwo}
            >
              Create Vault
            </div>
          ) : (
            <div
              className={classes["create-vault-mobile"]}
              onClick={openModalTwo}
              id={classes["close-to-liq-mobile"]}
            >
              Showing Vaults Close to Liquidation
            </div>
          )}
        </div>
        <div
          className={classes["all-vault-header"]}
          style={{ color: !themeCtx.darkMode ? txtColor2 : undefined }}
        >
          {vaultManager && !window.isMobile && (
            <>
              <div>VAULT ID</div>
              <div>COLLATERAL</div>
              <div>DEBT (gDAI)</div>
              <div>RATIO (%)</div>
            </>
          )}
          {!vaultManager && !window.isMobile && (
            <>
              <div>VAULT ID</div>
              <div>COLLATERAL ($)</div>
              <div>DEBT (gDai)</div>
              <div>RATIO (%)</div>
            </>
          )}
        </div>
        <div
          id={classes["vault-line-2"]}
          style={{
            background: !themeCtx.darkMode ? bgColor2 : undefined,
          }}
        ></div>

        <div className={classes.vaults}>
          {vaultManager && (
            <>
              {!isLoading ? (
                (vaultDisplayType === "BNB" ||
                  vaultDisplayType === "All Vaults") &&
                userVaultJSXBNB
              ) : (
                <LoadingImg></LoadingImg>
              )}
              {!isLoadingWeth ? (
                (vaultDisplayType === "wETH" ||
                  vaultDisplayType === "All Vaults") &&
                userVaultJSXWeth
              ) : (
                <LoadingImg></LoadingImg>
              )}
            </>
          )}
          {!vaultManager && (
            <>
              {!isLoadingLiquidatorBNB ? (
                (vaultDisplayType === "BNB" ||
                  vaultDisplayType === "All Vaults") &&
                userVaultsBNBLiqJsx
              ) : (
                <LoadingImg></LoadingImg>
              )}
              {!isLoadingLiquidatorWeth ? (
                (vaultDisplayType === "wETH" ||
                  vaultDisplayType === "All Vaults") &&
                userVaultsWethLiqJsx
              ) : (
                <LoadingImg></LoadingImg>
              )}
              {/*
{!isLoadingLiquidatorBNB ? (
              (vaultDisplayType === "BNB" ||
                vaultDisplayType === "All Vaults") &&
                userVaultsBNBLiqJsx
            ) : (
              <LoadingImg></LoadingImg>
            )}
            {!isLoadingLiquidatorWeth ? (
              (vaultDisplayType === "wETH" ||
                vaultDisplayType === "All Vaults") &&
                userVaultsWethLiqJsx
            ) : (
              <LoadingImg></LoadingImg>
            )} */}
            </>
          )}
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            ariaHideApp={false}
            style={modalStyleVault}
            closeTimeoutMS={500}
            contentLabel="Vault Modal"
          >
            <VaultModal
              closeHandler={closeModal}
              id={vaultModalData.id}
              collateral={vaultModalData.collateral}
              debt={vaultModalData.debt}
              ratio={vaultModalData.ratio}
              availableBorrow={vaultModalData.availableBorrow}
              isBNB={isBNBModal}
              balances={balances}
              tokenContract={tokenContract}
              wethVaultContract={wethVaultContract}
              wethContract={wethContract}
              collateralBNB={depositCollateralBNBVault}
              collateralWeth={depositCollateralWethVault}
              allowances={allowances}
              approveWethHandler={approveWeth}
            />
          </Modal>
          <Modal
            isOpen={modalIsOpenTwo}
            onAfterOpen={afterOpenModalTwo}
            onRequestClose={closeModalTwo}
            ariaHideApp={false}
            style={modalStyleCreate}
            closeTimeoutMS={500}
            contentLabel="Vault Modal Two"
          >
            <CreateVaultModal
              closeHandler={closeModalTwo}
              wallet={walletAddress}
              gdaiBNB={totalGdaiAvailableBNB}
              gdaiWeth={totalGdaiAvailableWeth}
              tokenContract={tokenContract}
              wethVaultContract={wethVaultContract}
              createWethVault={createWethVault}
              createBNBVault={createBNBVault}
            />
          </Modal>
          <Modal
            isOpen={modalIsOpenThree}
            onAfterOpen={afterOpenModalThree}
            onRequestClose={closeModalThree}
            ariaHideApp={false}
            style={modalStyleLiquidate}
            closeTimeoutMS={500}
            contentLabel="Vault Modal Three"
          >
            <LiquidateVaultModal
              closeHandler={closeModalThree}
              id={vaultModalDataLiq.id}
              isBNB={isBNBModal}
              collateralRaw={parseFloat(
                vaultModalDataLiq.collateralRaw
              ).toFixed(2)}
              collateral={parseFloat(vaultModalDataLiq.collateral).toFixed(2)}
              debt={parseFloat(vaultModalDataLiq.debt).toFixed(2)}
              ratio={parseFloat(vaultModalDataLiq.ratio).toFixed(2)}
              availableBorrow={parseFloat(
                vaultModalDataLiq.availableBorrow
              ).toFixed(2)}
              liquidateVault={liquidateVault}
              allowanceLiquidator={allowances.allowanceLiquidator}
              allowanceLiquidatorWeth={allowances.allowanceLiquidatorWeth}
              approvegDaiLiquidator={approvegDaiLiquidator}
            />
          </Modal>
        </div>
      </div>
      <div className={classes["snackbar-container-vaults"]}>
        {snackbarOpen.open && <SnackbarUI error={snackbarOpen.error} />}
      </div>
    </>
  );
};

export default Vault;
