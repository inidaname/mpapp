/* eslint-disable react-native/no-inline-styles */
import type React from "react";
import { ScrollView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SubmitHandler, useForm } from "react-hook-form";

import HeaderSide from "../components/Main/HeaderSide";
import ButtonComponent from "../components/Button";
import { RootStackParamList } from "../types/types";
import FormInput from "../components/FormInput";
import { useAddAccountMutation } from "../service/endpoints/external-accounts";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const AddBankScreen: React.FC<Props> = ({ navigation }) => {
  const { control, handleSubmit, formState: { isValid } } = useForm<
    ExternalAccountInput
  >();
  const [addAccount, { isLoading }] = useAddAccountMutation();

  const onSubmit: SubmitHandler<ExternalAccountInput> = async (data) => {
    const formValues = {
      ...data,
      account_owner_name: `${data.last_name} ${data.first_name}`,
      account_owner_type: "individual",
      account_type: "us",
      account: { ...data.account, checking_or_savings: "checking" },
    };

    try {
      await addAccount(formValues).unwrap();
      navigation.goBack();
    } catch (error) {
      console.log("error", error);
      navigation.goBack();
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
        contentContainerStyle={{ flex: 1 }}
        className="bg-white px-0 w-full"
      >
        <HeaderSide heading="Add Bank Account" isWithBack />
        <View className="w-full px-6 justify-start items-center flex-1 py-4 mt-8">
          {/* Currency */}
          <FormInput
            name="currency"
            label="Currency"
            placeholder="Enter Currency (e.g. USD)"
            control={control}
            rules={{ required: "Currency is required" }}
          />

          {/* Owner Info */}
          {
            /* <FormInput
            name="account_owner_name"
            label="Account Owner Name"
            placeholder="Enter Owner Name"
            control={control}
            rules={{ required: "Account Owner Name is required" }}
          />
          <FormInput
            name="account_owner_type"
            label="Owner Type"
            placeholder="Enter Owner Type (individual/business)"
            control={control}
            rules={{ required: "Owner Type is required" }}
          /> */
          }
          <FormInput
            name="first_name"
            label="First Name"
            placeholder="Enter First Name"
            control={control}
            rules={{ required: "First Name is required" }}
          />
          <FormInput
            name="last_name"
            label="Last Name"
            placeholder="Enter Last Name"
            control={control}
            rules={{ required: "Last Name is required" }}
          />
          {
            /* <FormInput
            name="business_name"
            label="Business Name"
            placeholder="Enter Business Name"
            control={control}
          /> */
          }
          {
            /* <FormInput
            name="account_type"
            label="Account Type"
            placeholder="Enter Account Type (e.g. US)"
            control={control}
            rules={{ required: "Account Type is required" }}
          /> */
          }

          {/* Address */}
          <FormInput
            name="address.street_line_1"
            label="Street Line 1"
            placeholder="Enter Street Line 1"
            control={control}
            rules={{ required: "Street Line 1 is required" }}
          />
          <FormInput
            name="address.street_line_2"
            label="Street Line 2"
            placeholder="Enter Street Line 2"
            control={control}
          />
          <FormInput
            name="address.city"
            label="City"
            placeholder="Enter City"
            control={control}
            rules={{ required: "City is required" }}
          />
          <FormInput
            name="address.state"
            label="State"
            placeholder="Enter State"
            control={control}
            rules={{ required: "State is required" }}
          />
          <FormInput
            name="address.postal_code"
            label="Postal Code"
            placeholder="Enter Postal Code"
            control={control}
            rules={{ required: "Postal Code is required" }}
          />
          <FormInput
            name="address.country"
            label="Country"
            placeholder="Enter Country"
            control={control}
            rules={{ required: "Country is required" }}
          />

          {/* Account Info */}
          <FormInput
            name="account.account_number"
            label="Account Number"
            placeholder="Enter Account Number"
            control={control}
            rules={{ required: "Account Number is required" }}
          />
          <FormInput
            name="account.routing_number"
            label="Routing Number"
            placeholder="Enter Routing Number"
            control={control}
            rules={{ required: "Routing Number is required" }}
          />
          {
            /* <FormInput
            name="account.checking_or_savings"
            label="Checking or Savings"
            placeholder="Enter Account Type (checking/savings)"
            control={control}
            rules={{ required: "Checking or Savings is required" }}
          /> */
          }
        </View>

        <View className="px-6 mb-4">
          <ButtonComponent
            label="Add"
            isLoading={isLoading}
            isDisabled={!isValid}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default AddBankScreen;
