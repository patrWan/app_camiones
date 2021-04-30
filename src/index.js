import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { SnackbarProvider } from "notistack";
import Grow from '@material-ui/core/Grow';

/** ANT DESIGN IMPORT */
import 'antd/dist/antd.css';

ReactDOM.render(
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      TransitionComponent={Grow}
    >
      <App />
    </SnackbarProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
