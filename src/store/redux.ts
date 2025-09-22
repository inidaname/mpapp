import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiSlice } from '../service/apiSlice';
import authReducer from "./reducers/auth-slice"
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [ 'counter' ], // don't persist API cache
};

const rootReducer = combineReducers({
  [ apiSlice.reducerPath ]: apiSlice.reducer,
  auth: authReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),  // add middleware
});

export const persistor = persistStore(store);

export const useAppDispatch: AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = () => typeof store.dispatch;
