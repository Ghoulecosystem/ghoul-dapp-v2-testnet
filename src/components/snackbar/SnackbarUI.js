import React from "react";
import Button from "@mui/material/Button";
import Slide from "@material-ui/core/Slide";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackbarUI(props) {
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="snackbar-container">
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        className={props.className}
        sx={{ position: "relative" }}
      >
        <Alert
          onClose={handleClose}
          severity={props.error ? "error" : "success"}
          sx={{ width: "100%" }}
          TransitionComponent={Slide}
        >
          {props.error ? "Transaction Failed" : "Transaction Successful"}
        </Alert>
      </Snackbar>
    </div>
  );
}
