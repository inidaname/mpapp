import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from "../service/apiSlice";
import { store } from "../store/redux";

let launched = false;

export async function handleAppLaunch() {
  if (launched) return;
  launched = true;
  const flag = await AsyncStorage.getItem("app_launch_flag");

  if (flag === null) {
    store.dispatch(apiSlice.util.resetApiState());

    await AsyncStorage.setItem("app_launch_flag", "1");
  }
}
