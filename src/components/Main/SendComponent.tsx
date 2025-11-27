import type React from "react";
import { useEffect, useState } from "react";

import { TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AppText from "../typo/AppText";
// import CheckBox from "@react-native-community/checkbox";
import { FullNavStack } from "../../types/types";
import { useSendTransactionMutation } from "../../service/endpoints/transactions-endpoints";
import ButtonComponent from "../Button";
import { useAppSelector } from "../../store/redux";
import useAutoPaste from "../../hooks/useAutoPaste";

interface Props
  extends Pick<NativeStackScreenProps<FullNavStack, "Send">, "navigation"> {
  token_id: string;
  wallet_balance: string;
}

const SendComponent: React.FC<Props> = (
  { navigation, token_id, wallet_balance },
) => {
  const [value, setValue] = useState("");
  const { address } = useAppSelector((state) => state.scanWallet);
  const [inputAdd, setInputAdd] = useState(address ?? "");
  const [sendTransaction, { isLoading }] = useSendTransactionMutation();
  const { clipboardContent } = useAutoPaste({});

  useEffect(() => {
    setInputAdd(clipboardContent);
  }, [clipboardContent]);

  const handleSend = async () => {
    try {
      await sendTransaction({
        amount: `${value}`,
        destinationAddress: `${inputAdd}`,
        tokenId: token_id,
        destinationChain: "Solana",
      }).unwrap();
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
            className="truncate w-full text-md"
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
          className={`text-4xl text-center font-medium font-montserrat flex-1 ${
            Number.parseFloat(value) > Number.parseFloat(wallet_balance)
              ? "text-red-700"
              : "text-blackAlpha-400"
          }`}
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
        {Number.parseFloat(value) > Number.parseFloat(wallet_balance) && (
          <AppText className="text-red-700 text-sm">
            The amount you&apos;re trying to send isn&apos;t enough to complete
            this transaction.
          </AppText>
        )}
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
        isDisabled={(Number.parseFloat(value) >
          Number.parseFloat(wallet_balance)) || !value}
        isLoading={isLoading}
      />
    </View>
  );
};

export default SendComponent;
