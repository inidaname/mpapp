import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import this
import { useAppDispatch } from '../store/redux';
import {
  clearCopyContent,
  setCopyContent,
} from '../store/reducers/copycontent-slice';

const STORAGE_KEY = '@last_pasted_address';

const isCryptoWalletAddress = (content: string): boolean => {
  const trimmed = content.trim();
  const evmRegex = /^0x[a-fA-F0-9]{40}$/;
  const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return evmRegex.test(trimmed) || solanaRegex.test(trimmed);
};

export const useAutoPaste = (options: any = {}) => {
  const {
    enabled = true,
    validator = isCryptoWalletAddress,
    checkOnMount = true,
  } = options;

  const [clipboardContent, setClipboardContent] = useState<string>('');
  const appState = useRef(AppState.currentState);
  const dispatch = useAppDispatch();

  const checkClipboard = useCallback(async () => {
    if (!enabled) return;

    try {
      const content = await Clipboard.getString();
      const trimmedContent = content.trim();

      if (!trimmedContent) return;

      const isValid = validator(trimmedContent);
      if (!isValid) return;

      const lastConsumed = await AsyncStorage.getItem(STORAGE_KEY);

      if (lastConsumed === trimmedContent) {
        return;
      }

      dispatch(setCopyContent(trimmedContent));
      setClipboardContent(trimmedContent);
    } catch (error) {
      console.log('Error reading clipboard:', error);
    }
  }, [enabled, validator, dispatch]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
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
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [checkClipboard, checkOnMount, handleAppStateChange]);

  const clearContent = useCallback(async () => {
    try {
      const content = await Clipboard.getString();
      const trimmed = content.trim();

      if (trimmed) {
        await AsyncStorage.setItem(STORAGE_KEY, trimmed);
      }

      setClipboardContent('');
      dispatch(clearCopyContent());
    } catch (error) {
      console.log('Error clearing content:', error);
    }
  }, [dispatch]);

  return {
    clipboardContent,
    clearContent,
  };
};

export default useAutoPaste;
