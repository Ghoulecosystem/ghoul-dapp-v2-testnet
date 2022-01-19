import React, { Fragment, useContext } from "react";
import classes from "./Layout.module.css";
import ThemeContext from "../../store/Theme-context";

const Layout = (props) => {
  const themeCtx = useContext(ThemeContext);

  let bgColor;
  if (!themeCtx.darkMode) {
    bgColor = "#FFFFFF";
  }

  return (
    <Fragment>
      <main
        className={classes.main}
        style={{ background: !themeCtx.darkMode ? bgColor : undefined }}
      >
        {props.children}
      </main>
    </Fragment>
  );
};

export default Layout;
