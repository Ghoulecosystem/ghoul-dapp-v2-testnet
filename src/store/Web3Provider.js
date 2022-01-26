import Web3Context from "./Web3-context";
import React, { useReducer, useState } from "react";
import * as contracts from "../utils/contract_abis_mainnet";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Web3 from "web3";
import { providers } from "ethers";
const { ethers } = require("ethers");

const bsc = {
  chainId: `0x${Number(56).toString(16)}`,
  chainName: "Binance Smart Chain Mainnet",
  nativeCurrency: {
    name: "Binance Chain Native Token",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: [
    "https://bsc-dataseed1.binance.org",
    "https://bsc-dataseed2.binance.org",
    "https://bsc-dataseed3.binance.org",
    "https://bsc-dataseed4.binance.org",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed2.defibit.io",
    "https://bsc-dataseed3.defibit.io",
    "https://bsc-dataseed4.defibit.io",
    "https://bsc-dataseed1.ninicoin.io",
    "https://bsc-dataseed2.ninicoin.io",
    "https://bsc-dataseed3.ninicoin.io",
    "https://bsc-dataseed4.ninicoin.io",
    "wss://bsc-ws-node.nariox.org",
  ],
  blockExplorerUrls: ["https://bscscan.com"],
};

const defaultWeb3State = {
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
  chainId: "",
};

const web3Reducer = (state, action) => {
  if (action.type === "WALLET_CONNECT") {
    const walletAddress = action.walletAddress;
    const provider = action.provider;
    const signer = action.signer;
    const ethersContracts = action.contracts;
    const chainId = parseInt(action.chainId);
    return {
      walletAddress: walletAddress,
      provider: provider,
      signer: signer,
      daiContract: ethersContracts.daiContract,
      swapContract: ethersContracts.swapContract,
      ghoulContract: ethersContracts.ghoulContract,
      tokenContract: ethersContracts.tokenContract,
      farmContract: ethersContracts.farmContract,
      wethVaultContract: ethersContracts.wethVaultContract,
      wethContract: ethersContracts.wethContract,
      ghoulXContract: ethersContracts.ghoulXContract, ///"ethersContracts.ghoulXContract",
      liquidatorContract: ethersContracts.liquidatorContract,
      busdSwapContract: ethersContracts.busdSwapContract,
      usdcSwapContract: ethersContracts.usdcSwapContract,
      usdtSwapContract: ethersContracts.usdtSwapContract,
      busdTokenContract: ethersContracts.busdTokenContract,
      usdtTokenContract: ethersContracts.usdtTokenContract,
      usdcTokenContract: ethersContracts.usdcTokenContract,
      chainId: chainId,
    };
  }

  if (action.type === "WALLET_DISCONNECT") {
    return {
      walletAddress: null,
      provider: null,
      signer: null,
      daiContract: null,
      swapContract: null,
      ghoulContract: null,
      tokenContract: null,
      farmContract: null,
      wethVaultContract: null,
      wethContract: null,
      ghoulXContract: null, ///"ethersContracts.ghoulXContract",
      liquidatorContract: null,
      busdSwapContract: null,
      usdcSwapContract: null,
      usdtSwapContract: null,
      busdTokenContract: null,
      usdtTokenContract: null,
      chainId: null,
    };
  }

  if (action.type === "CHAIN_SWITCH") {
    console.log("CHAIN_SWITCH");
    const chainId = action.chainId;
    return {
      ...state,
      chainId: chainId,
    };
  }

  return defaultWeb3State;
};

const Web3Provider = (props) => {
  const [web3State, dispatchWeb3Action] = useReducer(
    web3Reducer,
    defaultWeb3State
  );
  const [validChain, setIsValidChain] = useState(false);

  const changeNetwork = async ({ networkName, setError }) => {
    console.log("Attempting to change network");
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...bsc,
          },
        ],
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const instantiateContracts = (signer) => {
    const ghoulXContract = new ethers.Contract(
      contracts.ghoulxAddress,
      contracts.ghoulXAbi,
      signer
    );
    const daiContract = new ethers.Contract(
      contracts.daiAddress,
      contracts.daiAbi,
      signer
    );
    const swapContract = new ethers.Contract(
      contracts.swapAddress,
      contracts.swapAbi,
      signer
    );
    const ghoulContract = new ethers.Contract(
      contracts.ghoulAddress,
      contracts.ghoulAbi,
      signer
    );
    const tokenContract = new ethers.Contract(
      contracts.tokenAddress,
      contracts.tokenAbi,
      signer
    );
    const farmContract = new ethers.Contract(
      contracts.farmAddress,
      contracts.farmAbi,
      signer
    );
    const wethVaultContract = new ethers.Contract(
      contracts.wethVaultAddress,
      contracts.wethVaultAbi,
      signer
    );
    const wethContract = new ethers.Contract(
      contracts.wethAddress,
      contracts.ghoulAbi,
      signer
    );
    const liquidator = new ethers.Contract(
      contracts.liquidatorAddress,
      contracts.liquidatorAbi,
      signer
    );
    const busdSwap = new ethers.Contract(
      contracts.busdSwapAddress,
      contracts.busdAbi,
      signer
    );
    const usdcSwap = new ethers.Contract(
      contracts.usdcSwapAddress,
      contracts.usdcAbi,
      signer
    );
    const usdtSwap = new ethers.Contract(
      contracts.usdtSwapAddress,
      contracts.usdtAbi,
      signer
    );
    const busdTokenContract = new ethers.Contract(
      contracts.busdTokenAddress,
      contracts.busdTokenAbi,
      signer
    );
    const usdtTokenContract = new ethers.Contract(
      contracts.usdtTokenAddress,
      contracts.usdtTokenAbi,
      signer
    );
    const usdcTokenContract = new ethers.Contract(
      contracts.usdcTokenAddress,
      contracts.usdcTokenAbi,
      signer
    );

    return {
      daiContract: daiContract,
      swapContract: swapContract,
      ghoulContract: ghoulContract,
      tokenContract: tokenContract,
      farmContract: farmContract,
      wethVaultContract: wethVaultContract,
      wethContract: wethContract,
      ghoulXContract: ghoulXContract,
      liquidatorContract: liquidator,
      busdSwapContract: busdSwap,
      usdcSwapContract: usdcSwap,
      usdtSwapContract: usdtSwap,
      busdTokenContract: busdTokenContract,
      usdtTokenContract: usdtTokenContract,
      usdcTokenContract: usdcTokenContract,
    };
  };

  const manualConnectHandler = async () => {
    try {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            // Mikko's test key - don't copy as your mileage may vary
            infuraId: "d2ae878adfc8418fb4f4d73eefa31332",
          },
        },
      };

      const { ethereum } = window;

      const web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
        theme: {
          background: "rgb(39, 49, 56)",
          main: "rgb(199, 199, 199)",
          secondary: "rgb(136, 136, 136)",
          border: "rgba(195, 195, 195, 0.14)",
          hover: "rgb(16, 26, 32)",
        },
      });

      const provider = await web3Modal.connect();
      // Get a Web3 instance for the wallet
      const web3 = new Web3(provider);
      // Get list of accounts of the connected wallet
      const accounts = await web3.eth.getAccounts();

      const providerEthers = new ethers.providers.Web3Provider(ethereum); // Allows for interaction with ethereum nodes - read/write
      const signer = providerEthers.getSigner(); // Abstraction of the Ethereum Account which can be used to sign messages and transactions and send signed transactions

      // Subscribe to accounts change
      provider.on("accountsChanged", (accounts) => {
        console.log(accounts);
      });

      // Subscribe to networkId change
      provider.on("networkChanged", (networkId) => {
        console.log(networkId);
        dispatchWeb3Action({
          type: "CHAIN_SWITCH",
          chainId: parseInt(networkId),
        });
      });

      dispatchWeb3Action({
        type: "WALLET_CONNECT",
        walletAddress: accounts[0],
        provider: providerEthers,
        signer: signer,
        contracts: instantiateContracts(signer),
        chainId: window.ethereum.networkVersion,
      });
      // const web3Provider = new providers.Web3Provider(provider);
      // console.log(web3Provider.getA);

      // console.log(web3Provider.provider.Target);
    } catch (error) {
      console.log(error);
    }
  };

  const connectWalletHandler = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (window.ethereum.networkVersion !== 97) {
        // changeNetwork("bsc");
        console.log("Invalid Chain");
        setIsValidChain(false);
      } else {
        setIsValidChain(true);
      }

      const provider = new ethers.providers.Web3Provider(ethereum); // Allows for interaction with ethereum nodes - read/write
      const signer = provider.getSigner(); // Abstraction of the Ethereum Account which can be used to sign messages and transactions and send signed transactions

      // Subscribe to networkId change
      provider.on("networkChanged", (networkId) => {
        console.log(networkId);
        dispatchWeb3Action({
          type: "CHAIN_SWITCH",
          chainId: parseInt(networkId),
        });
      });

      dispatchWeb3Action({
        type: "WALLET_CONNECT",
        walletAddress: accounts[0],
        provider: provider,
        signer: signer,
        contracts: instantiateContracts(signer),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnectedHandler = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        return;
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      // if (window.ethereum.networkVersion !== 97) {
      //   // changeNetwork("bsc");
      //   setIsValidChain(false);
      // } else {
      //   setIsValidChain(true);
      // }
      if (accounts.length !== 0) {
        const provider = new ethers.providers.Web3Provider(ethereum); // Allows for interaction with ethereum nodes - read/write
        const signer = provider.getSigner(); // Abstraction of the Ethereum Account which can be used to sign messages and transactions and send signed transactions

        // Subscribe to networkId change
        provider.on("networkChanged", (networkId) => {
          dispatchWeb3Action({
            type: "CHAIN_SWITCH",
            chainId: parseInt(networkId),
          });
        });

        dispatchWeb3Action({
          type: "WALLET_CONNECT",
          walletAddress: accounts[0],
          provider: provider,
          signer: signer,
          contracts: instantiateContracts(signer),
          chainId: window.ethereum.networkVersion,
        });
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectHandler = async () => {
    if (web3State.provider.close) {
      await web3State.provider.close();
    }

    // web3Modal.clearCachedProvider();

    dispatchWeb3Action({
      type: "WALLET_DISCONNECT",
    });
  };

  const web3Context = {
    walletAddress: web3State.walletAddress,
    provider: web3State.provider,
    signer: web3State.signer,
    daiContract: web3State.daiContract,
    swapContract: web3State.swapContract,
    ghoulContract: web3State.ghoulContract,
    tokenContract: web3State.tokenContract,
    farmContract: web3State.farmContract,
    wethVaultContract: web3State.wethVaultContract,
    wethContract: web3State.wethContract,
    ghoulXContract: web3State.ghoulXContract,
    liquidatorContract: web3State.liquidatorContract,
    busdSwapContract: web3State.busdSwapContract,
    usdcSwapContract: web3State.usdcSwapContract,
    usdtSwapContract: web3State.usdtSwapContract,
    busdTokenContract: web3State.busdTokenContract,
    usdtTokenContract: web3State.usdtTokenContract,
    usdcTokenContract: web3State.usdcTokenContract,
    connectWallet: connectWalletHandler,
    checkIfWalletConnected: checkIfWalletIsConnectedHandler,
    manualConnect: manualConnectHandler,
    disconnect: disconnectHandler,
    chainId: web3State.chainId,
  };

  return (
    <Web3Context.Provider value={web3Context}>
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
