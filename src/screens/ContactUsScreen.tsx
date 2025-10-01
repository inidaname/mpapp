/* eslint-disable react-native/no-inline-styles */
import type React from "react";

import { ScrollView, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullNavStack } from "../types/types";
import HeaderSide from "../components/Main/HeaderSide";
import { useForm } from "react-hook-form";
import FormInput from "../components/FormInput";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import TextAreaInput from "../components/TextAreaInput";
import ButtonComponent from "../components/Button";

interface Props extends NativeStackScreenProps<FullNavStack> {}

const ContactUsScreen: React.FC<Props> = () => {
  const { control } = useForm();
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      contentContainerClassName="bg-white flex-col justify-between items-start"
      keyboardShouldPersistTaps="handled"
    >
      <View className="w-full">
        <HeaderSide heading="Contact Us" isWithBack />
        <View className="w-full px-6 mt-10">
          <FormInput
            name="usename"
            label="Username"
            control={control}
            leftIcon={
              <MaterialIcons name="person" size={20} color={"#14141480"} />
            }
          />
          <FormInput
            name="email"
            label="Email Address"
            control={control}
            leftIcon={
              <MaterialIcons name="mail" color={"#14141480"} size={20} />
            }
          />
          <TextAreaInput
            name="message"
            label="Message"
            control={control}
          />
        </View>
      </View>
      <View className="w-full px-6 items-center">
        <ButtonComponent label="Send" />
      </View>
    </ScrollView>
  );
};

export default ContactUsScreen;
