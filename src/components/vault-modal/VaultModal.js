import React, { useEffect, useState, useContext } from "react";
import classes from "./VaultModal.module.css";
import cancelIcon from "../../assets/cancel.svg";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import { ethers } from "ethers";
import { wethVaultAddress } from "../../utils/contract_abis";
import SnackbarUI from "../../components/snackbar/SnackbarUI";
import ThemeContext from "../../store/Theme-context";
import blackCross from "../../assets/fi_x.svg";

const CustomSlider = withStyles({
  rail: {
    backgroundImage:
      "linear-gradient(270deg, #1E9600 0%, #FFF200 50%, #FF0000 100%)",
    height: 16,
    borderRadius: 100,
  },
  track: {
    backgroundImage:
      "linear-gradient(270deg, #1E9600 0%, #FFF200 50%, #FF0000 100%)",
    height: 16,
    borderRadius: 100,
  },
  thumb: {
    color: "white",
    top: "75%",
  },
})(Slider);

const VaultModal = (props) => {
  const { innerWidth: width, innerHeight: height } = window;
  let useStyles;
  if (width <= 420) {
    useStyles = makeStyles({
      root: {
        width: 270,
        marginBottom: -20,
      },
    });
  } else {
    useStyles = makeStyles({
      root: {
        width: 607,
        marginBottom: -20,
      },
    });
  }

  const classes_slider = useStyles();
  const [value, setValue] = useState(99);
  const [collateralValue, setCollateralValue] = useState(
    props.isBNB
      ? parseFloat(props.balances.bnbBalance).toFixed(5)
      : parseFloat(props.balances.wethBalance).toFixed(5)
  );
  const [withdrawValue, setWithdrawValue] = useState(props.collateral);
  const [repayValue, setRepayValue] = useState(props.balances.gdaiBalance);
  const [borrowValue, setBorrowValue] = useState(props.availableBorrow);
  const [wethDepositApprove, setWethDepositApprove] = useState(false);
  const [manageState, setManageState] = useState({
    showCollateral: true,
    showWithdraw: false,
    showRepay: false,
    showBorrow: false,
  });
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    error: false,
  });

  const themeCtx = useContext(ThemeContext);

  let bgColor;
  let bgColor2;
  let bgColorBox;
  let txtColor;
  let inputColor;
  let imgSrc = cancelIcon;
  if (!themeCtx.darkMode) {
    bgColor = "#FFFFFF";
    bgColorBox = "rgba(0, 0, 0, 0.2)";
    txtColor = "#000000";
    inputColor = "rgba(0, 0, 0, 0.1)";
    bgColor2 = "rgba(0, 0, 0, 0.5)";
    imgSrc = blackCross;
  }

  const resetState = () => {
    setValue(99);
    setCollateralValue(
      props.isBNB
        ? parseFloat(props.balances.bnbBalance).toFixed(5)
        : parseFloat(props.balances.wethBalance).toFixed(5)
    );
    setWithdrawValue(props.collateral);
    setRepayValue(props.balances.gdaiBalance);
    setBorrowValue(props.availableBorrow);
  };

  useEffect(() => {
    if (props.allowances.depositAllowance >= 1) {
      setWethDepositApprove(true);
    } else {
      setWethDepositApprove(false);
    }
  }, []);

  const depositCollateralHandler = (value) => {
    if (value < 0) {
      value = Math.abs(value);
    }

    const collatMax = props.isBNB
      ? parseFloat(props.balances.bnbBalance).toFixed(5)
      : parseFloat(props.balances.wethBalance).toFixed(5);

    if (value > collatMax) {
      value = collatMax;
    }

    setValue(value / collatMax);
    setCollateralValue(value);
  };

  const withdrawValueHandler = (value) => {
    if (value < 0) {
      value = Math.abs(value);
    }

    if (value > parseFloat(props.collateral)) {
      value = parseFloat(props.collateral);
    }

    setValue(1 - value / parseFloat(props.collateral));
    setWithdrawValue(value);
  };

  const borrowValueHandler = (value) => {
    if (value < 0) {
      value = Math.abs(value);
    }

    if (value > parseFloat(props.availableBorrow)) {
      value = parseFloat(props.availableBorrow);
    }

    setValue(1 - value / parseFloat(props.availableBorrow));
    setBorrowValue(value);
  };

  const repayValueHandler = (value) => {
    if (value < 0) {
      value = Math.abs(value);
    }

    if (parseFloat(props.debt) === 0) {
      setValue(100);
      return;
    }

    if (value > parseFloat(props.balances.gdaiBalance)) {
      value = parseFloat(props.balances.gdaiBalance);
    }

    setValue(value / parseFloat(props.balances.gdaiBalance));
    setRepayValue(value);
  };

  const manualInputHandler = (event) => {
    console.log(event);
    setValue(event / props.balances.bnbBalance);
  };

  const setMaxHandler = () => {
    if (manageState.showCollateral) {
      setCollateralValue(
        props.isBNB
          ? parseFloat(props.balances.bnbBalance).toFixed(5)
          : parseFloat(props.balances.wethBalance).toFixed(5)
      );
    } else if (manageState.showWithdraw) {
      setWithdrawValue(props.collateral);
    } else if (manageState.showRepay) {
      setRepayValue(props.balances.gdaiBalance);
    } else {
      setBorrowValue(props.availableBorrow);
    }
  };

  const approveWethHandler = async () => {
    props.approveWethHandler();
  };

  const collateralBNBHandler = async () => {
    try {
      const txValue = collateralValue.toString();
      const tx = await props.tokenContract.depositCollateral(props.id, {
        value: ethers.utils.parseEther(txValue),
        gasLimit: 60000,
      });

      await tx.wait();
      setSnackbarOpen({ open: true, error: false });
      props.closeHandler();
      props.collateralBNB(props.id);
    } catch (error) {
      setSnackbarOpen({ open: true, error: true });
      console.log(error);
    }
  };

  const collateralWethHandler = async () => {
    try {
      const txValue = collateralValue.toString();
      console.log(txValue);
      const tx = await props.wethVaultContract.depositCollateral(
        props.id,
        ethers.utils.parseEther(txValue)
        // {
        //   gasLimit: 60000,
        // }
      );

      await tx.wait();
      setSnackbarOpen({ open: true, error: false });
      props.closeHandler();
      props.collateralWeth(props.id);
    } catch (error) {
      setSnackbarOpen({ open: true, error: true });
      console.log(error);
    }
  };

  const withdrawBNBHandler = async () => {
    if (props.collateral <= 0) {
      return;
    }

    try {
      const txValue = ethers.utils.parseEther(withdrawValue.toString());
      const tx = await props.tokenContract.withdrawCollateral(
        props.id,
        txValue
      );

      await tx.wait();
      setSnackbarOpen({ open: true, error: false });
      props.closeHandler();
      props.collateralBNB(props.id);
    } catch (error) {
      setSnackbarOpen({ open: true, error: true });
      console.log(error);
    }
  };

  const withdrawWethHandler = async () => {
    if (props.collateral <= 0) {
      return;
    }

    try {
      const txValue = ethers.utils.parseEther(withdrawValue.toString());
      const tx = await props.wethVaultContract.withdrawCollateral(
        props.id,
        txValue
      );

      await tx.wait();
      setSnackbarOpen({ open: true, error: false });
      props.closeHandler();
      props.collateralWeth(props.id);
    } catch (error) {
      setSnackbarOpen({ open: true, error: true });
      console.log(error);
    }
  };

  const borrowHandler = async () => {
    try {
      if (props.isBNB) {
        const txValue = ethers.utils.parseEther(borrowValue.toString());
        const tx = await props.tokenContract.borrowToken(props.id, txValue);

        await tx.wait();
        setSnackbarOpen({ open: true, error: false });
        props.closeHandler();
        props.collateralBNB(props.id);
      } else {
        const txValue = ethers.utils.parseEther(borrowValue.toString());
        const tx = await props.wethVaultContract.borrowToken(props.id, txValue);

        await tx.wait();
        setSnackbarOpen({ open: true, error: false });
        props.closeHandler();
        props.collateralWeth(props.id);
      }
    } catch (error) {
      setSnackbarOpen({ open: true, error: true });
      console.log(error);
    }
  };

  const repayHandler = async () => {
    if (repayValue <= 0) {
      return;
    }

    try {
      if (props.isBNB) {
        const txValue = ethers.utils.parseEther(repayValue.toString());
        const tx = await props.tokenContract.payBackToken(props.id, txValue);

        await tx.wait();
        setSnackbarOpen({ open: true, error: false });
        props.closeHandler();
        props.collateralBNB(props.id);
      } else {
        const txValue = ethers.utils.parseEther(repayValue.toString());
        const tx = await props.wethVaultContract.payBackToken(
          props.id,
          txValue
        );

        await tx.wait();
        setSnackbarOpen({ open: true, error: false });
        props.closeHandler();
        props.collateralWeth(props.id);
      }
    } catch (error) {
      setSnackbarOpen({ open: true, error: true });
      console.log(error);
    }
  };

  return (
    <div
      className={classes["vault-modal-container"]}
      style={{ background: !themeCtx.darkMode ? bgColor : undefined }}
    >
      <div className={classes["vault-modal-header"]}>
        <div style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
          {props.isBNB ? " BNB Vault " : " Weth Vault "}#{props.id}
        </div>
        <div id={classes["close-btn"]}>
          <button onClick={props.closeHandler}>
            <img src={imgSrc} alt="" id={classes["cancel-icon"]} />
          </button>
        </div>
      </div>
      <div
        className={classes["modal-line"]}
        style={{ background: !themeCtx.darkMode ? bgColor2 : undefined }}
      ></div>
      <div className={classes["vault-modal-content"]}>
        <div className={classes["vault-modal-content-item"]}>
          <span
            className={classes["col-one"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            Collateral
          </span>
          <span
            className={classes["col-two"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {props.collateral}
            {props.isBNB ? " BNB" : " wETH"}
          </span>
          <span
            id={classes["collateral-value"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {" "}
            $0.00
          </span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span
            className={classes["col-one"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            Debt
          </span>
          <span
            className={classes["col-two"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {props.debt} gDAI
          </span>
          <span
            id={classes["debt-value"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {" "}
            $0.00
          </span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span
            className={classes["col-one"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            Collateral to Debt Ratio
          </span>
          <span
            className={classes["col-two"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {props.ratio.toFixed(2)} &#37;
          </span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span
            className={classes["col-one"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            Available to Borrow
          </span>
          <span
            className={classes["col-two"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {props.availableBorrow} gDAI
          </span>
        </div>
      </div>
      <div
        className={classes["modal-line-2"]}
        style={{ background: !themeCtx.darkMode ? bgColor2 : undefined }}
      ></div>
      <div
        id={classes.manage}
        style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
      >
        Manage
      </div>
      <div className={classes["manage-actions"]}>
        <div
          className={classes["manage-actions-elem"]}
          onClick={() => {
            setManageState({
              showCollateral: true,
              showWithdraw: false,
              showRepay: false,
              showBorrow: false,
            });

            resetState();
          }}
          style={{
            color:
              manageState.showCollateral &&
              (!themeCtx.darkMode ? txtColor : "white"),
            backgroundColor:
              manageState.showCollateral &&
              (!themeCtx.darkMode ? bgColorBox : "rgba(255, 255, 255, 0.05)"),
            borderColor: manageState.showCollateral && "#090a10",
          }}
        >
          Deposit
        </div>
        <div
          className={classes["manage-actions-elem"]}
          onClick={() => {
            setManageState({
              showCollateral: false,
              showWithdraw: true,
              showRepay: false,
              showBorrow: false,
            });

            resetState();
          }}
          style={{
            color:
              manageState.showWithdraw &&
              (!themeCtx.darkMode ? txtColor : "white"),
            backgroundColor:
              manageState.showWithdraw &&
              (!themeCtx.darkMode ? bgColorBox : "rgba(255, 255, 255, 0.05)"),
            borderColor: manageState.showWithdraw && "#090a10",
          }}
        >
          Withdraw
        </div>
        <div
          className={classes["manage-actions-elem"]}
          onClick={() => {
            setManageState({
              showCollateral: false,
              showWithdraw: false,
              showRepay: true,
              showBorrow: false,
            });

            resetState();
          }}
          style={{
            color:
              manageState.showRepay &&
              (!themeCtx.darkMode ? txtColor : "white"),
            backgroundColor:
              manageState.showRepay &&
              (!themeCtx.darkMode ? bgColorBox : "rgba(255, 255, 255, 0.05)"),
            borderColor: manageState.showRepay && "#090a10",
          }}
        >
          Repay
        </div>
        <div
          className={classes["manage-actions-elem"]}
          onClick={() => {
            setManageState({
              showCollateral: false,
              showWithdraw: false,
              showRepay: false,
              showBorrow: true,
            });

            resetState();
          }}
          style={{
            color:
              manageState.showBorrow &&
              (!themeCtx.darkMode ? txtColor : "white"),
            backgroundColor:
              manageState.showBorrow &&
              (!themeCtx.darkMode ? bgColorBox : "rgba(255, 255, 255, 0.05)"),
            borderColor: manageState.showBorrow && "#090a10",
          }}
        >
          Borrow
        </div>
      </div>
      <div className={classes["vault-modal-content"]}>
        <div className={classes["vault-modal-content-item"]}>
          <span className={classes["col-one"]}>
            {manageState.showCollateral && (
              <span
                id={classes.deposit}
                style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
              >
                Deposit Collateral
              </span>
            )}
            {manageState.showWithdraw && (
              <span
                id={classes.deposit}
                style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
              >
                Withdraw Collateral
              </span>
            )}
            {manageState.showRepay && (
              <span
                id={classes.deposit}
                style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
              >
                Repay gDAI Debt
              </span>
            )}
            {manageState.showBorrow && (
              <span
                id={classes.deposit}
                style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
              >
                Borrow gDAI
              </span>
            )}
          </span>
          <span className={classes["col-two"]}>
            {manageState.showCollateral && (
              <span
                id={classes.balance}
                style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
              >
                Balance:{" "}
                <span id={classes["balance-colour"]}>
                  {" "}
                  {props.isBNB
                    ? parseFloat(props.balances.bnbBalance).toFixed(5)
                    : parseFloat(props.balances.wethBalance).toFixed(5)}
                </span>
              </span>
            )}
            {manageState.showWithdraw && (
              <span id={classes.balance}>
                Available:{" "}
                <span id={classes["balance-colour"]}>
                  {props.collateral} {props.isBNB ? " BNB" : " wETH"}
                </span>
              </span>
            )}
            {manageState.showRepay && (
              <span id={classes.balance}>
                Balance:{" "}
                <span id={classes["balance-colour"]}>
                  {props.balances.gdaiBalance} gDAI
                </span>
              </span>
            )}
            {manageState.showBorrow && (
              <span id={classes.balance}>
                Available:{" "}
                <span id={classes["balance-colour"]}>
                  {props.availableBorrow} gDAI
                </span>
              </span>
            )}
          </span>
        </div>
      </div>
      <div className={classes["swap-input"]}>
        {manageState.showCollateral && (
          <>
            <input
              type="number"
              max={
                props.isBNB
                  ? parseFloat(props.balances.bnbBalance).toFixed(5)
                  : parseFloat(props.balances.wethBalance).toFixed(5)
              }
              value={collateralValue}
              onChange={(e) => {
                depositCollateralHandler(e.target.value);
              }}
              style={{
                background: !themeCtx.darkMode ? bgColorBox : undefined,
                color: !themeCtx.darkMode ? txtColor : undefined,
              }}
            />
            <span id={classes.max} onClick={setMaxHandler}>
              MAX
            </span>
          </>
        )}
        {manageState.showWithdraw && (
          <>
            <input
              type="number"
              max={props.collateral}
              value={withdrawValue}
              onChange={(e) => {
                withdrawValueHandler(e.target.value);
              }}
              style={{
                background: !themeCtx.darkMode ? bgColorBox : undefined,
                color: !themeCtx.darkMode ? txtColor : undefined,
              }}
            />
            <span id={classes.max} onClick={setMaxHandler}>
              MAX
            </span>
          </>
        )}
        {manageState.showRepay && (
          <>
            <input
              type="number"
              max={props.balances.gdaiBalance}
              value={repayValue}
              onChange={(e) => {
                repayValueHandler(e.target.value);
              }}
              style={{
                background: !themeCtx.darkMode ? bgColorBox : undefined,
                color: !themeCtx.darkMode ? txtColor : undefined,
              }}
            />
            <span id={classes.max} onClick={setMaxHandler}>
              MAX
            </span>
          </>
        )}
        {manageState.showBorrow && (
          <>
            <input
              type="number"
              max={props.availableBorrow}
              value={borrowValue}
              onChange={(e) => {
                borrowValueHandler(e.target.value);
              }}
              style={{
                background: !themeCtx.darkMode ? bgColorBox : undefined,
                color: !themeCtx.darkMode ? txtColor : undefined,
              }}
            />
            <span id={classes.max} onClick={setMaxHandler}>
              MAX
            </span>
          </>
        )}
      </div>

      <>
        <div className={classes_slider.root}>
          <CustomSlider
            value={parseFloat(props.debt) === 0 ? 99 : value * 100}
            aria-labelledby="continuous-slider"
          />
        </div>
        <div className={classes["vault-modal-content"]}>
          <div className={classes["vault-modal-content-item"]}>
            <div className={classes["riskier-safer-container"]}>
              <span className={classes["col-one"]}>
                <span id={classes.deposit}>
                  <span
                    className={classes["riskier-safer"]}
                    style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                  >
                    RISKIER
                  </span>
                </span>
              </span>
              <span className={classes["col-two"]}>
                <span id={classes.balance}>
                  <span
                    className={classes["riskier-safer"]}
                    style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                  >
                    SAFER
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </>
      {manageState.showCollateral && (
        <div
          className={classes["deposit-bnb"]}
          onClick={
            props.isBNB
              ? collateralBNBHandler
              : wethDepositApprove
              ? collateralWethHandler
              : approveWethHandler
          }
        >
          {props.isBNB
            ? "Deposit BNB"
            : wethDepositApprove
            ? "Deposit wETH"
            : "Approve wETH"}
        </div>
      )}
      {manageState.showWithdraw && (
        <div
          className={classes["deposit-bnb"]}
          onClick={
            props.isBNB
              ? withdrawBNBHandler
              : wethDepositApprove
              ? withdrawWethHandler
              : approveWethHandler
          }
        >
          {props.isBNB
            ? "Withdraw BNB"
            : wethDepositApprove
            ? "withdraw wETH"
            : "Approve wETH"}
        </div>
      )}
      {manageState.showRepay && (
        <div className={classes["deposit-bnb"]} onClick={repayHandler}>
          Repay gDAI
        </div>
      )}
      {manageState.showBorrow && (
        <div className={classes["deposit-bnb"]} onClick={borrowHandler}>
          Borrow gDAI
        </div>
      )}
      <div className={classes["snackbar-container-vault-modal"]}>
        <> {snackbarOpen.open && <SnackbarUI error={snackbarOpen.error} />}</>
      </div>
    </div>
  );
};

export default VaultModal;
