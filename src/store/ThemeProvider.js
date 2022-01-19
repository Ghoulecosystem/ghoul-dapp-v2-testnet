import React, { useState } from "react";
import ThemeContext from "./Theme-context";

const ThemeProvider = (props) => {
  const [darkMode, isDarkMode] = useState(true);
  const ToggleDarkMode = () => {
    isDarkMode(!darkMode);
  };

  const themeContext = {
    toggleDarkMode: ToggleDarkMode,
    darkMode: darkMode,
  };

  return (
    <ThemeContext.Provider value={themeContext}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
