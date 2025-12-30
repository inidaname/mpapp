import type React from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import ButtonComponent from "../Button";
import { useCreateWalletMutation } from "../../service/endpoints/wallets-endpoints";
import { FullNavStack } from "../../types/types";

const CreateWallet: React.FC<
  Pick<NativeStackScreenProps<FullNavStack>, "navigation">
> = ({ navigation }) => {
  const [ createWallet, { isLoading } ] = useCreateWalletMutation();

  const handleCreadtWallet = async () => {
    try {
      const wallet = await createWallet({
        accountType: "EOA",
        blockchains: [ "SOL" ],
      }).unwrap();
      navigation.navigate("Home", { screen: "Send" });
      console.log("wallet", wallet);
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <ButtonComponent
      label="Create a new wallet"
      isLoading={isLoading}
      onPress={handleCreadtWallet}
    />
  );
};

export default CreateWallet;
