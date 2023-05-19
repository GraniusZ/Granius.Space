import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserSliceType} from "types/UserSliceType.ts";
import {User} from "types/UserType.ts"

const initialState: UserSliceType =
    {
        user: null,
        loading: false,
    }

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
        setLoading: (state , action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const {login, logout, setLoading} = userSlice.actions;

export const userReducer = userSlice.reducer;
