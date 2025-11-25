import React, { useEffect, useRef, useState } from "react";
import { Animated, SafeAreaView, StyleSheet, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const OfflineBanner = () => {
  // Start as "Online" (false) to prevent initial flicker
  const [isOffline, setIsOffline] = useState(false);

  // Use useRef for animation value so it persists properly
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // Logic:
      // 1. If isConnected is false -> DEFINITELY OFFLINE
      // 2. If isConnected is true BUT isInternetReachable is explicitly false -> OFFLINE
      // 3. If isInternetReachable is null (detecting), assume ONLINE for now.

      const offline = state.isConnected === false ||
        (state.isConnected === true && state.isInternetReachable === false);

      setIsOffline(offline);
    });

    return () => unsubscribe();
  }, []);

  // Separate useEffect to handle the Animation based on state change
  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOffline ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [animation, isOffline]); // Only re-run when isOffline changes

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0], // Starts hidden (-100), slides to 0
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>No Internet Connection</Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#b91c1c",
    zIndex: 9999,
    elevation: 10,
  },
  safeArea: {
    backgroundColor: "#b91c1c",
  },
  contentContainer: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default OfflineBanner;
