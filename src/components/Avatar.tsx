import { ActivityIndicator, Text, View } from "react-native";
import React, { useState } from "react";
import FastImage from "react-native-fast-image";

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ uri, name = "", size = 48 }) => {
  const [ loading, setLoading ] = useState(false);

  const initials = name
    ? name
      .split(" ")
      .map(n => n[ 0 ])
      .join("")
      .toUpperCase()
    : "?";

  return (
    <View
      style={{ width: size, height: size }}
      className="rounded-full bg-gray-200 items-center justify-center overflow-hidden"
    >
      {uri ? (
        <>
          <FastImage
            style={{ width: size, height: size }}
            source={{
              uri,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.cover}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => setLoading(false)}
          />

          {loading && (
            <ActivityIndicator
              size="small"
              style={{ position: "absolute" }}
            />
          )}
        </>
      ) : (
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
