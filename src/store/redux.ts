import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from "../service/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import NetInfo from "@react-native-community/netinfo";

import authReducer from "./reducers/auth-slice";
import userReducer from "./reducers/user-slice";
import walletsSlice from "./reducers/wallet-slice";
import countriesSlice from "./reducers/countries-slice";
import tempSlice from "./reducers/temporary-slice";
import externalAccounts from "./reducers/external-account-slice";
import menuPopSlice from "./reducers/menu-pop-slice";
import scanWallet from "./reducers/scan-wallet-slice";
import notification from "./reducers/notification-slice";
import USDCWallet from "./reducers/usdc-slice";

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
  USDCWallet,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

setupListeners(store.dispatch, (dispatch, { onOnline }) => {
  // 1. Listen to Network Changes
  const unsubscribe = NetInfo.addEventListener((state) => {
    // If the device goes online, dispatch the onOnline action
    if (state.isConnected) {
      dispatch(
        apiSlice.util.invalidateTags([
          "balance",
          "contacts",
          "external-accounts",
          "transactions",
          "user",
          "wallet",
        ]),
      );
      onOnline();
    }
  });

  // 2. (Optional) Listen to App State (Foreground/Background)
  // You can add AppState listener here too if you want refetch on window focus

  return unsubscribe;
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
