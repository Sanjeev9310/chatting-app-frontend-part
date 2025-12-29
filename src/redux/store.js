import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import { persistStore,persistReducer, PAUSE, PERSIST, PURGE, REGISTER, FLUSH, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage"
// import {persistReducer} from "redux-persist/es/persistReducer";
// import { getDefaultValueType } from "framer-motion";

const persistConfig={
    key:"root",
    storage,
    whitelist:["userDetails"]
}
const persistedReducer=persistReducer(persistConfig,userReducer)

export const store=configureStore({
    reducer:{
        userDetails:persistedReducer,
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        // serializableCheck:{
        //     ignoreActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER],
        // },
        serializableCheck:false,
    }),
});

export const persistor=persistStore(store);
export default store;