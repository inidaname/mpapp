/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";
import { Image, Pressable, ScrollView, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import LinearGradient from "react-native-linear-gradient";

import FormInput from "../components/FormInput";
import ButtonComponent from "../components/Button";
import { useRegisterMutation } from "../service/endpoints/auth-endpoints";
import AppText from "../components/typo/AppText";
import { useAppDispatch } from "../store/redux";
import { setUserTemp } from "../store/reducers/temporary-slice";

interface Props extends NativeStackScreenProps<FullNavStack, "Signup"> {}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [register, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const { control, handleSubmit, watch, formState: { isValid } } = useForm<
    CreateUserInput
  >({
    defaultValues: {
      email: "",
      password: "",
      username: "",
      confirmpassword: "",
    },
  });

  const password = watch("password");

  const onSubmit: SubmitHandler<CreateUserInput> = async (values) => {
    const { confirmpassword, email, ...rest } = values;
    if (rest.password !== confirmpassword) {
      return;
    }

    try {
      const user = await register({ email: email.toLowerCase(), ...rest })
        .unwrap();
      dispatch(setUserTemp(user.data.id));
      navigation.navigate("VerificationScreen", {
        email: user.data.email,
        login: false,
      });
    } catch (err: any) {
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        contentContainerClassName="bg-white flex-col justify-start items-start"
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View className="mt-20 w-full items-center">
          <Image
            source={require("../../assets/logo.png")}
            className="w-[200]"
            resizeMode="contain"
          />
        </View>

        {/* Header */}
        <View className="items-center w-full mt-8">
          <AppText weight="medium" className="text-4xl">
            Create A Wallet
          </AppText>
          <AppText className="px-4 text-[18px] mt-4 text-center">
            Add your account basic details to create your account at Insfers
          </AppText>
        </View>

        {/* Form */}
        <View className="w-full px-5 mt-10">
          <FormInput
            name="username"
            label="Username"
            placeholder="Enter Username"
            leftIcon={<MaterialIcons name="person" size={20} color="gray" />}
            control={control}
            keyboardType="ascii-capable"
            rules={{ required: "Username is required" }}
          />

          <FormInput
            name="email"
            label="Email Address"
            placeholder="Enter Email Address"
            leftIcon={<MaterialIcons name="mail" size={20} color="gray" />}
            control={control}
            keyboardType="email-address"
            rules={{ required: "Email is required" }}
          />

          <FormInput
            name="password"
            label="Password"
            placeholder="Enter Password"
            leftIcon={<MaterialIcons name="lock" size={20} color="gray" />}
            isPassword
            control={control}
            keyboardType="default"
            rules={{ required: "Password is required" }}
          />

          <FormInput
            name="confirmpassword"
            label="Confirm Password"
            placeholder="Confirm Password"
            leftIcon={<MaterialIcons name="lock" size={20} color="gray" />}
            isPassword
            control={control}
            keyboardType="default"
            rules={{
              required: "Confirm password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
          />
          {error && (
            <View className="my-2 items-center justify-center">
              <AppText className="text-red-700 text-xl">{error}</AppText>
            </View>
          )}

          <ButtonComponent
            label="Continue"
            isLoading={isLoading}
            isDisabled={!isValid}
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        {
          /* <View className="flex-row w-full items-center justify-center my-6 px-6 py-2">
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
        <View className="border border-gray-300 h-28 w-28 rounded-full mx-4 p-4 items-center justify-center">
          <Image
            source={require("../../assets/apple.png")}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        </View>
        <View className="border border-gray-300 h-28 w-28 rounded-full mx-4 p-4 items-center justify-center">
          <Image
            source={require("../../assets/google.png")}
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
        </View>
      </View> */
        }

        <View className="flex-row justify-center items-center w-full mb-16 mt-6">
          <AppText className="text-[18px]">
            Already have an account?{" "}
          </AppText>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <AppText className="text-[18px] text-brand-600">Login</AppText>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default SignupScreen;
