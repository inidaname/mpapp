import React, { useState } from "react";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import FormInput from "../components/FormInput";
import { SubmitHandler, useForm } from "react-hook-form";
import ButtonComponent from "../components/Button";
import { ScrollView } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
import AppText from "../components/typo/AppText";
import { useLoginMutation } from "../service/endpoints/auth-endpoints";
import { saveToken } from "../helpers/token-helper";
// import { Button } from '@react-navigation/elements';

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<LoginInput>({
    defaultValues: { password: "", email: "" },
  });

  const [login, { isLoading }] = useLoginMutation();

  const handlePress: SubmitHandler<LoginInput> = async (values) => {
    console.log("values", values);
    try {
      const loginUser = await login(values).unwrap();
      saveToken(loginUser.data.accessToken);
      navigation.replace("Home");
      console.log("loginUser", loginUser);
    } catch (err: any) {
      // navigation.replace("Home");
      console.log("err", err);
      setError(err.data.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={40}
    >
      <ScrollView contentContainerClassName="min-h-full justify-start items-start bg-white flex-col">
        <View className="mt-20 w-full items-center">
          <Image
            source={require("../../assets/logo.png")}
            width={500}
            resizeMode="center"
          />
        </View>
        <View className="items-center w-full mt-8">
          <Text className="text-4xl font-raleway-medium">Welcome Back!</Text>
          <Text className="font-raleway px-4 text-lg mt-4 text-center">
            Enter your Email and password to continue to your account
          </Text>
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
            rules={{ required: "Email is required" }}
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
            <AppText weight="medium" className="text-xl mb-4 text-brand-700">
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
          <Text className="font-raleway text-lg">
            Don&apos;t have an account?
          </Text>
          <Pressable onPress={() => navigation.navigate("Signup")}>
            <Text className="font-raleway text-lg text-brand-600">
              {" "}
              Create Account
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;
