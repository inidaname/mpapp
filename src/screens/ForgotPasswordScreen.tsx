import type React from "react";
import { useEffect, useState } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { RootStackParamList } from "../types/types";
import { Image, View } from "react-native";
import Back from "../components/typo/Back";
import AppText from "../components/typo/AppText";
import ButtonComponent from "../components/Button";
import StartForgotPassword from "../components/screens/StartForgotPassword";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { OtpInput } from "react-native-otp-entry";
import FormInput from "../components/FormInput";
import { useResetPasswordMutation } from "../service/endpoints/auth-endpoints";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [startPassword, setStartPassword] = useState<"start" | "verify">(
    "start",
  );
  const [allow, setAllow] = useState(true);
  const [email, setEmail] = useState("");

  const [otp, setOTP] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const { control, handleSubmit, watch } = useForm<PasswordForm>();
  const password = watch("password");

  const handlePassword: SubmitHandler<PasswordForm> = async (values) => {
    try {
      const pas = await resetPassword({
        password: values.password,
        otp: otp,
        email,
      }).unwrap();
      navigation.navigate("Login");
      console.log("pas", pas);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSwitch = () => {
    if (startPassword === "start") {
      setStartPassword("verify");
      setAllow(true);
    } else {
      handleSubmit(handlePassword)();
    }
  };

  useEffect(() => {
    if (password && otp.length === 4) {
      setAllow(false);
    }
  }, [otp.length, password]);

  return (
    <KeyboardAwareScrollView
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={40}
    >
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
          ? <StartForgotPassword setEmail={setEmail} setAllow={setAllow} />
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
              <OtpInput
                focusColor="#215ce1"
                numberOfDigits={4}
                onTextChange={(text) => setOTP(text)}
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
          )}
        <View className="w-full px-6">
          <ButtonComponent
            onPress={handleSwitch}
            isDisabled={allow}
            isLoading={isLoading}
            label="Continue"
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ForgotPasswordScreen;
