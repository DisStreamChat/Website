import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { AppContext } from "./contexts/Appcontext"

ReactDOM.render(
  <AppContext.Provider
    value={{
        userId: ""
    }}
  >
      <React.StrictMode>
          <App />
      </React.StrictMode>
  </AppContext.Provider>,
  document.getElementById('root')
);

