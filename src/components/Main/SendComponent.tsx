import type React from "react";
import { useEffect, useState } from "react";
import { Alert, Modal, TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AppText from "../typo/AppText";
import CheckBox from "@react-native-community/checkbox";
import { FullNavStack } from "../../types/types";
import { useSendTransactionMutation } from "../../service/endpoints/transactions-endpoints";
import ButtonComponent from "../Button";
import { useAppDispatch, useAppSelector } from "../../store/redux";
import useAutoPaste from "../../hooks/useAutoPaste";
import { setScanned } from "../../store/reducers/scan-wallet-slice";

interface Props
  extends
    Pick<NativeStackScreenProps<FullNavStack, "Send">, "navigation" | "route"> {
  token_id: string;
  wallet_balance: string;
}

const SendComponent: React.FC<Props> = (
  { navigation, token_id, wallet_balance },
) => {
  const [value, setValue] = useState<number | string>("");
  const [feesSeparate, setFeesSeparate] = useState<boolean>();
  const { address, scanned } = useAppSelector((state) => state.scanWallet);
  const [inputAdd, setInputAdd] = useState("");
  const [sendTransaction, { isLoading }] = useSendTransactionMutation();
  const { clipboardContent } = useAutoPaste({});
  const dispatch = useAppDispatch();

  const [resultModal, setResultModal] = useState<{
    status: "success" | "error" | null;
    message: string;
  }>({ status: null, message: "" });

  useEffect(() => {
    setInputAdd("");
    setValue("");
  }, []);

  useEffect(() => {
    if (!inputAdd && clipboardContent) {
      setInputAdd(clipboardContent);
    }
  }, [clipboardContent, inputAdd]);

  useEffect(() => {
    if (!scanned || !address) return;

    setInputAdd(address);
    dispatch(setScanned(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, scanned]);

  const isDisabled = !inputAdd.trim() ||
    isNaN(value as number) ||
    value as number <= 0 ||
    value as number > Number.parseFloat(wallet_balance);

  const handleSend = () => {
    const amount = Number.parseFloat(`${value}`);
    const balance = Number.parseFloat(wallet_balance);

    if (!inputAdd.trim()) {
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      return;
    }

    if (amount > balance) {
      return;
    }

    Alert.alert(
      "Confirm Transaction",
      `You are sending ${amount} USDC to:\n${inputAdd}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          style: "destructive",
          onPress: confirmSend,
        },
      ],
    );
  };

  const confirmSend = async () => {
    try {
      await sendTransaction({
        amount: `${value}`,
        destinationAddress: `${inputAdd}`,
        tokenId: token_id,
        destinationChain: "Solana",
        // separateFees: !!feesSeparate,
      }).unwrap();

      setInputAdd("");
      setValue("");

      setResultModal({
        status: "success",
        message: "Transaction sent successfully.",
      });
    } catch (error: any) {
      setResultModal({
        status: "error",
        message: error?.data?.message ||
          error?.error ||
          "Transaction failed.",
      });
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
            onChangeText={setInputAdd}
            value={inputAdd}
            placeholder="Wallet address"
            autoCapitalize="none"
            autoCorrect={false}
          />
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
            value as number > Number.parseFloat(wallet_balance)
              ? "text-red-700"
              : "text-blackAlpha-400"
          }`}
          onChangeText={(text) => setValue(Number.parseFloat(text))}
          keyboardType="decimal-pad"
          placeholder="0.00"
        />
        <View className="flex-row items-center">
          <View className="h-6 w-6 p-1 mr-2 border border-brand-700 rounded-full items-center justify-center">
            <View className="h-4 w-4 bg-brand-700 rounded-full" />
          </View>
          <AppText className="text-[#172A2B99] text-[16px]">USDC</AppText>
        </View>
      </View>

      <View className="flex-row items-center justify-center mt-4 mb-1">
        {value as number > Number.parseFloat(wallet_balance) && (
          <AppText className="text-red-700 text-lg">
            You don’t have enough balance for this transaction.
          </AppText>
        )}
      </View>

      <View className="flex-row items-center justify-center mt-10 mb-16">
        <CheckBox
          value={feesSeparate}
          onValueChange={setFeesSeparate}
          className="rounded-none"
          boxType="square"
          tintColors={{ true: "#215ce1" }}
          onCheckColor="white"
          onFillColor="#215ce1"
        />
        <AppText className="ml-3 text-brand-700 text-xl font-medium">
          Detect fees separately
        </AppText>
      </View>

      <ButtonComponent
        label="Send"
        onPress={handleSend}
        isLoading={isLoading}
        className="self-center"
        isDisabled={isDisabled}
        width="w-1/2"
      />

      {/* Result Modal */}
      <Modal
        visible={!!resultModal.status}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/40 justify-center items-center px-8">
          <View className="bg-white w-full p-6 rounded-2xl">
            <AppText className="text-xl font-semibold mb-3">
              {resultModal.status === "success" ? "Success" : "Error"}
            </AppText>

            <AppText className="text-md mb-6">
              {resultModal.message}
            </AppText>

            <ButtonComponent
              label="Close"
              onPress={() => setResultModal({ status: null, message: "" })}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SendComponent;
