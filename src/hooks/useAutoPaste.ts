import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";

interface Options {
  enabled?: boolean;
  onPaste?: (content: string) => void;
  validator?: (content: string) => void;
  checkOnMount?: boolean;
}

type UseAutoPaste = (options: Options) => {
  clipboardContent: string;
  clearContent: () => void;
  manualCheck: () => void;
};

/**
 * Custom hook for auto-pasting clipboard content when app comes to foreground
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Enable/disable auto-paste (default: true)
 * @param {Function} options.onPaste - Callback when content is pasted
 * @param {Function} options.validator - Function to validate clipboard content before pasting
 * @param {boolean} options.checkOnMount - Check clipboard when hook mounts (default: true)
 * @returns {Object} - { clipboardContent, clearContent, manualCheck }
 */
const useAutoPaste: UseAutoPaste = (options = {}) => {
  const {
    enabled = true,
    onPaste,
    validator,
    checkOnMount = true,
  } = options;

  const [clipboardContent, setClipboardContent] = useState("");
  const lastClipboardRef = useRef("");
  const appState = useRef(AppState.currentState);

  const checkClipboard = useCallback(async () => {
    if (!enabled) return;

    try {
      const content = await Clipboard.getString();

      // Check if content exists and is different from last check
      if (content && content !== lastClipboardRef.current) {
        // Validate content if validator function provided
        const isValid = validator ? validator(content) : true;

        if (isValid) {
          lastClipboardRef.current = content;
          setClipboardContent(content);

          // Call onPaste callback if provided
          if (onPaste) {
            onPaste(content);
          }
        }
      }
    } catch (error) {
      console.error("Error reading clipboard:", error);
    }
  }, [enabled, onPaste, validator]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      // When app comes to foreground
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
    // Check clipboard on mount if enabled
    if (checkOnMount) {
      checkClipboard();
    }

    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [checkClipboard, checkOnMount, handleAppStateChange]);

  // Clear clipboard content from state
  const clearContent = useCallback(() => {
    setClipboardContent("");
    lastClipboardRef.current = "";
  }, []);

  // Manual trigger to check clipboard
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
