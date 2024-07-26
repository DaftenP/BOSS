import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './login';
import navigationReducer from './navigation';
import loglistReducer from './loglist';

const store = configureStore({
  reducer: {
    login: loginReducer,
    navigation: navigationReducer,
    loglist: loglistReducer,
  },
});

export default store;
