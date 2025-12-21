import { Text, View } from "react-native";
import React from "react";
import FastImage from 'react-native-fast-image';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ uri, name = "", size = 48 }) => {
  FastImage.preload([
    { uri },
  ]);

  const initials = name
    ? name
      .split(" ")
      .map((n) => n[ 0 ])
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
          <FastImage
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ width: size, height: size, borderRadius: 72 }}
            source={{
              uri: uri,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.cover}
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
