import type React from "react";
import { useState } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/types";
import { Image, TouchableOpacity, View } from "react-native";
import Back from "../components/typo/Back";
import AppText from "../components/typo/AppText";
import { useForm } from "react-hook-form";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import FormInput from "../components/FormInput";
import { OtpInput } from "react-native-otp-entry";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [startPassword, setStartPassword] = useState<"start" | "verify">(
    "start",
  );

  const handleSwitch = () => {
    if (startPassword === "start") {
      setStartPassword("verify");
    } else {
      navigation.navigate("StartScreen");
    }
  };
  const { control } = useForm();
  return (
    <View className="flex-1 bg-white">
      <View className="mt-20">
        <Back />
      </View>
      <View className="w-full justify-center items-center py-14 px-6">
        {startPassword === "start"
          ? <Image source={require("../../assets/lock_cancel.png")} />
          : <Image source={require("../../assets/lock_checked.png")} />}
        <AppText weight="semibold" className="text-3xl mt-8">
          Forget Password?
        </AppText>
        <AppText weight="light" className="text-lg text-center mt-2 px-1">
          Don&apos;t worry it happens! just enter your email to reset your
          password
        </AppText>
      </View>
      {startPassword === "start"
        ? (
          <View className="w-full px-6 justify-start items-center flex-1">
            <FormInput
              name="email"
              label="Email Address"
              placeholder="Enter Email Address"
              leftIcon={
                <MaterialIcons
                  name="mail"
                  size={20}
                  color="gray"
                />
              }
              control={control}
              keyboardType="email-address"
              rules={{ required: "Password is required" }}
            />
            <AppText className="self-end underline text-brand-700 text-lg mb-10 pr-5">
              Send Code
            </AppText>
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
        )
        : (
          <View className="w-full px-6 justify-start items-center flex-1">
            <FormInput
              name="password"
              label="Password"
              placeholder="Enter a New Password"
              leftIcon={
                <MaterialIcons
                  name="lock"
                  size={20}
                  color="gray"
                />
              }
              control={control}
              isPassword
              keyboardType="visible-password"
              rules={{ required: "Password is required" }}
            />
            <FormInput
              name="confirmpassword"
              label="Confirm Password"
              placeholder="Confirm Password"
              leftIcon={
                <MaterialIcons
                  name="lock"
                  size={20}
                  color="gray"
                />
              }
              control={control}
              isPassword
              keyboardType="visible-password"
              rules={{ required: "Password is required" }}
            />
          </View>
        )}
      <View className="w-full px-6">
        <TouchableOpacity
          onPress={handleSwitch}
          className="bg-brand-700 w-full px-6 py-3 rounded-2xl h-16 justify-center items-center mb-10"
        >
          <AppText weight="semibold" className="text-white text-xl">
            Continue
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
