import React, { useState, useEffect, useRef, useContext } from "react";
import "./Accordion.css";
import Chevron from "../../assets/chevron.svg";
import chevronDark from "../../assets/arrow-darkmode.png";
import ghoulLogo from "../../assets/ghoul_logo.svg";
import daiLogo from "../../assets/dai_logo.svg";
import ThemeContext from "../../store/Theme-context";
import bnbGhoul from "../../assets/BNB - GHOUL.svg";
import bnbGhoulX from "../../assets/BNB- GHOULX.svg";
import ghoulDai from "../../assets/GHOUL- XDAI.svg";

export default function Accordion(props) {
  const [toggle, setToggle] = useState(false);
  const [heightEl, setHeightEl] = useState();

  const refHeight = useRef();

  const { innerWidth: width, innerHeight: height } = window;
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
    case "GHOUL":
      img = ghoulLogo;
      asset = "GHOUL";
      break;
    case "GHOULX/DAI":
      img = ghoulDai;
      asset = "GHOULX/DAI";
      break;
    case "BNB/GHOULX":
      img = bnbGhoulX;
      asset = "BNB/GHOULX";
      break;
    case "BNB/GHOUL":
      img = bnbGhoul;
      asset = "BNB/GHOUL";
      break;
    default:
      break;
  }

  useEffect(() => {
    if (width < 500) {
      setHeightEl(`${390}px`);
    } else {
      setHeightEl(`${114}px`);
    }
    //Default 114 (desktop)
  }, []);

  const toggleState = () => {
    setToggle(!toggle);
    props.toggleAccordion(props.index);
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
      style={{
        background: !themeCtx.darkMode ? bgColorBox : undefined,
        marginBottom: toggle ? (width < 500 ? "20rem" : "6rem") : "0rem",
      }}
    >
      <button onClick={toggleState} className="accordion-visible">
        <div className="accordion-title-container">
          <img src={img} alt="" />
          <div
            id="accordion-title"
            style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
          >
            {props.asset === "GHOUL" ? "GHOUL" : props.asset}
          </div>
        </div>
        <div className="accordion-content">
          <div id="earned">
            <div
              className="accordion-top-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              TVL
            </div>
            <div
              className="accordion-bottom-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              ${props.tvl}
            </div>
          </div>
          <div id="staked">
            <div
              className="accordion-top-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              APY
            </div>
            <div
              className="accordion-bottom-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              {props.apy}%
            </div>
          </div>
          <div id="deposit-fee">
            <div
              className="accordion-top-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              STAKED ({props.asset})
            </div>
            <div
              className="accordion-bottom-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              {props.deposited}
            </div>
          </div>
          <div id="pool-allocation">
            <div
              className="accordion-top-text"
              style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
            >
              POOL SHARE
            </div>
            <div
              className="accordion-bottom-text"
              style={{
                color: !themeCtx.darkMode ? txtColor : undefined,
              }}
            >
              {props.weight}%
            </div>
          </div>
        </div>
        <img className={toggle ? "active" : undefined} src={imgSrc} />
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
                  BALANCE <span id="get-more">Get more</span>
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
