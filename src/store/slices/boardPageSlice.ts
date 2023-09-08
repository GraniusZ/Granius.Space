import {BoardPageSliceType} from "types/BoardPageSliceType.ts";
import {createSlice} from "@reduxjs/toolkit";

const initialState: BoardPageSliceType = {
    titleChange: false,
    titleColumnChange: false,
    sideMenu: false,
    addColumn:false,
    columnSettings:false,
    activeColumn:{},
    addTask:false,
    activeTask: {},
    taskInfo: false,
    taskInfoContentId: '',
    titleTaskChange: false

}
export const boardPageSlice = createSlice({
    name: "boardPage",
    initialState,
    reducers: {
        setTitleInput: (state, action) => {
            state.titleChange = action.payload
        },
        setColumnTitleInput: (state, action) => {
            state.titleColumnChange = action.payload
        },
        setSideMenu: (state, action) => {
            state.sideMenu = action.payload
        },
        setAddColumn:(state, action) => {
            state.addColumn = action.payload
        },
        setColumnSettings:(state, action) => {
            state.columnSettings = action.payload
        },
        setActiveColumn:(state, action) => {
            state.activeColumn = action.payload
        },
        setAddTask:(state, action) => {
            state.addTask= action.payload
        },
        setActiveTask:(state, action) => {
            state.activeTask= action.payload
        },
        setTaskInfo: (state, action) => {
            state.taskInfo = action.payload
        },
        setTaskInfoContent: (state, action) => {
            state.taskInfoContentId = action.payload
        },
        setTitleTaskChange: (state, action) => {
            state.titleTaskChange = action.payload
        },


    }
})

export const {setTitleInput, setSideMenu, setAddColumn, setColumnSettings, setActiveColumn, setAddTask, setColumnTitleInput, setActiveTask, setTaskInfo, setTaskInfoContent, setTitleTaskChange} = boardPageSlice.actions;

export const boardPageReducer = boardPageSlice.reducer;
