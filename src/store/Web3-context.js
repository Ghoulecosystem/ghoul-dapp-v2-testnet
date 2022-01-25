import React from "react";

const Web3Context = React.createContext({
  walletAddress: "",
  provider: "",
  signer: "",
  daiContract: "",
  swapContract: "",
  ghoulContract: "",
  tokenContract: "",
  farmContract: "",
  wethVaultContract: "",
  wethContract: "",
  ghoulXContract: "",
  liquidatorContract: "",
  busdSwapContract: "",
  usdcSwapContract: "",
  usdtSwapContract: "",
  busdTokenContract: "",
  usdtTokenContract: "",
  usdcTokenContract: "",
  connectWallet: () => {},
  checkIfWalletConnected: () => {},
  manualConnect: () => {},
  disconnect: () => {},
  chainId: "",
});

export default Web3Context;
