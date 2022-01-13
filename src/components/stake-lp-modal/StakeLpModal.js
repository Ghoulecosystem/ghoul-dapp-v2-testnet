import React, { useState } from "react";
import classes from "./StakeLpModal.module.css";
import cancelIcon from "../../assets/cancel.svg";

const StakeLpModal = (props) => {
  const [inputValue, setInputValue] = useState(0);

  let balance;

  switch (props.isWithdraw) {
    case true:
      balance = props.deposited;
      break;
    default:
      balance = props.balance;
      break;
  }

  const closeModalHandler = () => {
    props.closeModalHandler();
  };

  const inputHandler = (value) => {
    if (value < 0) {
      value = Math.abs(value);
    }

    if (value > parseFloat(balance)) {
      value = balance;
    }

    setInputValue(value);
  };

  const maxHandler = () => {
    setInputValue(balance);
  };

  const depositHandler = () => {
    props.closeModalHandler();
    if (props.isWithdraw) {
      props.withdrawHandler(props.id, inputValue);
    } else {
      props.depositLpHandler(props.id, inputValue);
    }
  };

  return (
    <div className={classes["vault-modal-container"]}>
      <div className={classes["vault-modal-header"]}>
        <div>{props.isWithdraw ? "Withdraw" : "Stake LP"}</div>
        <button onClick={closeModalHandler}>
          <img src={cancelIcon} alt="" id={classes["cancel-img"]} />
        </button>
      </div>
      <div className={classes["modal-line"]}></div>
      <div className={classes["vault-modal-content"]}>
        <div className={classes["vault-modal-content-item"]}>
          <span className={classes["col-one"]}></span>
          <div className={classes["col-two"]}>
            Availble {props.isWithdraw ? "LP" : props.asset}:{" "}
            <span>{balance}</span>
          </div>
        </div>
      </div>
      <div className={classes["lp-input"]}>
        <input
          type="number"
          defaultValue={0}
          max={balance}
          value={inputValue}
          onChange={(e) => {
            inputHandler(e.target.value);
          }}
        />
        <span id={classes.max} onClick={maxHandler}>
          MAX
        </span>
      </div>
      <div className={classes["deposit-bnb"]} onClick={depositHandler}>
        {props.isWithdraw ? "Withdraw" : "Confirm"}
      </div>
      <div className={classes["deposit-span"]}>
        All deposits require a fee of 0.5%
      </div>
    </div>
  );
};

export default StakeLpModal;
