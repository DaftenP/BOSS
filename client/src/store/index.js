import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import loginReducer from './login';
import navigationReducer from './navigation';
import managementReducer from './management';
import adminReducer from './admin';
import loglistReducer from './loglist';
import monitoringReducer from './monitoring';
import themeReducer from './theme';
import languageReducer from './language';
import departmentReducer from './department';
import positionReducer from './position'

// persist configuration for login reducer
const loginPersistConfig = {
  key: 'login',
  storage,
};

const persistedLoginReducer = persistReducer(loginPersistConfig, loginReducer);

const store = configureStore({
  reducer: {
    login: persistedLoginReducer,
    navigation: navigationReducer,
    management: managementReducer,
    admin: adminReducer,
    loglist: loglistReducer,
    monitoring: monitoringReducer,
    theme: themeReducer,
    language: languageReducer,
    department: departmentReducer,
    position: positionReducer
  },
  // serializableCheck 옵션을 구성하여 redux-persist 의 액션을 무시하는 설정
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
      ignoredPaths: ['register', 'rehydrate'],
    },
  }),
});

const persistor = persistStore(store);

export { store, persistor };
