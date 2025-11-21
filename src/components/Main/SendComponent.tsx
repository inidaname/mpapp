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
  const [inputAdd, setInputAdd] = useState(route.params?.wallet_address);
  const [sendTransaction, { isLoading }] = useSendTransactionMutation();

  const handleSend = async () => {
    try {
      const send = await sendTransaction({
        amount: `${value}`,
        destinationAddress: `${inputAdd}`,
        tokenId: wallet[0].token.id,
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
        <AppText className="text-[#14141480] text-[16px]">Send To</AppText>
        <View className="flex-1 mx-2">
          <TextInput
            numberOfLines={1}
            className="truncate w-full"
            onChangeText={(e) => setInputAdd(e)}
            value={inputAdd}
          />
          {
            /* <AppText
            numberOfLines={1}
            ellipsizeMode="tail"
            className="truncate"
          >
            {route.params?.wallet_address}
          </AppText> */
          }
        </View>
        <TouchableOpacity
          className="bg-brand-700 px-5 py-4 rounded-full"
          onPress={() => navigation.navigate("ScanWalletScreen")}
        >
          <AppText className="text-white font-bold text-[16px]">
            Scan
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Amount */}
      <View className="flex-row items-center justify-between border-b border-gray-100 mt-10 pb-2">
        <AppText className="text-[#14141480] text-[16px]">Amount</AppText>
        <TextInput
          value={`${value}`}
          onChangeText={(e) => {
            setValue(e);
          }}
          keyboardType="decimal-pad"
        />
        <View className="flex-row items-center">
          <View className="h-6 w-6 p-1 mr-2 border border-brand-700 rounded-full items-center justify-center">
            <View className="h-4 w-4 bg-brand-700 rounded-full" />
          </View>
          <AppText className="text-[#172A2B99] text-[16px]">USDC</AppText>
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
