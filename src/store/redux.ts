import {
  combineReducers,
  configureStore,
  Reducer,
  UnknownAction,
} from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiSlice } from '../service/apiSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';

import authReducer from './reducers/auth-slice';
import userReducer from './reducers/user-slice';
import walletsSlice from './reducers/wallet-slice';
import countriesSlice from './reducers/countries-slice';
import tempSlice from './reducers/temporary-slice';
import externalAccounts from './reducers/external-account-slice';
import menuPopSlice from './reducers/menu-pop-slice';
import scanWallet from './reducers/scan-wallet-slice';
import notification from './reducers/notification-slice';
import USDCWallet from './reducers/usdc-slice';
import { logoutAction } from './reducers/logout-slice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [apiSlice.reducerPath],
};

const appReducer = combineReducers({
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

// export const logoutAction = () => ({ type: 'LOGOUT' });

const rootReducer: Reducer = (
  state: RootState | undefined,
  action: UnknownAction,
) => {
  if (action.type === logoutAction.type) {
    const keepApi = { [apiSlice.reducerPath]: state[apiSlice.reducerPath] };

    state = undefined;

    if (keepApi) state = { ...keepApi };
  }

  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

setupListeners(store.dispatch, (dispatch, { onOnline }) => {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      dispatch(
        apiSlice.util.invalidateTags([
          'balance',
          'contacts',
          'external-accounts',
          'transactions',
          'user',
          'wallet',
        ]),
      );
      onOnline();
    }
  });
  return unsubscribe;
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
