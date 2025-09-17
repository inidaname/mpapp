import type React from "react";
import { ActivityIndicator, GestureResponderEvent, Text } from "react-native";
import { Pressable } from "react-native";

interface Props {
  label: string;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  isLoading?: boolean;
}

const ButtonComponent: React.FC<Props> = ({ label, onPress, isLoading }) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-brand-700 h-16 rounded-2xl py-4 my-4 w-full justify-center items-center"
      disabled={isLoading}
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
