import React from "react";

const ThemeContext = React.createContext({
  toggleDarkMode: () => {},
  darkMode: true,
});

export default ThemeContext;
