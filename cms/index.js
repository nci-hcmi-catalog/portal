import 'babel-polyfill';
import { config } from 'dotenv';
config();
import register from '@babel/register';
register({
  presets: ['@babel/env'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-object-rest-spread',
  ],
});

import './src/index.js';
