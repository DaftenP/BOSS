import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './login';
import navigationReducer from './navigation';
import managementReducer from './management'


const store = configureStore({
  reducer: {
    login: loginReducer,
    navigation: navigationReducer,
    management: managementReducer
  },
});

export default store;
