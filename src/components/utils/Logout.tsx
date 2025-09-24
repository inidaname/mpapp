import type React from "react";

import { View } from "react-native";

import ButtonComponent from "../Button";
import { useAppDispatch } from "../../store/redux";
import { clearToken } from "../../store/reducers/auth-slice";
import { clearProfile } from "../../store/reducers/user-slice";
import { apiSlice } from "../../service/apiSlice";
// import { useLogout } from "../../hooks/useLogout";

interface Props {}

const Logout: React.FC<Props> = () => {
  const dispatch = useAppDispatch();

  return (
    <View className="px-6 w-full mt-6">
      <ButtonComponent
        label="Logout"
        onPress={() => {
          dispatch(clearToken());
          dispatch(clearProfile());
          dispatch(apiSlice.util.resetApiState());
        }}
      />
    </View>
  );
};

export default Logout;
