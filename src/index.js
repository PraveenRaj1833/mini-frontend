import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import history from "./utils/history";
import {ConnectedRouter} from 'connected-react-router'
import {Provider} from 'react-redux'
import configureStore from './configureStore';


const initial_state={};
const store=configureStore(initial_state,history);

ReactDOM.render(
<Provider store={store}>
  <React.StrictMode>
    <ConnectedRouter history={history}>
    <App  history={history}/>
    </ConnectedRouter>
  </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
