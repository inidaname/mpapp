import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, KeyboardTypeOptions } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

interface FormInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  leftIcon?: React.ReactElement;
  isPassword?: boolean;
  rules?: object;
  keyboardType?: KeyboardTypeOptions | undefined
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  placeholder,
  leftIcon,
  isPassword,
  keyboardType,
  rules = {},
}) => {
  const [ hide, setHide ] = useState(isPassword);

  return (
    <View className="mb-4 w-full">
      {label && <Text className="mb-3 text-lg font-raleway">{label}</Text>}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View
              className={`flex-row items-center border rounded-3xl px-4 ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
              {leftIcon && <View className="mr-2">{leftIcon}</View>}

              <TextInput
                placeholder={placeholder}
                secureTextEntry={hide}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType={keyboardType}
                className="flex-1 h-16 text-[18px] font-raleway self-end text-base"
              />

              {isPassword && (
                <TouchableOpacity onPress={() => setHide(prev => !prev)}>
                  {hide ? (
                    <FontAwesome6 name='eye-slash' size={20} color="#1E3A8A" /> // dark blue
                  ) : (
                    <FontAwesome6 name='eye' size={20} color="#1E3A8A" />
                  )}
                </TouchableOpacity>
              )}
            </View>

            {error && (
              <Text className="mt-1 text-xs font-raleway text-red-500">
                {error.message?.toString()}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
};

export default FormInput;
