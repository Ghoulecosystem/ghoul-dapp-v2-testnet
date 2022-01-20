import React from "react";

const Web3Context = React.createContext({
  walletAddress: "",
  provider: "",
  signer: "",
  daiContract: "",
  swapContract: "",
  goulContract: "",
  tokenContract: "",
  farmContract: "",
  wethVaultContract: "",
  wethContract: "",
  goulXContract: "",
  liquidatorContract: "",
  busdSwapContract: "",
  usdcSwapContract: "",
  usdtSwapContract: "",
  busdTokenContract: "",
  usdtTokenContract: "",
  connectWallet: () => {},
  checkIfWalletConnected: () => {},
  manualConnect: () => {},
  disconnect: () => {},
  chainId: "",
});

export default Web3Context;
