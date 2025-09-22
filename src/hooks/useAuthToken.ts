import { useCallback, useEffect, useState } from "react";
import * as Keychain from "react-native-keychain";
import { SERVICE_NAME } from "../config/TOKEN";

export function useAuthToken() {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token on mount
  useEffect(() => {
    (async () => {
      try {
        const creds = await Keychain.getGenericPassword({
          service: SERVICE_NAME,
        });
        if (creds) setTokenState(creds.password);
      } catch (err) {
        console.error("Failed to load token", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Save token
  const saveToken = useCallback(async (newToken: string) => {
    try {
      await Keychain.setGenericPassword(SERVICE_NAME, newToken, {
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        service: SERVICE_NAME,
      });
      setTokenState(newToken);
    } catch (err) {
      console.error("Failed to save token", err);
    }
  }, []);

  // Delete token
  const deleteToken = useCallback(async () => {
    try {
      await Keychain.resetGenericPassword({ service: SERVICE_NAME });
      setTokenState(null);
    } catch (err) {
      console.error("Failed to delete token", err);
    }
  }, []);

  return { token, loading, saveToken, deleteToken };
}
