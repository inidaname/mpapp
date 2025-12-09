import { apiSlice } from '../service/apiSlice';
import { logoutAction } from '../store/reducers/logout-slice';
import { store, persistor } from '../store/redux';
import { deleteAppToken } from './token-helper';

export const handleGlobalLogout = async () => {
  store.dispatch(logoutAction());

  store.dispatch(apiSlice.util.resetApiState());

  await deleteAppToken();

  await persistor.purge();

  await persistor.flush();
};
