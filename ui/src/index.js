import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment-timezone';
import './index.css';
import App from './components/App';

// Set global timezone to UTC
moment.tz.setDefault('UTC');

// Render app
ReactDOM.render(<App />, document.getElementById('root'));
