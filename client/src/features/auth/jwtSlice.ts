import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


type initialStateType = {
    value: string | null
}

const initialState: initialStateType = {value: null}

export const jwtSlice = createSlice({
    name:"jwt",
    initialState,
    reducers:{
        set: (state, action: PayloadAction<string>)=>{
            state.value = action.payload;
        },
        clear: (state) => {
            state.value = null;
        }
    }
}) 
