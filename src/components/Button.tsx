import type React from "react";
import { ActivityIndicator, GestureResponderEvent, Text } from "react-native";
import { Pressable } from "react-native";
import { twMerge } from "tailwind-merge";

interface Props {
  label: string;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  width?: string;
}

const ButtonComponent: React.FC<Props> = (
  { label, onPress, isLoading, isDisabled, className, width = "w-full" },
) => {
  return (
    <Pressable
      onPress={onPress}
      className={twMerge(
        className,
        `${
          isLoading || isDisabled ? "bg-brand-300" : "bg-brand-700"
        } h-16 rounded-2xl py-4 my-4 ${width} justify-center items-center mb-10`,
      )}
      disabled={isLoading || isDisabled}
      style={({ pressed }) => [
        pressed ? { opacity: 0.7, transform: [{ scale: 0.95 }] } : {},
        isLoading ? { opacity: 0.6 } : {},
      ]}
    >
      {isLoading
        ? <ActivityIndicator size="small" color="#fff" />
        : (
          <Text className="text-white text-2xl font-raleway-semibold">
            {label}
          </Text>
        )}
    </Pressable>
  );
};

export default ButtonComponent;
