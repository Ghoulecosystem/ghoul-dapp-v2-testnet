import React, { useState, useEffect, useRef } from "react";
import "./Accordion.css";
import Chevron from "../../assets/chevron.svg";
import ghoulLogo from "../../assets/ghoul_logo.svg";
import daiLogo from "../../assets/dai_logo.svg";

export default function Accordion(props) {
  const [toggle, setToggle] = useState(false);
  const [heightEl, setHeightEl] = useState();

  const refHeight = useRef();

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
    <div className="accordion">
      <button onClick={toggleState} className="accordion-visible">
        <div className="accordion-title-container">
          <img src={img} alt="" />
          <div id="accordion-title">{asset}</div>
        </div>
        <div className="accordion-content">
          <div id="earned">
            <div className="accordion-top-text">EARNED</div>
            <div className="accordion-bottom-text">{props.earned} GhoulX</div>
          </div>
          <div id="staked">
            <div className="accordion-top-text">STAKED</div>
            <div className="accordion-bottom-text">
              {props.staked} {asset}
            </div>
          </div>
          <div id="deposit-fee">
            <div className="accordion-top-text">DEPOSIT FEE</div>
            <div className="accordion-bottom-text">{props.depositFee}%</div>
          </div>
          <div id="pool-allocation">
            <div className="accordion-top-text">POOL ALLOCATION</div>
            <div className="accordion-bottom-text">{props.poolAllocation}%</div>
          </div>
        </div>
        <img className={toggle && "active"} src={Chevron} />
      </button>
      <div
        className={toggle ? "accordion-toggle animated" : "accordion-toggle"}
        style={{ height: toggle ? `${heightEl}` : "0px" }}
        ref={refHeight}
      >
        <div
          aria-hidden={toggle ? "true" : "false"}
          className="accordion-elem-container"
        >
          <div className="accordion-elem-1">
            <div className="accordion-elem-col-1">
              <img src={ghoulLogo} alt="" id="ghoul-img" />
              <div>
                <div className="accordion-top-text">PENDING REWARDS</div>
                <div className="accordion-bottom-text">{props.earned}</div>
              </div>
            </div>
            <div className="harvest-container">
              <div className="harvest" onClick={harvestHandler}>
                Harvest
              </div>
            </div>
          </div>
          <div className="accordion-elem-2">
            <div className="accordion-elem-col-1">
              <img src={ghoulLogo} alt="" id="ghoul-img" />
              <div>
                <div className="accordion-top-text">
                  {asset} BALANCE <span id="get-more">Get more</span>
                </div>
                <div className="accordion-bottom-text">{props.lpBalance}</div>
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
