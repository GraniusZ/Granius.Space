import {combineReducers, configureStore, PreloadedState} from "@reduxjs/toolkit";
import {ToolkitStore} from "@reduxjs/toolkit/dist/configureStore";
import {userReducer} from "@store/slices/userSlice.ts";
import {boardMenuReducer} from "@store/slices/boardMenuSlice.ts";


const rootReducer = combineReducers({
    user: userReducer,
    boardMenu: boardMenuReducer
});

export const store :ToolkitStore = configureStore({
    reducer: rootReducer,

});


export const setupStore = (preloadedState:PreloadedState<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,

    });

};

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch