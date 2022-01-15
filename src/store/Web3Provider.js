import Web3Context from "./Web3-context";
import React, { useReducer } from "react";
import * as contracts from "../utils/contract_test_abis_repo";
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
};

const web3Reducer = (state, action) => {
  if (action.type === "WALLET_CONNECT") {
    console.log("Wallet Connect ACTION");

    const walletAddress = action.walletAddress;
    const provider = action.provider;
    const signer = action.signer;
    const ethersContracts = action.contracts;
    console.log(ethersContracts.tokenContract);
    return {
      walletAddress: walletAddress,
      provider: provider,
      signer: signer,
      daiContract: ethersContracts.daiContract,
      swapContract: ethersContracts.swapContract,
      goulContract: ethersContracts.goulContract,
      tokenContract: ethersContracts.tokenContract,
      farmContract: ethersContracts.farmContract,
      wethVaultContract: ethersContracts.wethVaultContract,
      wethContract: ethersContracts.wethContract,
      goulXContract: "", ///"ethersContracts.goulXContract",
      liquidatorContract: ethersContracts.liquidatorContract,
      busdSwapContract: ethersContracts.busdSwapContract,
      usdcSwapContract: ethersContracts.usdcSwapContract,
      usdtSwapContract: ethersContracts.usdtSwapContract,
      busdTokenContract: ethersContracts.busdTokenContract,
      usdtTokenContract: ethersContracts.usdtTokenContract,
    };
  }

  return defaultWeb3State;
};

const Web3Provider = (props) => {
  const [web3State, dispatchWeb3Action] = useReducer(
    web3Reducer,
    defaultWeb3State
  );

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
    const goulContract = new ethers.Contract(
      contracts.guolAddress,
      contracts.guolAbi,
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
      contracts.guolAbi,
      signer
    );
    const goulXContract = new ethers.Contract(
      contracts.ghoulxAddress,
      contracts.guolAbi,
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

    return {
      daiContract: daiContract,
      swapContract: swapContract,
      goulContract: goulContract,
      tokenContract: tokenContract,
      farmContract: farmContract,
      wethVaultContract: wethVaultContract,
      wethContract: wethContract,
      goulXContract: goulXContract,
      liquidatorContract: liquidator,
      busdSwapContract: busdSwap,
      usdcSwapContract: usdcSwap,
      usdtSwapContract: usdtSwap,
      busdTokenContract: busdTokenContract,
      usdtTokenContract: usdtTokenContract,
    };
  };

  const manualConnectHandler = async () => {
    try {
      const { ethereum } = window;
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            // Mikko's test key - don't copy as your mileage may vary
            infuraId: "d2ae878adfc8418fb4f4d73eefa31332",
          },
        },
      };

      const web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
      });

      const provider = await web3Modal.connect();
      // Get a Web3 instance for the wallet
      const web3 = new Web3(provider);
      // Get list of accounts of the connected wallet
      const accounts = await web3.eth.getAccounts();

      const providerEthers = new ethers.providers.Web3Provider(ethereum); // Allows for interaction with ethereum nodes - read/write
      const signer = providerEthers.getSigner(); // Abstraction of the Ethereum Account which can be used to sign messages and transactions and send signed transactions

      dispatchWeb3Action({
        type: "WALLET_CONNECT",
        walletAddress: accounts[0],
        provider: providerEthers,
        signer: signer,
        contracts: instantiateContracts(signer),
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

      // if (window.ethereum.networkVersion !== 56) {
      //   changeNetwork("bsc");
      // }

      const provider = new ethers.providers.Web3Provider(ethereum); // Allows for interaction with ethereum nodes - read/write
      const signer = provider.getSigner(); // Abstraction of the Ethereum Account which can be used to sign messages and transactions and send signed transactions

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

      // if (window.ethereum.networkVersion !== 56) {
      //   changeNetwork("bsc");
      // }

      if (accounts.length !== 0) {
        const provider = new ethers.providers.Web3Provider(ethereum); // Allows for interaction with ethereum nodes - read/write
        const signer = provider.getSigner(); // Abstraction of the Ethereum Account which can be used to sign messages and transactions and send signed transactions

        dispatchWeb3Action({
          type: "WALLET_CONNECT",
          walletAddress: accounts[0],
          provider: provider,
          signer: signer,
          contracts: instantiateContracts(signer),
        });
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const web3Context = {
    walletAddress: web3State.walletAddress,
    provider: web3State.provider,
    signer: web3State.signer,
    daiContract: web3State.daiContract,
    swapContract: web3State.swapContract,
    goulContract: web3State.goulContract,
    tokenContract: web3State.tokenContract,
    farmContract: web3State.farmContract,
    wethVaultContract: web3State.wethVaultContract,
    wethContract: web3State.wethContract,
    goulXContract: web3State.goulXContract,
    liquidatorContract: web3State.liquidatorContract,
    busdSwapContract: web3State.busdSwapContract,
    usdcSwapContract: web3State.usdcSwapContract,
    usdtSwapContract: web3State.usdtSwapContract,
    busdTokenContract: web3State.busdTokenContract,
    usdtTokenContract: web3State.usdtTokenContract,
    connectWallet: connectWalletHandler,
    checkIfWalletConnected: checkIfWalletIsConnectedHandler,
    manualConnect: manualConnectHandler,
  };

  return (
    <Web3Context.Provider value={web3Context}>
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
