import type React from "react";
import { useRef, useState } from "react";

import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { useForm } from "react-hook-form";

import { MaterialIcons } from "@react-native-vector-icons/material-icons";

import { RootStackParamList } from "../types/types";
import HeaderSide from "../components/Main/HeaderSide";
import AppText, { FigureText } from "../components/typo/AppText";
import USDC from "../../assets/Web3Icons/usdc_logo.svg";
import ButtonComponent from "../components/Button";
import { useConvertFundsToWalletMutation } from "../service/endpoints/convert-endpoints";
import { useAppSelector } from "../store/redux";
import Clipboard from "@react-native-clipboard/clipboard";
import { twMerge } from "tailwind-merge";
import StartKYC from "../components/screens/StartKYC";
import { useGetKYCQuery } from "../service/endpoints/kyc-endpoints";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

interface DeatilProp {
  title: string;
  value?: string;
  className?: string;
  prefix?: boolean;
}

const ShowDetail: React.FC<DeatilProp> = (
  { title, value, className = "flex-row", prefix },
) => {
  const anim = useRef(new Animated.Value(1)).current;

  const handleCopy = () => {
    if (!value) return;

    Clipboard.setString(value);

    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1.4,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View className={twMerge(className, "mb-2 justify-between")}>
      <AppText className="text-xl text-gray-500">
        {title}
      </AppText>
      <View className="flex-row items-center gap-2">
        <FigureText className="text-2xl">
          {prefix && "$"}
          {value}
        </FigureText>
        <Pressable
          onPress={handleCopy}
        >
          <Animated.View style={{ transform: [{ scale: anim }] }}>
            <MaterialIcons
              name="copy-all"
              color={"#215CE1"}
              size={20}
            />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

const ConversionScreen: React.FC<Props> = () => {
  // const { control } = useForm();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [detail, setDetail] = useState<ConvertData | null>(null);
  const { active_wallet_address } = useAppSelector((state) => state.wallet);
  const { data, isLoading: gettingKYC } = useGetKYCQuery();

  const [convert, { isLoading }] = useConvertFundsToWalletMutation();

  const handleConvert = async () => {
    try {
      const converted = await convert({
        amount,
        destination: {
          to_address: active_wallet_address!,
          currency: "usdc",
          payment_rail: "solana",
        },
        source: {
          currency: "usd",
          payment_rail: "wire",
        },
      }).unwrap();

      setDetail(converted.data);

      setConfirmVisible(true);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <ScrollView
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ flex: 1 }}
      className="flex-1 bg-white px-0"
    >
      <HeaderSide heading="Currency Conversion" isWithBack />
      <View className="w-full bg-white p-8 relative justify-center">
        <View className="bg-[#F2F4F6] rounded-2xl p-4 py-8 mb-6 shado z-9w">
          <AppText className="text-gray-500 mb-2">Convert From</AppText>
          <View className="flex-row items-center border border-blue-400 rounded-xl px-3 py-2">
            <TextInput
              keyboardType="decimal-pad"
              className="flex-1 text-lg text-black"
              onChangeText={(e) => setAmount(e)}
            />
            <TouchableOpacity className="flex-row items-center">
              <Image
                source={require("../../assets/money_13992615.png")}
                width={20}
                height={20}
                className="w-[20px] h-[20px]"
              />
              <AppText className="ml-1 text-blue-600 font-medium">
                USD
              </AppText>
            </TouchableOpacity>
          </View>
          {
            /* <View className="flex-row justify-between mt-2">
            <AppText className="text-black font-medium">~ $210.0</AppText>
            <AppText className="text-gray-400">
              Available Balance: €200.01
            </AppText>
          </View> */
          }
        </View>

        {/* Swap Button */}
        <View className="items-center mb-6 absolute self-center mt-5 z-10">
          {/* TODO: v2 this should switch and swap */}
          <View className="bg-blue-600 w-20 h-20 rounded-full items-center justify-center">
            <MaterialIcons name="south" size={36} color="white" />
          </View>
        </View>

        {/* Convert To */}
        <View className="bg-[#F2F4F6] rounded-2xl p-4 py-8 mt-6 z-9">
          <AppText className="text-gray-500 mb-2">Convert To</AppText>
          <View className="flex-row items-center border border-blue-400 rounded-xl px-3 py-2">
            <View className="flex-1 text-lg text-black">
              <AppText>{amount}</AppText>
            </View>
            <TouchableOpacity className="flex-row items-center">
              <USDC width={20} height={20} color="#1D4ED8" />
              <AppText className="ml-1 text-blue-600 font-medium">
                USDC
              </AppText>
            </TouchableOpacity>
          </View>
          {
            /* <View className="flex-row justify-between mt-2">
            <AppText className="text-black font-medium">~ $79,709.0</AppText>
            <AppText className="text-gray-400">
              Available Balance: $79.709
            </AppText>
          </View> */
          }
        </View>
      </View>
      {data?.data.status !== "approved" && (
        <View className="flex-row w-full px-6 items-center">
          {gettingKYC ? <AppText>Checking KYC status</AppText> : <StartKYC />}
        </View>
      )}
      {
        /* <View className="w-full px-6">
        <View className="w-full">
          <View className="w-full flex-row items-center my-1 justify-between">
            <AppText>Fx Rate</AppText>
            <AppText>$ 1 = € 0.0130</AppText>
          </View>
          <View className="w-full flex-row items-center my-1 justify-between">
            <AppText>Service Fee</AppText>
            <AppText>$ 1.40</AppText>
          </View>
          <View className="w-full border-t border-gray-100 mt-8" />
          <View className="w-full flex-row items-center my-1 justify-between">
            <AppText>You will Get</AppText>
            <AppText>$ 30.40</AppText>
          </View>
        </View>
      </View> */
      }
      <View className="px-6 bottom-10 justify-center items-center  w-full absolute">
        <ButtonComponent
          onPress={handleConvert}
          isLoading={isLoading}
          isDisabled={!amount || data?.data.status !== "approved"}
          label="Deposit"
        />
      </View>
      <Modal visible={confirmVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white rounded-t-[35px] p-6 h-[763px]">
            <AppText
              weight="bold"
              className="text-center text-2xl mt-4 font-semibold"
            >
              Deposit Bank Detail
            </AppText>

            {/* Conversion details */}
            <View className="flex-row justify-evenly items-center my-6">
              <View className="flex-row items-center">
                {/* <EURO width={25} height={25} color="#1D4ED8" /> */}
                <Image
                  source={require("../../assets/money_13992615.png")}
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px]"
                />
                <AppText className="mx-2 text-2xl">USD</AppText>
              </View>
              <MaterialIcons name="swap-horiz" size={30} color="black" />
              <View className="flex-row items-center">
                <AppText className="mx-2 text-2xl">USDC</AppText>
                <USDC width={25} height={25} color="#1D4ED8" />
              </View>
            </View>

            <View className="w-full flex-1 justify-between">
              <ShowDetail
                title="Bank Name"
                value={detail?.source_deposit_instructions.bank_name}
              />
              <ShowDetail
                title="Account No"
                value={detail?.source_deposit_instructions.bank_account_number}
              />
              <ShowDetail
                title="Routing Number"
                value={detail?.source_deposit_instructions.bank_routing_number}
              />
              <ShowDetail
                title="Deposit Message"
                className=""
                value={detail?.source_deposit_instructions.deposit_message}
              />
              <ShowDetail
                title="Account Name"
                value={detail?.source_deposit_instructions
                  .bank_beneficiary_name}
              />
              <ShowDetail
                title="Amount"
                prefix
                value={detail?.source_deposit_instructions.amount}
              />
              <ShowDetail
                title="On-Ramp Fee"
                prefix
                value={detail?.developer_fee}
              />

              {
                /* <View className="mb-2 flex-row justify-between">
                <AppText className="text-xl text-gray-500">Fx Rate</AppText>
                <FigureText className="text-2xl">
                  $1 = €0.0130
                </FigureText>
              </View> */
              }

              <View className="mb-4 flex-row justify-between">
                <AppText
                  weight="semibold"
                  className="font-semibold text-xl text-gray-500"
                >
                  You Receive
                </AppText>
                <FigureText className="text-2xl text-brand-700">
                  ${Number(detail?.source_deposit_instructions.amount) -
                    Number(detail?.developer_fee)}
                </FigureText>
              </View>

              <ButtonComponent
                onPress={() => {
                  setConfirmVisible(false);
                }}
                label="Continue"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={successVisible} animationType="fade" transparent>
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white rounded-2xl p-6 items-center w-4/5">
            <View className="bg-gray-100 rounded-full h-36 w-36 justify-center items-center my-6 mt-8">
              <View className="bg-gray-200 rounded-full h-28 w-28 justify-center items-center">
                <View className="bg-brand-700 w-20 h-20 rounded-full items-center justify-center">
                  <MaterialIcons name="check" size={36} color="white" />
                </View>
              </View>
            </View>
            <AppText
              weight="semibold"
              className="text-2xl text-center mb-2 font-semibold"
            >
              Conversion Success
            </AppText>
            <AppText className="text-center text-lg/1 mb-4 text-gray-500 mt-2">
              Congratulations! You have successfully converted currency from EUR
              to USDC.
            </AppText>
            <TouchableOpacity
              className="mr-4 mt-4 rounded-full absolute r-0 p-1 self-end bg-gray-800"
              onPress={() => setSuccessVisible(false)}
            >
              <MaterialIcons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ConversionScreen;
