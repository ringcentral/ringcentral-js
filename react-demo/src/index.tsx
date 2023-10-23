import React from 'react';
import {render} from 'react-dom';
import Router from './Router';

render(<Router />, document.getElementById('app'));

if (module.hot) {module.hot.accept();}
