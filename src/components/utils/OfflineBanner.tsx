import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const OfflineBanner = () => {
  const [ isOffline, setIsOffline ] = useState(false);

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = state.isConnected === false ||
        (state.isConnected === true && state.isInternetReachable === false);

      setIsOffline(offline);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOffline ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [ animation, isOffline ]);

  const translateY = animation.interpolate({
    inputRange: [ 0, 1 ],
    outputRange: [ -100, 0 ],
  });

  // return (
  //   <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
  //     <SafeAreaView style={styles.safeArea}>
  //       <View style={styles.contentContainer}>
  //         <Text style={styles.text}>No Internet Connection</Text>
  //       </View>
  //     </SafeAreaView>
  //   </Animated.View>
  // );

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [ { translateY } ] },
      ]}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.text}>No Internet Connection</Text>
      </View>
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
    paddingTop: 50, // space for iOS status bar
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
