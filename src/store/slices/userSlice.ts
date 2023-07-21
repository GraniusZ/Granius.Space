import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserSliceType} from "types/UserSliceType.ts";
import {User} from "types/UserType.ts"
import {BoardType} from "types/BoardType.ts";

const initialState: UserSliceType =
    {
        user: null,
        loading: false,
        boards: [],
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
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setBoards: (state, action: PayloadAction<BoardType[]>) => {
            state.boards = action.payload;
        },
    },
});

export const {login, logout, setLoading, setBoards} = userSlice.actions;

export const userReducer = userSlice.reducer;
