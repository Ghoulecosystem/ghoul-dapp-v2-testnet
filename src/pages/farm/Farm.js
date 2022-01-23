import React, { useEffect, useState, useCallback, useContext } from "react";
import classes from "./Farm.module.css";
import Header from "../../components/header/Header";
import Modal from "react-modal";
import StakeLpModal from "../../components/stake-lp-modal/StakeLpModal";
import Accordion from "../../components/farm-accordion/FarmAccordion";
import Web3Context from "../../store/Web3-context";
import { ethers } from "ethers";
import { lpAbi, farmAddress } from "../../utils/contract_abis_mainnet";
import { parseEther } from "ethers/lib/utils";
import LoadingImg from "../../components/loading-img-component/LoadingImg";
import SnackbarUI from "../../components/snackbar/SnackbarUI";
import ThemeContext from "../../store/Theme-context";

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
    open: false,
    error: false,
  });

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
      for (let i = 1; i < poolCountFormat; i++) {
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

        const userInfo = await web3Ctx.farmContract.userInfo(
          i,
          web3Ctx.walletAddress
        );

        pool.amount = userInfo[0].toNumber().toString();
        pool.rewardDept = userInfo[1].toNumber();
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
        console.log(pool.lpBalanceContract);
        pool.lpBalanceContract = parseFloat(
          ethers.utils.formatEther(pool.lpBalanceContract)
        ).toFixed(4);

        pool.weight = parseFloat(pool.despositedAmount);

        pools.push(pool);
      }
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
      setIsLoadingPools(true);
      const tx = await web3Ctx.farmContract.deposit(
        id,
        ethers.utils.parseEther(amount.toString())
      );

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

  const renderPools = pools.map((pool) => (
    <li key={Math.random(100)}>
      <Accordion
        asset={pool.lpSymbol}
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
      <h1 id={classes["all-farms"]}> All Farms Require a 0.5% deposit fee </h1>
      <div className={classes["accordion-container"]}>
        {pools.length > 0 && !isLoadingPools ? (
          renderPools
        ) : (
          <LoadingImg></LoadingImg>
        )}
      </div>
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
      <div>
        {snackbarOpen.open && <SnackbarUI error={snackbarOpen.error} />}
      </div>
    </div>
  );
};

export default Farm;
