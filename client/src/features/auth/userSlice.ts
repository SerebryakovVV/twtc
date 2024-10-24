import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


type initialStateType = {
    name:string | null,
    id:string | null
}

const initialState: initialStateType = {
    name:null,
    id:null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload
        },
        setId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        }
    }
})