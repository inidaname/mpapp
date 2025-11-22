import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from "../service/apiSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import authReducer from "./reducers/auth-slice";
import userReducer from "./reducers/user-slice";
import walletsSlice from "./reducers/wallet-slice";
import countriesSlice from "./reducers/countries-slice";
import tempSlice from "./reducers/temporary-slice";
import externalAccounts from "./reducers/external-account-slice";
import menuPopSlice from "./reducers/menu-pop-slice";
import scanWallet from "./reducers/scan-wallet-slice";
import notification from "./reducers/notification-slice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: [apiSlice.reducerPath],
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  user: userReducer,
  wallet: walletsSlice,
  countries: countriesSlice,
  tempSlice,
  externalAccounts,
  memu: menuPopSlice,
  scanWallet,
  notification,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
