import {createSlice} from "@reduxjs/toolkit";
import {BoardMenuSliceType} from "types/BoardMenuSliceType.ts";

const initialState: BoardMenuSliceType = {
    opened: false,
    openedBoardCreate:false,
    openedBoardInfo: false,
    activeId: null,
    openedDeleteConfirmation: false,
    statusChangeOpened: false
}

export const boardMenuSlice = createSlice({
    name: "boardMenu",
    initialState,
    reducers: {
        changeOpened: (state) => {
            state.opened = !state.opened;
        },
        setMenuClosed: (state) => {
            state.opened = false;
        },
        setOpenBoardCreate:(state) => {
            state.openedBoardCreate = true;
        },
        setCloseBoardCreate:(state) => {
            state.openedBoardCreate = false;
        },
        setBoardInfo: (state, action) => {
            state.openedBoardInfo = action.payload;
        },

        setActiveId: (state, action) => {
            state.activeId = action.payload;
        },
        setDeleteConfirmation: (state, action) => {
            state.openedDeleteConfirmation = action.payload
        },
        setStatus: (state, action) => {
            state.statusChangeOpened = action.payload
        }

    }
})

export const {
    changeOpened,
    setMenuClosed,
    setCloseBoardCreate,
    setActiveId,
    setOpenBoardCreate,
    setBoardInfo,
    setDeleteConfirmation,
    setStatus
} = boardMenuSlice.actions;

export const boardMenuReducer = boardMenuSlice.reducer;
