import * as Keychain from "react-native-keychain";

const SERVICE_NAME = "insfersAuth_token";

// Save token
export async function saveToken(token: string) {
  return Keychain.setGenericPassword(SERVICE_NAME, token, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    service: SERVICE_NAME,
  });
}

// Get token
export async function getAppToken() {
  const creds = await Keychain.getGenericPassword({ service: SERVICE_NAME });
  return creds ? creds.password : null;
}

// Delete token
export async function deleteAppToken() {
  return Keychain.resetGenericPassword({ service: SERVICE_NAME });
}
