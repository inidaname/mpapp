import type React from "react";

import { TouchableOpacity, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OtpInput } from "react-native-otp-entry";
import { FullNavStack } from "../types/types";
import HeaderSide from "../components/Main/HeaderSide";
import AppText from "../components/typo/AppText";
import { useForm } from "react-hook-form";
import PhoneNumberInput from "../components/PhoneNumberInput";
import ButtonComponent from "../components/Button";

interface Props extends NativeStackScreenProps<FullNavStack> {}

const ChangePhoneScreen: React.FC<Props> = () => {
  const { control } = useForm();
  return (
    <View className="w-full flex-1 bg-white justify-between items-center">
      <View className="w-full">
        <HeaderSide heading="Change Phone Number" isWithBack />
        <AppText
          weight="light"
          className="px-6 text-center mt-8 font-light text-lg"
        >
          Enter your old phone number on which we can send you a verification
          code
        </AppText>
        <View className="px-6 w-full items-center mt-8">
          <PhoneNumberInput
            name="phone"
            control={control}
            label="Phone Number"
            rules={{ required: "Phone number required" }}
          />
          <TouchableOpacity className="self-end mb-8">
            <AppText className="text-brand-700 underline text-lg">
              Send Code
            </AppText>
          </TouchableOpacity>

          <OtpInput
            focusColor="#215ce1"
            numberOfDigits={4}
            onTextChange={(text) => console.log(text)}
            theme={{
              pinCodeContainerStyle: { width: 60, height: 60 },
              containerStyle: { width: "90%", marginVertical: 20 },
              pinCodeTextStyle: {
                fontFamily: "Raleway-Regular",
                fontSize: 20,
              },
            }}
          />
        </View>
      </View>
      <View className="px-6 w-full">
        <ButtonComponent label="Update" />
      </View>
    </View>
  );
};

export default ChangePhoneScreen;
