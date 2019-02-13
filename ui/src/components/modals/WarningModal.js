import React from 'react';

import globals from 'utils/globals';
import isIE from 'utils/isIE';

export default ({ modalState }) => (
  <>
    <h1>Welcome to the HCMI Searchable Catalog</h1>
    <div className="modal-body">
      {isIE() && (
        <p className="ie-warning">
          You are currently using Internet Explorer which is not on our list of supported browsers.
          We recommend using Microsoft Edge, Google Chrome or Mozilla Firefox.
        </p>
      )}
      <p>
        This message provides privacy and security notices consistent with applicable federal laws,
        directives, and other federal guidance for accessing this Government system, which includes:
      </p>
      <ul className="red-bullets">
        <li>this computer network,</li>
        <li>all computers connected to this network, and</li>
        <li>
          all devices and storage media attached to this network or to a computer on this network.
        </li>
      </ul>
      <p>
        This system is provided for Government-authorized use only. Unauthorized or improper use of
        this system is prohibited and may result in disciplinary action and/or civil and criminal
        penalties. Personal use of social media and networking sites on this system is limited as to
        not interfere with official work duties and is subject to monitoring. By using this system,
        you understand and consent to the following:
      </p>
      <ul className="checkmark-bullets">
        <li>
          The Government may monitor, record, and audit your system usage, including usage of
          personal devices and email systems for official duties or to conduct HHS business.
          Therefore, you have no reasonable expectation of privacy regarding any communication or
          data transiting or stored on this system. At any time, and for any lawful Government
          purpose, the government may monitor, intercept, and search and seize any communication or
          data transiting or stored on this system.
        </li>
        <li>
          Any communication or data transiting or stored on this system may be disclosed or used for
          any lawful Government purpose.
        </li>
      </ul>
      <div className="modal-footer">
        <button
          onClick={() => {
            modalState.setModalState({ component: null });
            localStorage.setItem(globals.SEEN_WARNING_KEY, true);
          }}
        >
          Accept
        </button>
      </div>
    </div>
  </>
);
