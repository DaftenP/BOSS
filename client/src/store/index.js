import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './login';
import navigationReducer from './navigation';
import managementReducer from './management';
import adminReducer from './admin';


const store = configureStore({
  reducer: {
    login: loginReducer,
    navigation: navigationReducer,
    management: managementReducer,
    admin: adminReducer,
  },
});

export default store;
