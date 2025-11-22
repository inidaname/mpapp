/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../typo/AppText";

interface Props {
  title: string;
  body: string;
  onPress?: () => void;
  onHide?: () => void;
  visible: boolean;
}

const NotificationBanner: React.FC<Props> = ({
  title,
  body,
  visible,
  onHide,
  onPress,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          onHide && onHide();
        });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [visible, slideAnim, onHide]);

  return (
    <Animated.View
      className="absolute top-0 left-0 right-0 bg-white py-12 px-8 z-"
      style={{
        transform: [{ translateY: slideAnim }],
        // zIndex: 9999,
        elevation: 5,
      }}
    >
      <TouchableOpacity style={styles.touch} onPress={onPress}>
        <AppText className="text-brand-700" style={styles.title}>
          {title}
        </AppText>
        <AppText className="text-gray-800" style={styles.body}>
          {body}
        </AppText>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  touch: {
    paddingTop: 20,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
  body: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default NotificationBanner;
