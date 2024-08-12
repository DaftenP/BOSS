import React, { useState, useEffect, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { Provider } from 'react-redux';

import Login from './pages/Login/Login';
import Main from './pages/Main/Main';
import Loglist from './pages/Loglist/Loglist';
import Statistics from './pages/Statistics/Statistics';
import Management from './pages/Management/Management';
import EduSsafy from './pages/EduSsafy/EduSsafy';
import EduSsafyLogin from './pages/EduSsafyLogin/EduSsafyLogin';
import Layout from './components/Layout/Layout';


export const SsafyLoginContext = createContext();

function App() {
  const dispatch = useDispatch();
  const [ssafyLogin, setSsafyLogin] = useState(false);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const isLogin = useSelector((state) => state.login.isLogin);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SsafyLoginContext.Provider value={{ ssafyLogin, setSsafyLogin }}>
          <Router>
            <Routes>
              <Route path="/" element={isLogin ? <Navigate to="/main" /> : <Login />} />
              <Route path="/main" element={isLogin ? <Layout><Main /></Layout> : <Navigate to="/" />} />
              <Route path="/loglist" element={isLogin? <Layout><Loglist /></Layout> : <Navigate to="/" />} />
              <Route path="/statistics" element={isLogin? <Layout><Statistics /></Layout> : <Navigate to="/" />} />
              <Route path="/management" element={isLogin? <Layout><Management /></Layout> : <Navigate to="/" />} />
              <Route path="/edussafy" element={isLogin && ssafyLogin? <EduSsafy />: <Navigate to="/edussafylogin" />} />
              <Route path="/edussafylogin" element={isLogin? <EduSsafyLogin />: <Navigate to="/" />} />
              {/* 정의되지 않은 경로로 갈 때 처리 */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </SsafyLoginContext.Provider>
      </PersistGate>
    </Provider>
  );
}

export default App;
