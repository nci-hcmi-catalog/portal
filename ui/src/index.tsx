import ReactDOM from 'react-dom';
import moment from 'moment-timezone';
import './index.css';
import App from '~/components/App';

// Set global timezone to UTC
moment.tz.setDefault('UTC');
moment.updateLocale('en', {
  meridiem: (hour, minute, isLowercase) => {
    if (hour >= 12) return isLowercase ? 'p.m.' : 'P.M.';
    else return isLowercase ? 'a.m.' : 'A.M.';
  },
});

ReactDOM.render(<App />, document.getElementById('root'));
