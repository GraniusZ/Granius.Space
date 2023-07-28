import {NetworkSliceType} from "types/NetworkSliceType.ts";
import {createSlice} from "@reduxjs/toolkit";


const initialState: NetworkSliceType = {
    online: true,
}
export const networkSlice = createSlice({
    name: "network",
    initialState,
    reducers: {
        setOnline: (state, action) => {
            state.online = action.payload
        }
    }
})
export const {setOnline} = networkSlice.actions;

export const networkReducer = networkSlice.reducer;