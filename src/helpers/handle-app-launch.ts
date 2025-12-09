import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAppToken } from './token-helper';
import { handleGlobalLogout } from './logut-helper';

let launched = false;
const LAST_OPEN_KEY = 'last_open_timestamp';
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
      await handleGlobalLogout();
    }
  }

  // update timestamp regardless
  await AsyncStorage.setItem(LAST_OPEN_KEY, Date.now().toString());
}
