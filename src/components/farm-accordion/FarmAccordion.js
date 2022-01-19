import React, { useState, useEffect, useRef, useContext } from "react";
import "./Accordion.css";
import Chevron from "../../assets/chevron.svg";
import chevronDark from "../../assets/arrow-darkmode.png";
import ghoulLogo from "../../assets/ghoul_logo.svg";
import daiLogo from "../../assets/dai_logo.svg";
import ThemeContext from "../../store/Theme-context";

export default function Accordion(props) {
  const [toggle, setToggle] = useState(false);
  const [heightEl, setHeightEl] = useState();

  const refHeight = useRef();

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
    txtColor2 = "rgba(0, 0, 0, 0.05)";
    bgColor2 = "rgba(0, 0, 0, 0.5)";
  }

  let imgSrc = Chevron;
  if (!themeCtx.darkMode) {
    imgSrc = chevronDark;
  }

  let img;
  let asset;
  switch (props.asset) {
    case "gDAI":
      img = ghoulLogo;
      asset = "gDAI";
      break;
    case "DAI":
      img = daiLogo;
      asset = "DAI";
      break;
    default:
      break;
  }

  useEffect(() => {
    if (window.isMobile) {
      setHeightEl(`${345}px`);
    } else {
      setHeightEl(`${114}px`);
    }
    //Default 114 (desktop)
  }, []);

  const toggleState = () => {
    setToggle(!toggle);
  };

  const openModalHandler = (isWithdraw) => {
    props.openModalHandler(
      props.lpBalance,
      asset,
      props.id,
      props.lpToken,
      isWithdraw,
      props.deposited
    );
  };

  const approveLpHandler = () => {
    props.approveLp(props.lpToken);
  };

  const harvestHandler = () => {
    props.harvest(props.id);
  };

  return (
    <div
      className="accordion"
      style={{ background: !themeCtx.darkMode ? bgColorBox : undefined }}
    >
      <button onClick={toggleState} className="accordion-visible">
        <div className="accordion-title-container">
          <img src={img} alt="" />
          <div
            id="accordion-title"
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {asset}
          </div>
        </div>
        <div className="accordion-content">
          <div id="earned">
            <div
              className="accordion-top-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              EARNED
            </div>
            <div
              className="accordion-bottom-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              {props.earned} GhoulX
            </div>
          </div>
          <div id="staked">
            <div
              className="accordion-top-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              STAKED
            </div>
            <div
              className="accordion-bottom-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              {props.staked} {asset}
            </div>
          </div>
          <div id="deposit-fee">
            <div
              className="accordion-top-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              DEPOSIT FEE
            </div>
            <div
              className="accordion-bottom-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              {props.depositFee}%
            </div>
          </div>
          <div id="pool-allocation">
            <div
              className="accordion-top-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              POOL ALLOCATION
            </div>
            <div
              className="accordion-bottom-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              {props.poolAllocation}%
            </div>
          </div>
        </div>
        <img className={toggle && "active"} src={imgSrc} />
      </button>
      <div
        className={toggle ? "accordion-toggle animated" : "accordion-toggle"}
        style={{
          height: toggle ? `${heightEl}` : "0px",
          background: !themeCtx.darkMode ? bgColorBox : undefined,
        }}
        ref={refHeight}
      >
        <div
          aria-hidden={toggle ? "true" : "false"}
          className="accordion-elem-container"
        >
          <div
            className="accordion-elem-1"
            style={{ background: !themeCtx.darkMode ? txtColor2 : undefined }}
          >
            <div className="accordion-elem-col-1">
              <img src={ghoulLogo} alt="" id="ghoul-img" />
              <div>
                <div
                  className="accordion-top-text"
                  style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                >
                  PENDING REWARDS
                </div>
                <div
                  className="accordion-bottom-text"
                  style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                >
                  {props.earned}
                </div>
              </div>
            </div>
            <div className="harvest-container">
              <div className="harvest" onClick={harvestHandler}>
                Harvest
              </div>
            </div>
          </div>
          <div
            className="accordion-elem-2"
            style={{ background: !themeCtx.darkMode ? txtColor2 : undefined }}
          >
            <div className="accordion-elem-col-1">
              <img src={ghoulLogo} alt="" id="ghoul-img" />
              <div>
                <div
                  className="accordion-top-text"
                  style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                >
                  {asset} BALANCE <span id="get-more">Get more</span>
                </div>
                <div
                  className="accordion-bottom-text"
                  style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                >
                  {props.lpBalance}
                </div>
              </div>
            </div>
            <div
              className="withdraw"
              onClick={() => {
                openModalHandler(true);
              }}
            >
              Withdraw
            </div>
            {props.approved ? (
              <div className="LP-container">
                <div
                  className="add-LP"
                  onClick={() => {
                    openModalHandler(false);
                  }}
                >
                  Add LP
                </div>
              </div>
            ) : (
              <div className="LP-container">
                <div className="approve-LP" onClick={approveLpHandler}>
                  Approve LP
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
