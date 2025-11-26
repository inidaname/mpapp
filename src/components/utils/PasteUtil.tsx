import React, { useEffect, useState } from "react";
import {
  Alert,
  AppState,
  AppStateStatus,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";

const AutoPasteScreen = () => {
  const [inputValue, setInputValue] = useState("");
  const [lastClipboard, setLastClipboard] = useState("");

  useEffect(() => {
    // Check clipboard when component mounts
    checkAndPasteClipboard();

    // Listen to app state changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    // When app comes to foreground
    if (nextAppState === "active") {
      await checkAndPasteClipboard();
    }
  };

  const checkAndPasteClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getString();

      // Only paste if there's content and it's different from last time
      if (clipboardContent && clipboardContent !== lastClipboard) {
        setLastClipboard(clipboardContent);
        setInputValue(clipboardContent);

        // Optional: Show confirmation
        Alert.alert(
          "Content Pasted",
          "Clipboard content has been automatically pasted",
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      console.error("Error reading clipboard:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auto Paste Demo</Text>
      <Text style={styles.subtitle}>
        Copy something and return to this app
      </Text>

      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={setInputValue}
        placeholder="Content will auto-paste here..."
        multiline
      />

      <Text style={styles.hint}>
        The input will automatically fill with clipboard content when you return
        to the app
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
  hint: {
    marginTop: 15,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default AutoPasteScreen;

// SETUP REQUIRED:
// 1. Install clipboard package:
//    npm install @react-native-clipboard/clipboard
//    or
//    yarn add @react-native-clipboard/clipboard
//
// 2. For iOS: cd ios && pod install
//
// 3. Add permissions to AndroidManifest.xml (optional, for Android 10+):
//    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
