import "./App.css";
import React, { useEffect, useContext, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Vault from "./pages/vault/Vault";
import Layout from "./components/layout/Layout";
import Navbar from "./components/navbar/Navbar";
import Swap from "./pages/swap/Swap";
import Exchange from "./pages/exchange/Exchange";
import Farm from "./pages/farm/Farm";
import Web3Context from "./store/Web3-context";
import ThemeContext from "./store/Theme-context";

function App() {
  const web3Ctx = useContext(Web3Context);
  const themeCtx = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    web3Ctx.checkIfWalletConnected();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let txtColor;
  if (!themeCtx.darkMode) {
    txtColor = "#000000";
  }

  return (
    <Layout>
      {!web3Ctx.walletAddress || web3Ctx.chainId !== 56 ? (
        <div className="disconnected-container">
          <div className="header-img"></div>
          {!web3Ctx.validChain && web3Ctx.walletAddress && (
            <>
              <h1 style={{ color: !themeCtx.darkMode ? txtColor : undefined }}>
                Wrong Network.
              </h1>
              <h1>Please switch to BNB Smart Chain</h1>
            </>
          )}
          {!web3Ctx.walletAddress && <h1>Connect Your Wallet</h1>}
          {!web3Ctx.walletAddress && (
            <div className="connect-wallet-app" onClick={web3Ctx.manualConnect}>
              Connect Wallet
            </div>
          )}
        </div>
      ) : (
        <>
          <Navbar />
          <Switch>
            <Route path="/" exact>
              <Redirect to="/vaults" />
            </Route>
            <Route path="/vaults">
              <Vault />
            </Route>
            <Route path="/swap">
              <Swap />
            </Route>
            <Route path="/farm">
              <Farm />
            </Route>
            <Redirect from="*" to="/" />
          </Switch>
        </>
      )}
    </Layout>
  );
}

export default App;
