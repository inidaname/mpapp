import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from "../service/apiSlice";
import { store } from "../store/redux";

let launched = false;

export async function handleAppLaunch() {
  if (launched) return;
  launched = true;
  const flag = await AsyncStorage.getItem("app_launch_flag");
  console.log("flag set", flag);

  if (flag === null) {
    store.dispatch(apiSlice.util.resetApiState());

    console.log("flag null", flag);

    await AsyncStorage.setItem("app_launch_flag", "1");
    console.log("flag done", flag);
  }
}
