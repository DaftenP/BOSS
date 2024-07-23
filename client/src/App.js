import React from 'react';
import { useSelector } from 'react-redux';

import Login from './components/Login';
import Main from './components/Main';

function App() {
  const isLogin = useSelector((state) => state.login.isLogin)
  return (
    <div>
      {isLogin ? <Main /> : <Login />}
    </div>
  );
}

export default App;
