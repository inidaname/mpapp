import type React from "react";
// import { useState } from "react";

import { /* Modal, TouchableOpacity, */ View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";

import HeaderSide from "../components/Main/HeaderSide";

import ButtonComponent from "../components/Button";
import { RootStackParamList } from "../types/types";
import FormInput from "../components/FormInput";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const AddBankScreen: React.FC<Props> = () => {
  // const [amount, setAmount] = useState("");
  // const [successVisible, setSuccessVisible] = useState(false);
  const { control } = useForm();

  return (
    <View className="flex-1 w-full bg-white">
      <HeaderSide heading="Add Bank Account" isWithBack />
      <View className="w-full px-6 justify-start items-center flex-1 py-4 mt-8">
        <FormInput
          name="bank_name"
          label="Bank Name"
          placeholder="Enter Bank Name"
          control={control}
          keyboardType="default"
          rules={{ required: "Bank Name is required" }}
        />
        <FormInput
          name="holder_name"
          label="Account Holder Name"
          placeholder="Enter Account Holder Name"
          control={control}
          keyboardType="default"
          rules={{ required: "Account Holder Name is required" }}
        />
        <FormInput
          name="account_number"
          label="Account Number"
          placeholder="Enter Account Number"
          control={control}
          keyboardType="default"
          rules={{ required: "Account Number is required" }}
        />
        <FormInput
          name="iban_number"
          label="IBAN Number"
          placeholder="Enter IBAN Number"
          control={control}
          keyboardType="default"
          rules={{ required: "IBAN Number is required" }}
        />
      </View>
      <View className="px-6 mb-4">
        <ButtonComponent label="Add" />
      </View>
    </View>
  );
};

export default AddBankScreen;
