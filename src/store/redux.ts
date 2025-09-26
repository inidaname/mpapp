import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from "../service/apiSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import authReducer from "./reducers/auth-slice";
import userReducer from "./reducers/user-slice";
import walletsSlice from "./reducers/wallet-slice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["counter"], // don't persist API cache
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  user: userReducer,
  wallet: walletsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware), // add middleware
});

export const persistor = persistStore(store);

export const useAppDispatch: AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = () => typeof store.dispatch;
