import '@babel/polyfill';
import React from 'react';
import {render} from 'react-dom';
import Router from './Router';
import {storeConnector, createStore} from './lib';

const rootEl = document.getElementById('app');
const store = createStore();

render(<Router store={store} storeConnector={storeConnector} />, rootEl);

if (module.hot) module.hot.accept();
