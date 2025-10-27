import type React from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import ButtonComponent from "../Button";

import { FullNavStack } from "../../types/types";

interface Props
  extends Pick<NativeStackScreenProps<FullNavStack>, "navigation"> {
}

const GoToWallet: React.FC<Props> = ({ navigation }) => {
  return (
    <ButtonComponent
      label="I already have a wallet"
      onPress={() => navigation.navigate("Home")}
    />
  );
};

export default GoToWallet;
