import React, { useState } from "react";
import ThemeContext from "./Theme-context";

const ThemeProvider = (props) => {
  const [darkMode, isDarkMode] = useState(true);
  const [hamburger, isHamburger] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);

  const ToggleDarkMode = () => {
    isDarkMode(!darkMode);
  };

  const toggleHamburger = () => {
    isHamburger(true);
  };

  const toggleHamburgerFalse = () => {
    isHamburger(false);
  };

  const toggleBalance = () => {
    setBalanceUpdate(true);
  };

  const toggleBalanceFalse = () => {
    setBalanceUpdate(false);
  };

  const themeContext = {
    toggleDarkMode: ToggleDarkMode,
    darkMode: darkMode,
    hamburgerToggled: hamburger,
    balanceUpdate: balanceUpdate,
    toggleHamburger: toggleHamburger,
    toggleHamburgerFalse: toggleHamburgerFalse,
    toggleBalance: toggleBalance,
    toggleBalanceFalse: toggleBalanceFalse,
  };

  return (
    <ThemeContext.Provider value={themeContext}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
