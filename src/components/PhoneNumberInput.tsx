// components/PhoneNumberInput.tsx
import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import CountryPicker, { Country, getCallingCode } from "react-native-country-picker-modal";
import { Control, Controller } from "react-hook-form";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { getCountry, } from 'react-native-localize';


import AppText from "./typo/AppText";

interface PhoneInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  defaultCountry?: Country[ "cca2" ]; // Example 'NG'
  rules?: object;
}

const PhoneNumberInput: React.FC<PhoneInputProps> = ({
  name,
  control,
  label,
  rules = {},
}) => {
  const country = getCountry()

  const [ countryCode, setCountryCode ] = useState<Country[ "callingCode" ]>();
  const [ countryCca2, setCountryCca2 ] = useState<Country[ "cca2" ]>(
    country as Country[ "cca2" ],
  );
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    const codes = async () => {

      const callingCode = await getCallingCode(country as Country[ "cca2" ])
      setCountryCode([ callingCode ])
      console.log('callingCode', callingCode)
    }
    codes()
  }, [ country ])

  const onSelect = (value: Country) => {
    setCountryCode(value.callingCode || [ "" ]);
    setCountryCca2(value.cca2);
  };

  return (
    <View className="mb-4 w-full">
      {label && (
        <AppText weight="semibold" className="mb-2 text-lg">
          {label}
        </AppText>
      )}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={(
          { field: { onChange, onBlur, value }, fieldState: { error } },
        ) => {
          // Extract local number from current value (optional)
          const localValue = value ? value.replace(`+${countryCode}`, "") : "";

          return (
            <>
              <View
                className={`flex-row items-center border rounded-2xl px-3 py-3 ${error ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <MaterialIcons
                  name="call"
                  size={20}
                  color="gray"
                  className="mr-2"
                />

                {/* Country Picker */}
                <TouchableOpacity
                  className="flex-row items-center mx-2"
                  onPress={() => setVisible(true)}
                >
                  <AppText className="text-lg mr-1">+{countryCode}</AppText>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={18}
                    color="#215CE1"
                  />
                </TouchableOpacity>
                <View className="opacity-0 w-0 h-0">
                  <CountryPicker
                    withFilter
                    withFlag
                    withCallingCode
                    withCountryNameButton={false}
                    onSelect={onSelect}
                    visible={visible}
                    countryCode={countryCca2}
                    onClose={() => setVisible(false)}
                  />
                </View>

                {/* Divider */}
                <View className="h-6 w-px bg-gray-300 mx-2" />

                {/* Text Input */}
                <TextInput
                  className="flex-1 text-base"
                  placeholder="Enter Phone Number"
                  keyboardType="phone-pad"
                  value={localValue}
                  onChangeText={(text) =>
                    onChange(`+${countryCode}${text.replace(/^0+/, "")}`)}
                  onBlur={onBlur}
                />
              </View>

              {error && (
                <AppText className="text-xs text-red-500 mt-1">
                  {error.message?.toString()}
                </AppText>
              )}
            </>
          );
        }}
      />
    </View>
  );
};

export default PhoneNumberInput;
