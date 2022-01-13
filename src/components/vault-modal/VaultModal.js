import React, { useEffect, useState } from "react";
import classes from "./VaultModal.module.css";
import cancelIcon from "../../assets/cancel.svg";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import { ethers } from "ethers";
import { wethVaultAddress } from "../../utils/contract_abis";

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
  let useStyles;
  console.log(window.isMobile);
  if (window.isMobile) {
    useStyles = makeStyles({
      root: {
        width: 270,
        marginBottom: -20,
      },
    });
    console.log("ON MOBILE");
  } else {
    useStyles = makeStyles({
      root: {
        width: 607,
        marginBottom: -20,
      },
    });
  }

  const classes_slider = useStyles();
  const [value, setValue] = useState(
    props.balances.bnbBalance / props.balances.bnbBalance
  );

  const [withdrawValue, setWithdrawValue] = useState(props.collateral);
  const [repayValue, setRepayValue] = useState(props.debt);
  const [borrowValue, setBorrowValue] = useState(props.availableBorrow);
  const [wethDepositApprove, setWethDepositApprove] = useState(false);
  const [manageState, setManageState] = useState({
    showCollateral: true,
    showWithdraw: false,
    showRepay: false,
    showBorrow: false,
  });

  useEffect(() => {
    if (props.allowances.depositAllowance >= 1) {
      setWethDepositApprove(true);
    } else {
      setWethDepositApprove(false);
    }
  }, []);

  const handleChange = (event, newValue) => {
    if (newValue === 0) {
      newValue = 1;
    }

    setValue(newValue / 100);
  };

  const withdrawValueHandler = (value) => {
    if (value < 0) {
      value = Math.abs(value);
    }

    if (value > props.collateral) {
      value = props.collateral;
    }

    setWithdrawValue(value);
  };

  const borrowValueHandler = (value) => {
    if (value < 0) {
      value = Math.abs(value);
    }

    if (value > props.availableBorrow) {
      value = props.availableBorrow;
    }

    setBorrowValue(value);
  };

  const manualInputHandler = (event) => {
    console.log(event);
    setValue(event / props.balances.bnbBalance);
  };

  const setMaxHandler = () => {
    if (manageState.showCollateral) {
      setValue(props.balances.bnbBalance / props.balances.bnbBalance);
    } else if (manageState.showWithdraw) {
      setWithdrawValue(props.collateral);
    }
  };

  const approveWethHandler = async () => {
    try {
      console.log(props.wethContract);
      const tx = await props.wethContract.approve(
        wethVaultAddress,
        ethers.utils.parseEther("100000000000")
      );
      await tx.wait();
      setWethDepositApprove(true);
    } catch (error) {
      console.log(error);
    }
  };

  const collateralBNBHandler = async () => {
    try {
      const txValue = (value * props.balances.bnbBalance).toString();
      const tx = await props.tokenContract.depositCollateral(props.id, {
        value: ethers.utils.parseEther(txValue),
        gasLimit: 60000,
      });

      await tx.wait();
      props.closeHandler();
      props.collateralBNB(props.id);
    } catch (error) {
      console.log(error);
    }
  };

  const collateralWethHandler = async () => {
    try {
      const txValue = (value * props.balances.wethBalance).toString();
      const tx = await props.wethVaultContract.depositCollateral(
        props.id,
        ethers.utils.parseEther(txValue),
        {
          gasLimit: 60000,
        }
      );

      await tx.wait();
      props.closeHandler();
      props.collateralWeth(props.id);
    } catch (error) {
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
      props.closeHandler();
      props.collateralBNB(props.id);
    } catch (error) {
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
      props.closeHandler();
      props.collateralWeth(props.id);
    } catch (error) {
      console.log(error);
    }
  };

  const borrowHandler = async () => {
    try {
      if (props.isBNB) {
        const txValue = ethers.utils.parseEther(borrowValue.toString());
        const tx = await props.tokenContract.borrowToken(props.id, txValue);
        await tx.wait();
        props.closeHandler();
        props.collateralBNB(props.id);
      } else {
        const txValue = ethers.utils.parseEther(borrowValue.toString());
        const tx = await props.wethVaultContract.borrowToken(props.id, txValue);
        await tx.wait();
        props.closeHandler();
        props.collateralWeth(props.id);
      }
    } catch (error) {
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
        props.closeHandler();
        props.collateralBNB(props.id);
      } else {
        const txValue = ethers.utils.parseEther(repayValue.toString());
        const tx = await props.wethVaultContract.payBackToken(
          props.id,
          txValue
        );
        await tx.wait();
        props.closeHandler();
        props.collateralWeth(props.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes["vault-modal-container"]}>
      <div className={classes["vault-modal-header"]}>
        <div>
          {props.isBNB ? " BNB Vault " : " Weth Vault "}#{props.id}
        </div>
        <div id={classes["close-btn"]}>
          <button onClick={props.closeHandler}>
            <img src={cancelIcon} alt="" />
          </button>
        </div>
      </div>
      <div className={classes["modal-line"]}></div>
      <div className={classes["vault-modal-content"]}>
        <div className={classes["vault-modal-content-item"]}>
          <span className={classes["col-one"]}>Collateral</span>
          <span className={classes["col-two"]}>
            {props.collateral} {props.isBNB ? "BNB" : "wETH"}
          </span>
          <span id={classes["collateral-value"]}> $0.00</span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span className={classes["col-one"]}>Debt</span>
          <span className={classes["col-two"]}>{props.debt} gDai</span>
          <span id={classes["debt-value"]}> $0.00</span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span className={classes["col-one"]}>Collateral to Debt Ratio</span>
          <span className={classes["col-two"]}>{props.ratio}</span>
        </div>
        <div className={classes["vault-modal-content-item"]}>
          <span className={classes["col-one"]}>Available to Borrow</span>
          <span className={classes["col-two"]}>
            {props.availableBorrow} gDai
          </span>
        </div>
      </div>
      <div className={classes["modal-line-2"]}></div>
      <div id={classes.manage}>Manage</div>
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
          }}
          style={{
            color: manageState.showCollateral && "white",
            backgroundColor:
              manageState.showCollateral && "rgba(255, 255, 255, 0.05)",
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
          }}
          style={{
            color: manageState.showWithdraw && "white",
            backgroundColor:
              manageState.showWithdraw && "rgba(255, 255, 255, 0.05)",
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
          }}
          style={{
            color: manageState.showRepay && "white",
            backgroundColor:
              manageState.showRepay && "rgba(255, 255, 255, 0.05)",
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
          }}
          style={{
            color: manageState.showBorrow && "white",
            backgroundColor:
              manageState.showBorrow && "rgba(255, 255, 255, 0.05)",
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
              <span id={classes.deposit}>Deposit Collateral</span>
            )}
            {manageState.showWithdraw && (
              <span id={classes.deposit}>Withdraw Collateral</span>
            )}
            {manageState.showRepay && (
              <span id={classes.deposit}>Repay gDai Debt</span>
            )}
            {manageState.showBorrow && (
              <span id={classes.deposit}>Borrow gDai</span>
            )}
          </span>
          <span className={classes["col-two"]}>
            {manageState.showCollateral && (
              <span id={classes.balance}>
                Balance:{" "}
                <span id={classes["balance-colour"]}>
                  {" "}
                  {props.isBNB
                    ? parseFloat(props.balances.bnbBalance).toFixed(5)
                    : parseFloat(props.balances.wethBalance).toFixed(5)}
                  {props.isBNB ? " BNB" : " wETH"}
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
                <span id={classes["balance-colour"]}>{props.debt} gDai</span>
              </span>
            )}
            {manageState.showBorrow && (
              <span id={classes.balance}>
                Available:{" "}
                <span id={classes["balance-colour"]}>
                  {props.availableBorrow} gDai
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
              max={props.bnbBlance}
              value={
                props.isBNB
                  ? parseFloat(
                      Math.abs(value * props.balances.bnbBalance)
                    ).toFixed(5)
                  : parseFloat(
                      Math.abs(value * props.balances.wethBalance)
                    ).toFixed(5) || ""
              }
              onChange={() => {}}
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
              max={props.debt}
              value={repayValue}
              onChange={(e) => {
                withdrawValueHandler(e.target.value);
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
            />
            <span id={classes.max} onClick={setMaxHandler}>
              MAX
            </span>
          </>
        )}
      </div>
      {manageState.showCollateral && (
        <>
          <div className={classes_slider.root}>
            <CustomSlider
              value={value * 100}
              onChange={handleChange}
              aria-labelledby="continuous-slider"
            />
          </div>
          <div className={classes["vault-modal-content"]}>
            <div className={classes["vault-modal-content-item"]}>
              <div className={classes["riskier-safer-container"]}>
                <span className={classes["col-one"]}>
                  <span id={classes.deposit}>
                    <span className={classes["riskier-safer"]}>RISKIER</span>
                  </span>
                </span>
                <span className={classes["col-two"]}>
                  <span id={classes.balance}>
                    <span className={classes["riskier-safer"]}>SAFER</span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
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
          Repay gDai
        </div>
      )}
      {manageState.showBorrow && (
        <div className={classes["deposit-bnb"]} onClick={borrowHandler}>
          Borrow gDai
        </div>
      )}
    </div>
  );
};

export default VaultModal;
