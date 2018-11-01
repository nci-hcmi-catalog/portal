import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment-timezone';
import './index.css';
import App from './components/App';

// Set global timezone to UTC
moment.tz.setDefault('UTC');

if (process.env.NODE_ENV !== 'production') {
  var axe = require('react-axe');
  axe(React, ReactDOM, 1000);
}
// Render app
ReactDOM.render(<App />, document.getElementById('root'));
