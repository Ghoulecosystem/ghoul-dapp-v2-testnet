import React from "react";

const ThemeContext = React.createContext({
  toggleDarkMode: () => {},
  darkMode: true,
  hamburgerToggled: false,
  toggleHamburger: () => {},
  toggleHamburgerFalse: () => {},
});

export default ThemeContext;
