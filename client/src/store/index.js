import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './login';
import navigationReducer from './navigation';
import loglistReducer from './loglist';
import monitoringReducer from './monitoring';

const store = configureStore({
  reducer: {
    login: loginReducer,
    navigation: navigationReducer,
    loglist: loglistReducer,
    monitoring: monitoringReducer,
  },
});

export default store;
