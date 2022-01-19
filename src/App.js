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

function App() {
  const web3Ctx = useContext(Web3Context);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

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
          <Redirect to="/swap" />
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
        <Redirect from="*" to="/" />
      </Switch>
    </Layout>
  );
}

export default App;
