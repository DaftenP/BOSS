import { createStore } from 'redux'
import { createSlice } from '@reduxjs/toolkit'

const initialState = { counter: 0, showCounter: true};

createSlice({
    name: 'counter',
    initialState: initialState,
    reducers: {

    }
})

const store = createStore(counterReducer)

export default store