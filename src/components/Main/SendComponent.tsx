import type React from "react";
import { useState } from "react";

import { TextInput, TouchableOpacity, View } from "react-native";
import AppText from "../typo/AppText";
// import CheckBox from "@react-native-community/checkbox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../../types/types";
import { useSendTransactionMutation } from "../../service/endpoints/transactions-endpoints";
import ButtonComponent from "../Button";

interface Props extends NativeStackScreenProps<FullNavStack, "Send"> {
  // wallet_address: string;
  wallet: WallectDetail["circle"]["data"]["tokenBalances"];
}

const SendComponent: React.FC<Props> = ({ route, navigation, wallet }) => {
  const [value, setValue] = useState("");
  const [sendTransaction, { isLoading }] = useSendTransactionMutation();

  const handleSend = async () => {
    try {
      const send = await sendTransaction({
        amount: `${value}`,
        destinationAddress: "A3jzQ471nggNQ2CWanJHvG2Z2wgSNDmqpr26iJrw3DZ1",
        tokenId: wallet[1].token.id,
      }).unwrap();
      console.log("send", send);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View className="mt-8 px-6">
      {/* Send To */}
      <View className="flex-row items-center justify-between border-b border-gray-100 pb-2">
        <AppText>Send To</AppText>
        <View className="w-2/3 mx-2">
          <AppText
            numberOfLines={1}
            ellipsizeMode="tail"
            className="truncate"
          >
            {route.params?.wallet_address}
          </AppText>
        </View>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-full"
          onPress={() => navigation.navigate("ScanWalletScreen")}
        >
          <AppText className="text-white font-semibold">Scan</AppText>
        </TouchableOpacity>
      </View>

      {/* Amount */}
      <View className="flex-row items-center justify-between border-b border-gray-100 mt-10 pb-2">
        <AppText>Amount</AppText>
        <TextInput
          value={`${value}`}
          onChangeText={(e) => {
            setValue(e);
          }}
          keyboardType="number-pad"
        />
        <View className="flex-row items-center">
          <View className="h-6 w-6 p-1 mr-2 border border-brand-700 rounded-full items-center justify-center">
            <View className="h-4 w-4 bg-brand-700 rounded-full" />
          </View>
          <AppText className="text-gray-500">USDC</AppText>
        </View>
      </View>
      {/* Checkbox */}
      <View className="flex-row items-center justify-center mt-10 mb-16">
        {
          /* <Checkbox
              value={feesSeparate}
              onValueChange={setFeesSeparate}
              color={feesSeparate ? "#2563eb" : undefined}
            /> */
        }
        {
          /* <CheckBox />
        <AppText className="ml-2 text-brand-700 text-lg">
          Detect fees separately
        </AppText> */
        }
      </View>

      {/* Send button */}
      {
        /* <TouchableOpacity className="mt-24 bg-blue-600 p-4 w-2/3 self-center rounded-2xl">
        <AppText className="text-center text-white font-bold text-lg">
          Send
        </AppText>
      </TouchableOpacity> */
      }

      <ButtonComponent
        label="Send"
        onPress={handleSend}
        isLoading={isLoading}
      />
    </View>
  );
};

export default SendComponent;
