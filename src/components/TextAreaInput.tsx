import type React from "react";
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";
import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";

interface FormInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate"
  >;
  keyboardType?: KeyboardTypeOptions | undefined;
}

const TextAreaInput: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  placeholder,
  keyboardType,
  rules = {},
}) => {
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
              <TextInput
                placeholder={placeholder}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType={keyboardType}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
                className="flex-1 text-[18px] h-44 text-black font-raleway self-end text-base"
              />
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

export default TextAreaInput;
