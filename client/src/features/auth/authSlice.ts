import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


type initialStateType = {
    jwt: string | null,
    id: string | null,
    username: string | null
}

const initialState: initialStateType = {
    jwt: null,
    id: null,
    username: null
}

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers: {
        setUsernameRedux: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        setIdRedux: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setJwtRedux: (state, action: PayloadAction<string>) => {
            state.jwt = action.payload;
        }
    }
}) 


export const { setUsernameRedux, setIdRedux, setJwtRedux } = authSlice.actions;
export default authSlice.reducer;