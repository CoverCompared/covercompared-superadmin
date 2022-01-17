import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux';
import store from './redux/store/index';
import { SnackbarProvider } from 'notistack';
import { Slide } from '@material-ui/core';

ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      TransitionComponent={Slide}
      maxSnack={3}
    >
      <App />
    </SnackbarProvider>
  </Provider>, document.getElementById('root'));
