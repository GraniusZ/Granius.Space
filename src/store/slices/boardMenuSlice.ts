import {createSlice} from "@reduxjs/toolkit";
import {BoardMenuSliceType} from "types/BoardMenuSliceType.ts";

const initialState: BoardMenuSliceType = {
    opened: false,
    openedBoardCreate:false,
    openedDeleteBoard:false,
    deleteId: null,
}

export const boardMenuSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        changeOpened: (state) => {
            state.opened = !state.opened;
        },
        setClosed: (state) => {
            state.opened = false;
        },
        setOpenBoardCreate:(state) => {
            state.openedBoardCreate = true;
        },
        setCloseBoardCreate:(state) => {
            state.openedBoardCreate = false;
        },
        setOpenBoardDelete:(state) => {
            state.openedDeleteBoard = true;
        },
        setCloseBoardDelete:(state) => {
            state.openedDeleteBoard = false;
        },
        setDeleteId:(state,action) => {
            state.deleteId = action.payload;
        },
    }
})

export const {changeOpened, setClosed, setCloseBoardCreate, setDeleteId, setOpenBoardCreate, setOpenBoardDelete, setCloseBoardDelete} = boardMenuSlice.actions;

export const boardMenuReducer = boardMenuSlice.reducer;
