import React from "react";

const ThemeContext = React.createContext({
  toggleDarkMode: () => {},
  darkMode: true,
  hamburgerToggled: false,
  balanceUpdate: false,
  toggleHamburger: () => {},
  toggleHamburgerFalse: () => {},
  toggleBalance: () => {},
  toggleBalanceFalse: () => {},
});

export default ThemeContext;
