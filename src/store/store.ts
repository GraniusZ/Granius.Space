import {combineReducers, configureStore, PreloadedState} from "@reduxjs/toolkit";
import {ToolkitStore} from "@reduxjs/toolkit/dist/configureStore";
import {userReducer} from "@store/slices/userSlice.ts";
import {boardMenuReducer} from "@store/slices/boardMenuSlice.ts";
import {setupListeners} from '@reduxjs/toolkit/query/react';
import {boardsApi} from '@/api/boardsApi.ts';
import {networkReducer} from "@store/slices/networkSlice.ts";
import {boardApi} from "@/api/boardApi.ts";
import {boardPageReducer} from "@store/slices/boardPageSlice.ts";

const rootReducer = combineReducers({
    user: userReducer,
    boardMenu: boardMenuReducer,
    network: networkReducer,
    boardPage: boardPageReducer,
    [boardsApi.reducerPath]: boardsApi.reducer,
    [boardApi.reducerPath]: boardApi.reducer
});

export const store: ToolkitStore = configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(boardsApi.middleware, boardApi.middleware),

});


export const setupStore = (preloadedState:PreloadedState<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,

    });

};
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch