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

//https://www.figma.com/file/lxY33epqCuVV4X8l5rJYiP/Ghoul-Finance?node-id=0%3A1

function App() {
  const web3Ctx = useContext(Web3Context);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    web3Ctx.checkIfWalletConnected();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
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
        <Route path="/exchange">
          <Exchange />
        </Route>
        <Route path="/farm">
          <Farm />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
