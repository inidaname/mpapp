import React, { useState } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";
import { Image, Pressable, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import FormInput from "../components/FormInput";
import { SubmitHandler, useForm } from "react-hook-form";
import ButtonComponent from "../components/Button";
import { ScrollView } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
import AppText from "../components/typo/AppText";
import { useLoginMutation } from "../service/endpoints/auth-endpoints";
import { useAppDispatch } from "../store/redux";
import { setToken } from "../store/reducers/auth-slice";
import { saveToken } from "../helpers/token-helper";
// import { Button } from '@react-navigation/elements';

interface Props extends NativeStackScreenProps<FullNavStack> { }

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [ error, setError ] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const { control, handleSubmit, formState: { isValid } } = useForm<LoginInput>(
    {
      defaultValues: { password: "", email: "" },
    },
  );

  const [ login, { isLoading } ] = useLoginMutation();

  const handlePress: SubmitHandler<LoginInput> = async (values) => {
    try {
      const loginUser = await login({
        email: values.email.toLowerCase(),
        password: values.password,
      }).unwrap();
      saveToken(loginUser.data.accessToken).catch(err => console.log('err', err));
      console.log("loginUser.data.accessToken", loginUser.data.accessToken);

      dispatch(
        setToken({
          token: loginUser.data.accessToken,
          user_id: loginUser.data.id,
        }),
      );
    } catch (err: any) {
      // navigation.replace("Home");
      if (err?.data?.message === "Your account has not been verified") {
        console.log("err", err.data.message);
        navigation.navigate("VerificationScreen", { email: values.email });
      }
      setError(err.data.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      // eslint-disable-next-line react-native/no-inline-styles
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={40}
    >
      <ScrollView contentContainerClassName="min-h-full justify-start items-start bg-white flex-col">
        <View className="mt-20 w-20 w-full items-center">
          <Image
            source={require("../../assets/logo.png")}
            className="w-[200]"
            resizeMode="contain"
          />
        </View>
        <View className="items-center w-full mt-8">
          <AppText weight="medium" className="text-4xl">Welcome Back!</AppText>
          <AppText className="px-4 text-[18px] mt-4 text-center font-light">
            Enter your Email and password to continue to your account
          </AppText>
        </View>
        <View className="h-[40px]" />
        <View className="w-full px-5">
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
            rules={{
              required: "Email is required",
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            }}
          />
          <FormInput
            name="password"
            label="Password"
            placeholder="Enter Password"
            leftIcon={
              <MaterialIcons
                name="lock"
                size={20}
                color="gray"
              />
            }
            isPassword={true}
            control={control}
            keyboardType="visible-password"
            rules={{ required: "Password is required" }}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <AppText weight="medium" className="text-2xl mb-4 text-brand-700">
              Forgot Password?
            </AppText>
          </TouchableOpacity>
          {error && (
            <View className="my-2 items-center justify-center">
              <AppText className="text-red-700 text-xl">{error}</AppText>
            </View>
          )}

          <ButtonComponent
            isLoading={isLoading}
            label="Continue"
            isDisabled={!isValid}
            onPress={handleSubmit(handlePress)}
          />
        </View>
        {
          /* <View className="flex-row w-full items-center justify-center px-6 my-4 py-2">

        <LinearGradient
          colors={["transparent", "#437DFF", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-1 h-1"
        />


        <Text className="mx-4 text-gray-600 text-base font-medium">Or</Text>


        <LinearGradient
          colors={["transparent", "#437DFF", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-1 h-1"
        />
      </View>
      <View className="flex-row justify-center items-center w-full">
        <View className="border border-gray-300 border-2 h-28 w-28 rounded-full mx-4 p-4 items-center justify-center">
          <Image
            source={require("../../assets/apple.png")}
            resizeMethod="scale"
            resizeMode="cover"
            className="w-20 h-20"
          />
        </View>
        <View className="border border-gray-300 border-2 h-28 w-28 rounded-full mx-4 p-4 items-center justify-center">
          <Image
            source={require("../../assets/google.png")}
            resizeMethod="scale"
            resizeMode="cover"
            className="w-16 h-16"
          />
        </View>
      </View> */
        }
        <View className="flex flex-row justify-center items-center w-full mb-2 mt-4 h-24">
          <AppText className="text-[18px]">
            Don&apos;t have an account?
          </AppText>
          <Pressable onPress={() => navigation.navigate("Signup")}>
            <AppText className="text-[18px] text-brand-600">
              {" "}
              Create Account
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;
