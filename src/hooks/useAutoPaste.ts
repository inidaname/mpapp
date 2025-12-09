import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { UseAutoPaste } from "../types/types";

const isCryptoWalletAddress = (content: string): boolean => {
  const trimmed = content.trim();

  const evmRegex = /^0x[a-fA-F0-9]{40}$/;

  const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

  return evmRegex.test(trimmed) || solanaRegex.test(trimmed);
};

const useAutoPaste: UseAutoPaste = (options = {}) => {
  const {
    enabled = true,
    onPaste,
    validator = isCryptoWalletAddress,
    checkOnMount = true,
  } = options;

  const [clipboardContent, setClipboardContent] = useState("");
  const lastClipboardRef = useRef("");
  const appState = useRef(AppState.currentState);

  const checkClipboard = useCallback(async () => {
    if (!enabled) return;

    try {
      const content = await Clipboard.getString();

      if (content && content !== lastClipboardRef.current) {
        const isValid = validator(content);

        if (isValid) {
          lastClipboardRef.current = content;
          setClipboardContent(content);

          if (onPaste) {
            onPaste(content);
          }
        }
      }
    } catch (error) {
      console.log("Error reading clipboard:", error);
    }
  }, [enabled, onPaste, validator]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        checkClipboard();
      }
      appState.current = nextAppState;
    },
    [checkClipboard],
  );

  useEffect(() => {
    if (checkOnMount) {
      checkClipboard();
    }

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [checkClipboard, checkOnMount, handleAppStateChange]);

  const clearContent = useCallback(() => {
    setClipboardContent("");
    lastClipboardRef.current = "";
  }, []);

  const manualCheck = useCallback(() => {
    checkClipboard();
  }, [checkClipboard]);

  return {
    clipboardContent,
    clearContent,
    manualCheck,
  };
};

export default useAutoPaste;
