import { createSlice } from "@reduxjs/toolkit"

const initialAdminState = {
    data: [
        {'name': '홍길동', 'date': '2024-07-10', 'time': '13:01:34'},
        {'name': '홍길동', 'date': '2024-07-10', 'time': '13:01:34'},
        {'name': '홍길동', 'date': '2024-07-10', 'time': '13:01:34'},
        {'name': '홍길동', 'date': '2024-07-10', 'time': '13:01:34'},
        {'name': '홍길동', 'date': '2024-07-10', 'time': '13:01:34'},
        {'name': '홍길동', 'date': '2024-07-10', 'time': '13:01:34'},
        {'name': '홍길동', 'date': '2024-07-10', 'time': '13:01:34'},
    ]
}

const adminSlice = createSlice({
    name: 'admin',
    initialState: initialAdminState,
    reducers: {}
})

export const adminAction = adminSlice.reducer
export default adminSlice.reducer