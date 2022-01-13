import React from "react";
import classes from "./LoadingImg.module.css";
import ghoulLogo from "../../assets/ghoul_logo.svg";

const LoadingImg = (props) => {
  return (
    <img
      src={ghoulLogo}
      className={classes["loading-img"]}
      height={props.height}
      width={props.width}
      alt="loading"
    ></img>
  );
};

export default LoadingImg;
