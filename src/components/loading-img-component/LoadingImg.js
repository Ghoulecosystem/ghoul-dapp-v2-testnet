import React from "react";
import classes from "./LoadingImg.module.css";
import gdaiLogo from "../../assets/gdai_logo_final.svg";

const LoadingImg = (props) => {
  return (
    <img
      src={gdaiLogo}
      className={classes["loading-img"]}
      height={props.height}
      width={props.width}
      alt="loading"
    ></img>
  );
};

export default LoadingImg;
