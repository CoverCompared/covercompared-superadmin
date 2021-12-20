import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Helmet from 'react-helmet';

import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";

import maTheme from "./theme";
import Routes from "./routes/Routes";
import AxiosInterceptor from "./libs/services/interceptor";
import { CircularProgress } from "@material-ui/core";

function App({ theme }) {
  const [interceptor, setInterceptor] = useState(0);

  useEffect(() => {
    let i = AxiosInterceptor();
    if (i) { setInterceptor(1) }
    return () => { }
  }, [])

  return (
    interceptor ?
      <React.Fragment >
        <Helmet
          titleTemplate="%s | Cover Compared"
          defaultTitle="Cover Compared"
        />
        <StylesProvider injectFirst>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <MuiThemeProvider theme={maTheme[theme.currentTheme]}>
              <ThemeProvider theme={maTheme[theme.currentTheme]}>
                <Routes />
              </ThemeProvider>
            </MuiThemeProvider>
          </MuiPickersUtilsProvider>
        </StylesProvider>
        {
          theme.loader &&
          <div className="circle-loader">
            <CircularProgress color="primary" />
          </div>
        }

      </React.Fragment>
      : <></>
  );
}

export default connect(store => ({ theme: store.themeReducer }))(App);
