import React, { useEffect, useState, useCallback, useContext } from "react";
import classes from "./Farm.module.css";
import Header from "../../components/header/Header";
import Modal from "react-modal";
import StakeLpModal from "../../components/stake-lp-modal/StakeLpModal";
import Accordion from "../../components/farm-accordion/FarmAccordion";
import Web3Context from "../../store/Web3-context";
import { ethers } from "ethers";
import {
  lpAbi,
  farmAddress,
  ghoulxAddress,
} from "../../utils/contract_abis_mainnet";
import { parseEther } from "ethers/lib/utils";
import LoadingImg from "../../components/loading-img-component/LoadingImg";
import SnackbarUI from "../../components/snackbar/SnackbarUI";
import ThemeContext from "../../store/Theme-context";

const axios = require("axios");

const modalStyle = {
  overlay: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    border: "none",
  },
  content: {
    width: "450px",
    height: "366.5px",
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
    height: "380.5px",
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

const Farm = () => {
  const web3Ctx = useContext(Web3Context);
  const [pools, setPools] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoadingPools, setIsLoadingPools] = useState(false);
  const [modalData, setModalData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: true,
    error: false,
  });
  const [accordionOpen, setAccordionOpen] = useState(false);

  const themeCtx = useContext(ThemeContext);
  let bgColor;
  let bgColor2;
  let bgColorBox;
  let txtColor;
  let txtColor2;
  let inputColor;
  if (!themeCtx.darkMode) {
    bgColor = "#FFFFFF";
    bgColorBox = "rgba(0, 0, 0, 0.03)";
    txtColor = "#000000";
    inputColor = "rgba(0, 0, 0, 0.1)";
    txtColor2 = "rgba(0, 0, 0, 0.3)";
    bgColor2 = "rgba(0, 0, 0, 0.5)";
  }

  const modalStyleLP = window.isMobile ? modalStyleMobile : modalStyle;

  const loadPools = useCallback(async () => {
    setIsLoadingPools(true);
    const poolCount = await web3Ctx.farmContract.poolLength();
    const poolCountFormat = parseInt(poolCount, 16);

    let pools = [];
    try {
      for (let i = 0; i < poolCountFormat; i++) {
        let pool = {};
        pool.id = i;
        const poolInfo = await web3Ctx.farmContract.poolInfo(i);
        pool.despositedAmount = await web3Ctx.farmContract.deposited(
          i,
          web3Ctx.walletAddress
        );
        pool.despositedAmount = parseFloat(
          ethers.utils.formatEther(pool.despositedAmount)
        ).toFixed(4);

        pool.pendingAmount = await web3Ctx.farmContract.pending(
          i,
          web3Ctx.walletAddress
        );
        pool.pendingAmount = parseFloat(
          ethers.utils.formatEther(pool.pendingAmount)
        ).toFixed(4);

        pool.lpToken = poolInfo[0];
        pool.allocPoint = poolInfo[1].toNumber();
        pool.lastRewardBlock = poolInfo[2].toNumber();
        pool.accERC20PerShare = poolInfo[3].toNumber();
        pool.depositFeeBP = parseInt(poolInfo[4]) / 100;

        pool.totalAllocation = await web3Ctx.farmContract.totalAllocPoint();
        pool.totalAllocation = pool.totalAllocation.toNumber();
        pool.pullAllocationPercentage = parseInt(
          (parseInt(pool.allocPoint) / parseInt(pool.totalAllocation)) * 100
        );

        const lpContract = new ethers.Contract(
          pool.lpToken,
          lpAbi,
          web3Ctx.signer
        );

        pool.lpName = await lpContract.name();
        pool.lpSymbol = await lpContract.symbol();
        pool.lpBalance = await lpContract.balanceOf(web3Ctx.walletAddress);
        pool.lpBalance = ethers.utils.formatEther(pool.lpBalance);
        pool.lpAllowance = await lpContract.allowance(
          web3Ctx.walletAddress,
          farmAddress
        );
        pool.lpAllowance = ethers.utils.formatEther(pool.lpAllowance);
        pool.lpApproved = parseInt(pool.lpAllowance) > 0;
        pool.lpBalanceContract = await lpContract.balanceOf(farmAddress);
        pool.lpBalanceContract = parseFloat(
          ethers.utils.formatEther(pool.lpBalanceContract)
        ).toFixed(4);
        pool.weight = (
          (parseFloat(pool.despositedAmount) /
            parseFloat(pool.lpBalanceContract)) *
          100
        ).toFixed(4);
        pool.isLp = false;
        const totalSupply = await lpContract.totalSupply();
        const totalSupplyFormat = ethers.utils.formatEther(totalSupply);
        let farmSupply = 0;
        if (pool.lpSymbol === "Cake-LP") {
          pool.isLp = true;
          pool.token0 = await lpContract.token0();
          pool.token1 = await lpContract.token1();

          const token1 = new ethers.Contract(
            pool.token1,
            lpAbi,
            web3Ctx.signer
          );
          const token2 = new ethers.Contract(
            pool.token0,
            lpAbi,
            web3Ctx.signer
          );

          let sym1 = await token1.symbol();
          let sym2 = await token2.symbol();
          let name1 = await token1.name();
          let name2 = await token2.name();
          farmSupply = await lpContract.balanceOf(farmAddress);
          farmSupply = ethers.utils.formatEther(farmSupply);
          pool.totalSupply = totalSupplyFormat;
          pool.farmSupply = farmSupply;
          if (sym1 == "WBNB") {
            sym1 = "BNB";
          }
          if (sym2 == "WBNB") {
            sym2 = "BNB";
          }
          if (name1 == "Wrapped BNB") {
            name1 = "BNB";
          }
          if (name2 == "Wrapped BNB") {
            name2 = "BNB";
          }
          if (sym2 == "BNB") {
            sym2 = sym1;
            name2 = name1;
            sym1 = "BNB";
            name1 = "BNB";
          }

          pool.lpSymbol = sym1 + "/" + sym2;
          pool.lpName = name1 + "/" + name2;
          let token0price = 0;
          let token1price = 0;

          try {
            token0price = await axios.get(
              "https://api.pancakeswap.info/api/v2/tokens/" + pool.token0
            );
            token1price = await axios.get(
              "https://api.pancakeswap.info/api/v2/tokens/" + pool.token1
            );
            pool.token0price = token0price.data.data.price;
            pool.token1price = token1price.data.data.price;
          } catch (error) {
            console.log(error);
            pool.token0price = 0;
            pool.token1price = 0;
          }

          let balance0 = await token2.balanceOf(pool.lpToken);
          balance0 = ethers.utils.formatEther(balance0);
          let balance1 = await token1.balanceOf(pool.lpToken);
          balance1 = ethers.utils.formatEther(balance1);
          console.log("TOTAL SUPPLY");
          console.log(balance0);
          console.log(balance1);

          console.log(pool.token0price);
          console.log(pool.token1price);
          console.log(totalSupplyFormat);
          console.log(pool.token0);
          console.log(pool.token1);
          pool.lpPrice =
            (parseFloat(pool.token0price) * parseFloat(balance0) +
              parseFloat(pool.token1price) * parseFloat(balance1)) /
            parseFloat(totalSupplyFormat);

          pool.poolValue = pool.lpPrice * parseFloat(farmSupply);
        } else {
          farmSupply = await lpContract.balanceOf(farmAddress);
          farmSupply = ethers.utils.formatEther(farmSupply);
          pool.farmSupply = farmSupply;

          const result = await axios
            .get("https://api.pancakeswap.info/api/v2/tokens/" + pool.lpToken)
            .then((res) => {
              pool.lpPrice = res.data.data.price;
              pool.poolValue = pool.lpPrice * parseFloat(farmSupply);
            });
        }

        pool.allowance = await lpContract.allowance(
          web3Ctx.walletAddress,
          farmAddress
        );
        pool.allowance = ethers.utils.formatEther(pool.allowance);
        if (parseInt(pool.allowance > 0)) {
          pool.approved = true;
        } else {
          pool.approved = false;
        }

        let result = {};
        let ghoulxPrice = 0;

        try {
          result = await axios.get(
            "https://api.pancakeswap.info/api/v2/tokens/" + ghoulxAddress
          );
          if (result.data) {
            ghoulxPrice = result.data.data.price;
          }
        } catch (error) {
          console.log(error);
        }

        pool.apy =
          ((31536000 * parseInt(pool.pullAllocationPercentage)) /
            100 /
            parseFloat(pool.poolValue)) *
          parseFloat(ghoulxPrice) *
          100;

        if (
          pool.token0 === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" ||
          pool.token1 === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
        ) {
          if (pool.token0 === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c") {
            pool.link0 = "BNB";
            pool.link1 = pool.token1;
          } else {
            pool.link0 = "BNB";
            pool.link1 = pool.token0;
          }
        }
        if (parseInt(pool.pullAllocationPercentage) > 0) {
          pools.push(pool);
        }
      }

      console.log(pools);
      setPools(pools);
      setIsLoadingPools(false);
    } catch (error) {
      console.log(error);
      setIsLoadingPools(false);
    }
  }, [web3Ctx.farmContract, web3Ctx.signer, web3Ctx.walletAddress]);

  useEffect(() => {
    loadPools();
    return () => {
      setPools([]);
    };
  }, [loadPools]);

  const approveLp = async (lpToken) => {
    try {
      const lpContrtact = new ethers.Contract(lpToken, lpAbi, web3Ctx.signer);
      const tx = await lpContrtact.approve(
        farmAddress,
        parseEther("1000000000000000")
      );
      setIsLoadingPools(true);

      await tx.wait();
      setSnackbarOpen({ open: true, error: false });
      loadPools();
      setIsLoadingPools(false);
    } catch (error) {
      setSnackbarOpen({ open: true, error: true });
      console.log(error);
      setIsLoadingPools(false);
    }
  };

  const depositLp = async (id, amount) => {
    try {
      const tx = await web3Ctx.farmContract.deposit(
        id,
        ethers.utils.parseEther(amount.toString())
      );
      setIsLoadingPools(true);
      await tx.wait();
      setSnackbarOpen({ open: true, error: false });
      loadPools();
      setIsLoadingPools(false);
    } catch (error) {
      setSnackbarOpen({ open: true, error: true });
      console.log(error);
      setIsLoadingPools(false);
    }
  };

  const harvest = async (id) => {
    try {
      const tx = await web3Ctx.farmContract.withdraw(id, 0);
      setIsLoadingPools(true);

      await tx.wait();
      setSnackbarOpen({ open: true, error: false });
      loadPools();
      setIsLoadingPools(false);
    } catch (error) {
      setSnackbarOpen({ open: true, error: true });
      console.log(error);
      setIsLoadingPools(false);
    }
  };

  const withdraw = async (id, amount) => {
    try {
      console.log(amount);
      const tx = await web3Ctx.farmContract.withdraw(
        id,
        ethers.utils.formatEther(amount.toString())
      );
      setIsLoadingPools(true);

      await tx.wait();
      setSnackbarOpen({ open: true, error: false });
      loadPools();
      setIsLoadingPools(false);
    } catch (error) {
      setSnackbarOpen({ open: true, error: true });
      console.log(error);
      setIsLoadingPools(false);
    }
  };

  const renderPools = pools.map((pool, index) => (
    <li key={Math.random(100)}>
      <Accordion
        asset={pool.lpSymbol}
        apy={parseFloat(pool.apy).toFixed(2)}
        tvl={parseFloat(pool.poolValue).toFixed(4)}
        earned={pool.pendingAmount}
        staked={pool.despositedAmount}
        lpBalance={pool.lpBalance}
        depositFee={pool.depositFeeBP}
        poolAllocation={pool.pullAllocationPercentage}
        openModalHandler={openModal}
        id={pool.id}
        approved={pool.lpApproved}
        lpToken={pool.lpToken}
        approveLp={approveLp}
        harvest={harvest}
        deposited={pool.despositedAmount}
        weight={pool.weight}
      />
    </li>
  ));

  function openModal(balance, asset, id, lpToken, isWithdraw, deposited) {
    console.log(isWithdraw);
    setModalData({
      balance: balance,
      asset: asset,
      id: id,
      lpToken: lpToken,
      isWithdraw: isWithdraw,
      deposited: deposited,
    });
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <div
        className={classes["farm-container"]}
        style={{ background: !themeCtx.darkMode ? bgColor : undefined }}
      >
        <Header title="Farms"></Header>
        <div className={classes["farm-navigation"]}>
          <div
            id={classes["farm-navigation-1"]}
            style={{
              color: !themeCtx.darkMode ? txtColor : undefined,
              background: !themeCtx.darkMode ? bgColor2 : undefined,
            }}
          >
            All Farms
          </div>
          <div
            id={classes["farm-navigation-2"]}
            style={{
              color: !themeCtx.darkMode ? txtColor : undefined,
              background: !themeCtx.darkMode ? bgColor2 : undefined,
            }}
          >
            My LPs
          </div>
        </div>
        <div
          className={classes["farm-line"]}
          style={{ background: !themeCtx.darkMode ? bgColor2 : undefined }}
        ></div>
        <h1 id={classes["all-farms"]}>
          {" "}
          All Farms Require a 0.5% deposit fee{" "}
        </h1>
        <div className={classes["accordion-container"]}>
          {pools.length > 0 && !isLoadingPools ? (
            renderPools
          ) : (
            <LoadingImg></LoadingImg>
          )}
        </div>
        <> {snackbarOpen.open && <SnackbarUI error={snackbarOpen.error} />}</>
        <div className={classes["modal-container"]}>
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            ariaHideApp={false}
            style={modalStyleLP}
            closeTimeoutMS={500}
            contentLabel="Vault Modal"
          >
            <StakeLpModal
              closeModalHandler={closeModal}
              depositLpHandler={depositLp}
              id={modalData.id}
              balance={modalData.balance}
              asset={modalData.asset}
              isWithdraw={modalData.isWithdraw}
              deposited={modalData.deposited}
              withdrawHandler={withdraw}
            />
          </Modal>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Farm;
