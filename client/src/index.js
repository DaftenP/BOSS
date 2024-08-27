import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import App from './App';
import { store, persistor } from './store';
import Modal from 'react-modal';
import './i18n'

import reportWebVitals from './reportWebVitals';

Modal.setAppElement('#root');

const RootComponent = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.style.setProperty('--background-color', '#2a2a30');
    } else {
      document.documentElement.style.setProperty('--background-color', '#EEEEEE');
    }
  }, [isDarkMode]);

  return <App />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootComponent />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
