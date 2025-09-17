import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import LinearGradient from "react-native-linear-gradient";

import FormInput from "../components/FormInput";
import ButtonComponent from "../components/Button";
import { useRegisterMutation } from "../service/endpoints/auth-endpoints";

interface Props extends NativeStackScreenProps<RootStackParamList, "Login"> {}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [register, { isLoading }] = useRegisterMutation();

  const { control, handleSubmit } = useForm<CreateUserInput>({
    defaultValues: {
      country: "nigeria",
      email: "",
      encrypted_recovery_phrase: "",
      mailingAddress: "",
      phone_number: "",
      pin_hash: "",
    },
  });

  const onSubmit: SubmitHandler<CreateUserInput> = async (values) => {
    // if (values.password !== values.confirmpassword) {
    //   Alert.alert("Error", "Passwords do not match");
    //   return;
    // }

    try {
      const user = await register(values).unwrap();
      console.log("user", user);
      navigation.navigate("VerificationScreen");
    } catch (error: any) {
      console.error("Register error", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <ScrollView
      contentContainerClassName="min-h-full bg-white flex-col justify-start items-start"
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo */}
      <View className="mt-20 w-full items-center">
        <Image
          source={require("../../assets/logo.png")}
          width={500}
          resizeMode="contain"
        />
      </View>

      {/* Header */}
      <View className="items-center w-full mt-8">
        <Text className="text-4xl font-raleway-medium">Create A Wallet</Text>
        <Text className="font-raleway px-4 text-lg mt-4 text-center">
          Add your account basic details to create your account at Insfers
        </Text>
      </View>

      {/* Form */}
      <View className="w-full px-5 mt-10">
        {
          /* <FormInput
          name="username"
          label="Username"
          placeholder="Enter Username"
          leftIcon={<MaterialIcons name="person" size={20} color="gray" />}
          control={control}
          keyboardType="ascii-capable"
          rules={{ required: "Username is required" }}
        /> */
        }

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
          rules={{ required: "Confirm password is required" }}
        />

        <ButtonComponent
          label="Continue"
          isLoading={isLoading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>

      {/* Divider */}
      <View className="flex-row w-full items-center justify-center my-6 px-6 py-2">
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

      {/* Social Login */}
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
      </View>

      {/* Footer */}
      <View className="flex-row justify-center items-center w-full mb-8 mt-6">
        <Text className="font-raleway text-lg">Already have an account?</Text>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text className="font-raleway text-lg text-brand-600">Login</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
