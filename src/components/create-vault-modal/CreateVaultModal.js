import React, { useState, useEffect, useContext } from "react";
import classes from "./CreateVaultModal.module.css";
import cancelIcon from "../../assets/cancel.svg";
import bscLogo from "../../assets/bsc_logo.png";
import wethLogo from "../../assets/wEth_logo.svg";
import Web3Context from "../../store/Web3-context";
import LoadingImg from "../../components/loading-img-component/LoadingImg";

const CreateVaultModal = (props) => {
  const web3Ctx = useContext(Web3Context);
  const walletAddress = web3Ctx.walletAddress;
  const [isLoading, setIsLoading] = useState(false);
  const [isBNBVaultCreate, setIsBNBVaultCreate] = useState(true);

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
          <div>Create Vault</div>
          <button onClick={onCloseModalHandler}>
            <img src={cancelIcon} alt="" />
          </button>
        </div>
        <div id={classes.line}></div>
        <div className={classes["col-titles"]}>
          <div className={classes["col-one"]}>TYPE</div>
          <div className={classes["col-two"]}>
            <div>GDAI AVAILABLE</div>
            <div>MIN COL. RATIO</div>
          </div>
        </div>
        <div className={classes["vault-container"]}>
          <div className={classes.vault}>
            <div className={classes["vault-elem"]}>
              <img src={bscLogo} alt="" />
              <div>
                <span id={classes["mobile-s-1"]}>Type</span>
                <div>BNB</div>
              </div>
            </div>
            <div id={classes["gdai-avai-1"]}>
              <span id={classes["mobile-s-2"]}>GDAI AVAILABLE</span>
              <div>{props.gdaiBNB} gDai</div>
            </div>
            <div id={classes["min-col-ratio-1"]}>
              <span id={classes["mobile-s-2"]}>MIN COL. RATIO</span>
              <div>150%</div>
            </div>
            <div className={classes["create-vault"]} onClick={createBNBVault}>
              Create Vault
            </div>
          </div>
          <div className={classes.vault}>
            <div className={classes["vault-elem-2"]}>
              <img src={wethLogo} alt="" />
              <div>
                <span id={classes["mobile-s-2"]}>Type</span>
                <div>wETH</div>
              </div>
            </div>
            <div id={classes["gdai-avai-2"]}>
              <span id={classes["mobile-s-2"]}>GDAI AVAILABLE</span>
              <div>{props.gdaiWeth} gDai</div>
            </div>
            <div id={classes["min-col-ratio-2"]}>
              <span id={classes["mobile-s-2"]}>MIN COL. RATIO</span>
              <div>150%</div>
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
    <div className={classes["create-vault-modal-container"]}>
      {isLoading ? <LoadingImg /> : renderContent()}
    </div>
  );
};

export default CreateVaultModal;
