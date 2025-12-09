/* eslint-disable react-native/no-inline-styles */
import type React from "react";
import { ScrollView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SubmitHandler, useForm } from "react-hook-form";

import HeaderSide from "../components/Main/HeaderSide";
import ButtonComponent from "../components/Button";
import { RootStackParamList } from "../types/types";
import FormInput from "../components/FormInput";
import FormPicker from "../components/FormPicker"; // You'll need to create this component
import { useAddAccountMutation } from "../service/endpoints/external-accounts";
import { COUNTRIES, CURRENCIES, US_STATES } from "../data/country";

interface Props extends NativeStackScreenProps<RootStackParamList> {}

const AddBankScreen: React.FC<Props> = ({ navigation }) => {
  const { control, handleSubmit, formState: { isValid }, watch } = useForm<
    ExternalAccountInput
  >({
    defaultValues: {
      currency: "usd",
      address: {
        country: "USA",
      },
    },
  });
  const [addAccount, { isLoading }] = useAddAccountMutation();

  const selectedCountry = watch("address.country");

  const onSubmit: SubmitHandler<ExternalAccountInput> = async (data) => {
    const formValues = {
      ...data,
      account_owner_name: `${data.last_name} ${data.first_name}`,
      account_owner_type: "individual",
      account_type: "us",
      account: { ...data.account, checking_or_savings: "checking" },
    };

    console.log("formValues", formValues);

    try {
      const acct = await addAccount(formValues).unwrap();
      console.log("acct", acct);
      navigation.goBack();
    } catch (error) {
      console.log("error", error);
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
          {/* Account Information Section */}
          <View className="w-full mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Account Information
            </Text>

            <FormPicker
              name="currency"
              label="Currency"
              placeholder="Select Currency"
              control={control}
              options={CURRENCIES}
              rules={{ required: "Currency is required" }}
            />

            <FormInput
              name="account.account_number"
              label="Account Number"
              placeholder="Enter Account Number"
              control={control}
              keyboardType="number-pad"
              rules={{ required: "Account Number is required" }}
            />

            <FormInput
              name="account.routing_number"
              label="Routing Number"
              placeholder="Enter Routing Number"
              control={control}
              keyboardType="number-pad"
              rules={{
                required: "Routing Number is required",
                minLength: {
                  value: 9,
                  message: "Routing number must be 9 digits",
                },
                maxLength: {
                  value: 9,
                  message: "Routing number must be 9 digits",
                },
              }}
            />
          </View>

          {/* Account Owner Section */}
          <View className="w-full mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Account Owner
            </Text>

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
          </View>

          {/* Address Section */}
          <View className="w-full mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Address
            </Text>

            <FormInput
              name="address.street_line_1"
              label="Street Address"
              placeholder="Enter Street Address"
              control={control}
              rules={{ required: "Street Address is required" }}
            />

            <FormInput
              name="address.street_line_2"
              label="Apt, Suite, etc. (Optional)"
              placeholder="Apartment, Suite, Unit, etc."
              control={control}
            />

            <FormInput
              name="address.city"
              label="City"
              placeholder="Enter City"
              control={control}
              rules={{ required: "City is required" }}
            />

            <FormPicker
              name="address.country"
              label="Country"
              placeholder="Select Country"
              control={control}
              options={COUNTRIES}
              rules={{ required: "Country is required" }}
            />

            {selectedCountry === "US"
              ? (
                <FormPicker
                  name="address.state"
                  label="State"
                  placeholder="Select State"
                  control={control}
                  options={US_STATES}
                  rules={{ required: "State is required" }}
                />
              )
              : (
                <FormInput
                  name="address.state"
                  label="State/Province"
                  placeholder="Enter State/Province"
                  control={control}
                  rules={{ required: "State/Province is required" }}
                />
              )}

            <FormInput
              name="address.postal_code"
              label="Postal Code"
              placeholder="Enter Postal Code"
              control={control}
              keyboardType="default"
              rules={{ required: "Postal Code is required" }}
            />
          </View>
        </View>

        <View className="px-6 mb-4 pb-6">
          <ButtonComponent
            label="Add Bank Account"
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
