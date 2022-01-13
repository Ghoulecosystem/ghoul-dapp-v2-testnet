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
import { wethVaultAddress, tokenAddress } from "../../utils/contract_abis";
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
      let ethPriceFormat = ethers.utils.formatEther(ethPrice);
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

  useEffect(() => {
    const getBalances = async () => {
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

      const allowanceBNBFormat = ethers.utils.formatEther(allowanceBNB);
      const allowanceWethFormat = ethers.utils.formatEther(allowanceWeth);
      const depositAllowanceFormat = ethers.utils.formatEther(depositAllowance);

      setAllowances({
        allowanceBNB: allowanceBNBFormat,
        allowanceWeth: allowanceWethFormat,
        depositAllowance: depositAllowanceFormat,
      });

      setBalances({
        bnbBalance: balanceFormat,
        wethBalance: balanceWethFormat,
      });
    };

    getBalances();
    return () => {
      setBalances({});
      setAllowances({});
    };
  }, []);

  useEffect(() => {
    const getUserVaultDataWeth = async () => {
      while (!web3Ctx.walletAddress) {}
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
        console.log(`No vaults found for user: ${address}`);
        setIsLoadingWeth(false);
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
  }, [web3Ctx.walletAddres]);

  useEffect(() => {
    const getUserVaultDataBNB = async () => {
      while (!web3Ctx.walletAddress) {}
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
            console.log(`No vaults found for user: ${address}`);
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
  }, [web3Ctx.walletAddres]);

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
  };

  const liquidateVault = async (id, isBNB) => {
    try {
      setIsOpenThree(false);
      if (isBNB) {
        const tx = await liquidatorContract.liquidateVault(id);
        await tx.wait();
      } else {
        const tx = await wethVaultContract.liquidateVault(id);
        await tx.wait();
      }
    } catch (error) {
      console.log(error);
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

  // const userVaultJSXBNB = userVaultsBNB.map((vault) => (
  //   <li key={Math.random(100)}>
  //     <VaultEntry
  //       isLiq={false}
  //       data-id={vault.id}
  //       id={vault.id}
  //       collateral={vault.collateral}
  //       debt={vault.debt}
  //       ratio={parseFloat(vault.ratio).toFixed(2)}
  //       availableBorrow={vault.availableBorrow}
  //       openModal={openModal}
  //       isBNB={true}
  //     />
  //   </li>
  // ));

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
        openModal={openModalTwo}
        isBNB={true}
      />
    </li>
  ));

  return (
    <div className={classes["vault-container"]}>
      <Header title="Vaults"></Header>
      <div className={classes["vault-navigation"]}>
        <div
          onClick={() => {
            setVaultManager(true);
          }}
          style={{ backgroundColor: !vaultManager && "#090a10" }}
        >
          Vault Manager
        </div>
        <div
          onClick={() => {
            setVaultManager(false);
          }}
          style={{ backgroundColor: vaultManager && "#090a10" }}
        >
          Vault Monitor
        </div>
      </div>
      <div className={classes["vault-line"]}></div>
      <div className={classes["all-vaults"]}>
        <div id={classes["all-vaults-text"]}>
          All Vaults{" "}
          <img src={allVaultArrow} alt="arrow" width={9} height={26} />
        </div>
        {!vaultManager && (
          <div id={classes["liquidation-text"]}>
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
          {vaultManager ? "All Vaults" : "Showing Vaults Close to Liquidation"}
        </div>
        {vaultManager && (
          <div
            className={classes["create-vault-mobile"]}
            onClick={openModalTwo}
          >
            Create Vault
          </div>
        )}
      </div>
      <div className={classes["all-vault-header"]}>
        {vaultManager && !window.isMobile && (
          <>
            <div>VAULT ID</div>
            <div>COLLATERAL (BNB)</div>
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
      <div id={classes["vault-line-2"]}></div>
      <div className={classes.vaults}>
        {vaultManager && (
          <>
            {!isLoading ? userVaultJSXBNB : <LoadingImg></LoadingImg>}
            {!isLoadingWeth ? userVaultJSXWeth : <LoadingImg></LoadingImg>}
          </>
        )}
        {!vaultManager && (
          <>
            {!isLoadingLiquidatorBNB ? (
              userVaultsBNBLiqJsx
            ) : (
              <LoadingImg></LoadingImg>
            )}
            {!isLoadingLiquidatorWeth ? (
              userVaultsWethLiqJsx
            ) : (
              <LoadingImg></LoadingImg>
            )}

            {/* {!isLoadingWeth ? (
              userVaultJSXWeth
            ) : (
              <h1>Loading Weth Vaults...</h1>
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
            collateralRaw={parseFloat(vaultModalDataLiq.collateralRaw).toFixed(
              2
            )}
            collateral={parseFloat(vaultModalDataLiq.collateral).toFixed(2)}
            debt={parseFloat(vaultModalDataLiq.debt).toFixed(2)}
            ratio={parseFloat(vaultModalDataLiq.ratio).toFixed(2)}
            availableBorrow={parseFloat(
              vaultModalDataLiq.availableBorrow
            ).toFixed(2)}
            liquidateVault={liquidateVault}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Vault;
