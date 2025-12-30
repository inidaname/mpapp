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

interface Props extends NativeStackScreenProps<RootStackParamList> { }
const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [ step, setStep ] = useState<"start" | "verify">("start");
  const [ isDisabled, setIsDisabled ] = useState(true);
  const [ email, setEmail ] = useState("");
  const [ otp, setOTP ] = useState("");

  const [ resetPassword, { isLoading } ] = useResetPasswordMutation();

  const { control, handleSubmit, watch } = useForm<PasswordForm>({
    mode: "onChange",
  });

  const password = watch("password");
  console.log('step', step)

  const onResetPassword: SubmitHandler<PasswordForm> = async (values) => {
    if (otp.length !== 4) return;

    try {
      await resetPassword({
        email,
        otp,
        password: values.password,
      }).unwrap();

      navigation.navigate("Login");
    } catch (error) {
      console.log("reset error", error);
    }
  };

  const handleContinue = () => {
    if (step === "start") {
      setStep("verify");
      setIsDisabled(true);
      return;
    }

    handleSubmit(onResetPassword)();
  };

  useEffect(() => {
    setIsDisabled(!(password && otp.length === 4));
  }, [ password, otp ]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={40}
    >
      <View className="flex-1 bg-white">
        <View className="mt-20">
          <Back />
        </View>

        <View className="w-full items-center py-14 px-6">
          <Image
            source={
              step === "start"
                ? require("../../assets/lock_cancel.png")
                : require("../../assets/lock_checked.png")
            }
          />

          <AppText weight="semibold" className="text-3xl mt-8">
            Forget Password?
          </AppText>

          {step === "start" ? (<AppText weight="light" className="text-lg text-center mt-6 px-1">
            Don&apos;t worry. Enter your email to reset your password.
          </AppText>) : (<AppText weight="light" className="text-lg text-center mt-6 px-1">
            An OTP has been sent to the email provided. Use it to verify your identity and reset your password.
          </AppText>)}
        </View>

        {step === "start" ? (
          <StartForgotPassword
            setEmail={setEmail}
            setDisabled={setIsDisabled}
            setStep={setStep}
          />
        ) : (
          <View className="w-full px-6 items-center flex-1">
            <FormInput
              name="password"
              label="Password"
              placeholder="Enter a New Password"
              control={control}
              isPassword
              keyboardType="visible-password"
              rules={{ required: "Password is required" }}
              leftIcon={
                <MaterialIcons name="lock" size={20} color="gray" />
              }
            />

            <OtpInput
              numberOfDigits={4}
              focusColor="#215ce1"
              onTextChange={setOTP}
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
            label="Continue"
            onPress={handleContinue}
            isDisabled={isDisabled}
            isLoading={isLoading}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};


export default ForgotPasswordScreen;
