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
    reducers:{
        set: (state, action: PayloadAction<string>)=>{
            state.username = action.payload;
        },
        setID: (state, action: PayloadAction<string>)=>{
            state.id = action.payload;
        },
        clear: (state) => {
            state.username = null;
        }
    }
}) 





export const { set, setID, clear } = authSlice.actions;
export default authSlice.reducer;



{/*
    
    import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer















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

















    */}