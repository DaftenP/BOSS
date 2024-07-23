import { configureStore } from '@reduxjs/toolkit'

import loginReducer from './login'

const store = configureStore({
    reducer: { login: loginReducer }
})

export default store