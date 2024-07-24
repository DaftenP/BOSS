import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './login';
import navigationReducer from './navigation';

const store = configureStore({
  reducer: {
    login: loginReducer,
    navigation: navigationReducer,
  },
});

export default store;
