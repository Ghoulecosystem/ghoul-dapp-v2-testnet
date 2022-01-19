import React, { useState, useEffect, useContext } from "react";
import classes from "./CreateVaultModal.module.css";
import cancelIcon from "../../assets/cancel.svg";
import bscLogo from "../../assets/bsc_logo.png";
import wethLogo from "../../assets/wEth_logo.svg";
import Web3Context from "../../store/Web3-context";
import LoadingImg from "../../components/loading-img-component/LoadingImg";
import ThemeContext from "../../store/Theme-context";
import blackCross from "../../assets/fi_x.svg";

const CreateVaultModal = (props) => {
  const web3Ctx = useContext(Web3Context);
  const walletAddress = web3Ctx.walletAddress;
  const [isLoading, setIsLoading] = useState(false);
  const [isBNBVaultCreate, setIsBNBVaultCreate] = useState(true);

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

  const onCloseModalHandler = () => {
    if (isLoading) return;

    props.closeHandler();
  };

  const createBNBVault = async () => {
    setIsLoading(true);
    try {
      const vaultTx = await props.tokenContract.createVault();
      await vaultTx.wait();
    } catch (error) {
      setIsLoading(false);
    }
  };

  const createWethVault = async () => {
    setIsLoading(true);
    try {
      const vaultTx = await props.wethVaultContract.createVault();
      await vaultTx.wait();
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const onNewBNBVault = (id, msgSender) => {
      if (msgSender.toLowerCase() === walletAddress.toLowerCase()) {
        props.closeHandler();
        props.createBNBVault(parseInt(id._hex, 16));
      }
      setIsLoading(false);
    };

    props.tokenContract.on("CreateVault", onNewBNBVault);

    return () => {
      props.tokenContract.off("CreateVault", onNewBNBVault);
    };
  }, []);

  useEffect(() => {
    const onNewWethVault = (id, msgSender) => {
      if (msgSender.toLowerCase() === walletAddress.toLowerCase()) {
        props.closeHandler();
        props.createWethVault(parseInt(id._hex, 16));
      }
      setIsLoading(false);
    };

    props.wethVaultContract.on("CreateVault", onNewWethVault);
    return () => {
      props.wethVaultContract.off("CreateVault", onNewWethVault);
    };
  }, []);

  const renderContent = () => {
    return (
      <>
        <div className={classes["create-vault-modal-header"]}>
          <div style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
            Create Vault
          </div>
          <button onClick={onCloseModalHandler}>
            <img src={imgSrc} alt="" />
          </button>
        </div>
        <div
          id={classes.line}
          style={{ background: !themeCtx.darkMode ? bgColor2 : undefined }}
        ></div>
        <div className={classes["col-titles"]}>
          <div
            className={classes["col-one"]}
            style={{ color: !themeCtx.darkMode ? bgColor2 : undefined }}
          >
            TYPE
          </div>
          <div className={classes["col-two"]}>
            <div style={{ color: !themeCtx.darkMode ? bgColor2 : undefined }}>
              GDAI AVAILABLE
            </div>
            <div style={{ color: !themeCtx.darkMode ? bgColor2 : undefined }}>
              MIN COL. RATIO
            </div>
          </div>
        </div>
        <div className={classes["vault-container"]}>
          <div
            className={classes.vault}
            style={{ background: !themeCtx.darkMode ? bgColorBox : undefined }}
          >
            <div className={classes["vault-elem"]}>
              <img src={bscLogo} alt="" />
              <div>
                <span
                  id={classes["mobile-s-1"]}
                  style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                >
                  Type
                </span>
                <div
                  style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                >
                  BNB
                </div>
              </div>
            </div>
            <div id={classes["gdai-avai-1"]}>
              <span
                id={classes["mobile-s-2"]}
                style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
              >
                GDAI AVAILABLE
              </span>
              <div style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
                {props.gdaiBNB} gDAI
              </div>
            </div>
            <div id={classes["min-col-ratio-1"]}>
              <span
                id={classes["mobile-s-2"]}
                style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
              >
                MIN COL. RATIO
              </span>
              <div style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
                150%
              </div>
            </div>
            <div className={classes["create-vault"]} onClick={createBNBVault}>
              Create Vault
            </div>
          </div>
          <div
            className={classes.vault}
            style={{ background: !themeCtx.darkMode ? bgColorBox : undefined }}
          >
            <div className={classes["vault-elem-2"]}>
              <img src={wethLogo} alt="" />
              <div>
                <span
                  id={classes["mobile-s-2"]}
                  style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                >
                  Type
                </span>
                <div
                  style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
                >
                  wETH
                </div>
              </div>
            </div>
            <div id={classes["gdai-avai-2"]}>
              <span
                id={classes["mobile-s-2"]}
                style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
              >
                GDAI AVAILABLE
              </span>
              <div style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
                {props.gdaiWeth} gDAI
              </div>
            </div>
            <div id={classes["min-col-ratio-2"]}>
              <span
                id={classes["mobile-s-2"]}
                style={{ color: !themeCtx.darkMode ? txtColor : undefined }}
              >
                MIN COL. RATIO
              </span>
              <div style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
                150%
              </div>
            </div>
            <div
              className={classes["create-vault-2"]}
              onClick={createWethVault}
            >
              Create Vault
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div
        className={classes["create-vault-modal-container"]}
        style={{ background: !themeCtx.darkMode ? bgColor : undefined }}
      >
        {isLoading ? <LoadingImg /> : renderContent()}
      </div>
    </>
  );
};

export default CreateVaultModal;
