import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";

interface FormInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  leftIcon?: React.ReactElement;
  isPassword?: boolean;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate"
  >;
  keyboardType?: KeyboardTypeOptions | undefined;
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
  const [hide, setHide] = useState(isPassword);

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
              className={`flex-row items-center border rounded-3xl px-4 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            >
              {leftIcon && <View className="mr-2">{leftIcon}</View>}

              <TextInput
                placeholder={placeholder}
                secureTextEntry={hide}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType={keyboardType}
                className="flex-1 h-16 text-[18px] text-black font-raleway self-end text-base"
              />

              {isPassword && (
                <TouchableOpacity onPress={() => setHide((prev) => !prev)}>
                  {hide
                    ? (
                      <MaterialIcons
                        name="visibility-off"
                        size={20}
                        color="#1E3A8A"
                      /> // dark blue
                    )
                    : (
                      <MaterialIcons
                        name="visibility"
                        size={20}
                        color="#1E3A8A"
                      />
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
