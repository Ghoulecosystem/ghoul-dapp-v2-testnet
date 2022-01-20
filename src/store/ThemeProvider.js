import React, { useState } from "react";
import ThemeContext from "./Theme-context";

const ThemeProvider = (props) => {
  const [darkMode, isDarkMode] = useState(true);
  const [hamburger, isHamburger] = useState(false);

  const ToggleDarkMode = () => {
    isDarkMode(!darkMode);
  };

  const toggleHamburger = () => {
    isHamburger(!hamburger);
  };

  const themeContext = {
    toggleDarkMode: ToggleDarkMode,
    darkMode: darkMode,
    hamburgerToggled: hamburger,
    toggleHamburger: toggleHamburger,
  };

  return (
    <ThemeContext.Provider value={themeContext}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
