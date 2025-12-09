import type React from "react";

import { View } from "react-native";

import ButtonComponent from "../Button";
import { handleGlobalLogout } from "../../helpers/logut-helper";

interface Props {}

const Logout: React.FC<Props> = () => {
  return (
    <View className="px-6 w-full mt-6">
      <ButtonComponent
        label="Logout"
        onPress={async () => {
          await handleGlobalLogout();
        }}
      />
    </View>
  );
};

export default Logout;
