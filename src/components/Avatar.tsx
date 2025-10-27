import { Image, Text, View } from "react-native";
import React from "react";

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ uri, name = "", size = 48 }) => {
  const initials = name
    ? name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : "?";

  return (
    <View
      className="rounded-full bg-gray-200 items-center justify-center"
      style={{ width: size, height: size }}
    >
      {uri
        ? (
          <Image
            source={{ uri }}
            className="rounded-full"
            style={{ width: size, height: size }}
          />
        )
        : (
          <Text
            className="text-gray-700 font-semibold"
            style={{ fontSize: size / 2 }}
          >
            {initials}
          </Text>
        )}
    </View>
  );
};

export default Avatar;
