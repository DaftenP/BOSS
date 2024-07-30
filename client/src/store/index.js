import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './login';
import navigationReducer from './navigation';
import managementReducer from './management';
import adminReducer from './admin';
import loglistReducer from './loglist';
import monitoringReducer from './monitoring';


const store = configureStore({
  reducer: {
    login: loginReducer,
    navigation: navigationReducer,
    management: managementReducer,
    admin: adminReducer,
    loglist: loglistReducer,
    monitoring: monitoringReducer,
  },
});

export default store;
