// components/PhoneNumberInput.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import { Controller, Control } from 'react-hook-form';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6"
import AppText from './typo/AppText';

interface PhoneInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  defaultCountry?: Country[ 'cca2' ]; // Example 'NG'
  rules?: object;
}

const PhoneNumberInput: React.FC<PhoneInputProps> = ({
  name,
  control,
  label,
  defaultCountry = 'NG',
  rules = {},
}) => {
  const [ countryCode, setCountryCode ] = useState<Country[ 'callingCode' ]>([ '234' ]);
  const [ countryCca2, setCountryCca2 ] = useState<Country[ 'cca2' ]>(defaultCountry);
  const [ visible, setVisible ] = useState(false);

  const onSelect = (country: Country) => {
    setCountryCode(country.callingCode || [ '' ]);
    setCountryCca2(country.cca2);
  };

  return (
    <View className="mb-4 w-full">
      {label && <AppText weight='semibold' className="mb-2 text-lg">{label}</AppText>}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <View
              className={`flex-row items-center border rounded-2xl px-3 py-3 ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
              <FontAwesome6 iconStyle='solid' name="phone" size={20} color="gray" className="mr-2" />

              {/* Country Picker */}
              <TouchableOpacity
                className="flex-row items-center mx-2"
                onPress={() => setVisible(true)}
              >
                <Text className="text-lg mr-1">+{countryCode}</Text>
                <FontAwesome6 iconStyle='solid' name="chevron-down" size={18} color="#215CE1" />
              </TouchableOpacity>
              <View className='opacity-0 w-0 h-0'>

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
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            </View>

            {error && (
              <Text className="text-xs text-red-500 mt-1">{error.message?.toString()}</Text>
            )}
          </>
        )}
      />
    </View>
  );
};

export default PhoneNumberInput;
