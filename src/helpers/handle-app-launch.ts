import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from "../service/apiSlice";
import { store } from "../store/redux";
import { deleteAppToken, getAppToken } from "./token-helper";
import { clearProfile } from "../store/reducers/user-slice";
import { clearToken } from "../store/reducers/auth-slice";
import { clearUSDCWallet } from "../store/reducers/usdc-slice";
import { clearTempToken } from "../store/reducers/temporary-slice";
import { clearScannedAddress } from "../store/reducers/scan-wallet-slice";

let launched = false;
const LAST_OPEN_KEY = "last_open_timestamp";
const ONE_HOUR = 60 * 60 * 1000;

export async function handleAppLaunch() {
  if (launched) return;
  launched = true;

  const lastOpen = await AsyncStorage.getItem(LAST_OPEN_KEY);
  const token = await getAppToken();

  if (lastOpen) {
    const lastOpenTime = parseInt(lastOpen, 10);
    const now = Date.now();
    const diff = now - lastOpenTime;

    if (diff > ONE_HOUR && token) {
      // logout
      await deleteAppToken();
      store.dispatch(apiSlice.util.resetApiState());
      store.dispatch(clearProfile());
      store.dispatch(clearToken());
      store.dispatch(clearUSDCWallet());
      store.dispatch(clearTempToken());
      store.dispatch(clearScannedAddress());
    }
  }

  // update timestamp regardless
  await AsyncStorage.setItem(LAST_OPEN_KEY, Date.now().toString());
}
