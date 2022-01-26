import React, { useState, useContext, useEffect } from "react";
import classes from "./StakeLpModal.module.css";
import cancelIcon from "../../assets/cancel.svg";
import ThemeContext from "../../store/Theme-context";
import blackCross from "../../assets/fi_x.svg";

const StakeLpModal = (props) => {
  const [inputValue, setInputValue] = useState(0);

  const themeCtx = useContext(ThemeContext);

  useEffect(() => {
    return () => {
      setInputValue([]);
    };
  }, []);

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
    <div
      className={classes["vault-modal-container"]}
      style={{ background: !themeCtx.darkMode ? bgColor : undefined }}
    >
      <div className={classes["vault-modal-header"]}>
        <div style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
          {props.isWithdraw ? "Withdraw" : "Stake LP"}
        </div>
        <button onClick={closeModalHandler}>
          <img src={imgSrc} alt="" id={classes["cancel-img"]} />
        </button>
      </div>
      <div
        className={classes["modal-line"]}
        style={{ background: !themeCtx.darkMode ? bgColor2 : undefined }}
      ></div>
      <div className={classes["vault-modal-content"]}>
        <div className={classes["vault-modal-content-item"]}>
          <span className={classes["col-one"]}></span>
          <div
            className={classes["col-two"]}
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
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
          style={{
            background: !themeCtx.darkMode ? bgColor2 : undefined,
            color: !themeCtx.darkMode ? txtColor : undefined,
          }}
        />
        <span id={classes.max} onClick={maxHandler}>
          MAX
        </span>
      </div>
      <div className={classes["deposit-bnb"]} onClick={depositHandler}>
        {props.isWithdraw ? "Withdraw" : "Confirm"}
      </div>
      <div
        className={classes["deposit-span"]}
        style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
      >
        All deposits require a fee of 0.5%
      </div>
    </div>
  );
};

export default StakeLpModal;
