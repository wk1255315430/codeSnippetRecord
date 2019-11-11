// https://reactjs.org/docs/javascript-environment-requirements.html
// React 16 depends on the collection types Map and Set.
// A polyfilled environment for React 16 using core-js to support older browsers
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'raf/polyfill';
import 'es6-shim';

import React from 'react';
import ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
// import StoreClass from './store';
import store from './store';
import App from './App';
import './devices';
import './components/style/base.css';

useStrict(true);
ReactDOM.render(<Provider {...store}>
  <HashRouter>
    <App />
  </HashRouter>
</Provider>, document.getElementById('root'));
