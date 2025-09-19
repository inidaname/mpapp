// authStorage.ts
import * as Keychain from "react-native-keychain";

// Save JWT token
export async function saveToken(token: string) {
  const tokenSet = await Keychain.setGenericPassword(process.env.TOKEN_NAME!, token, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });

  console.log('tokenSet', tokenSet)
}

// Get JWT token
export async function getToken() {
  const creds = await Keychain.getGenericPassword();
  return creds ? creds.password : null;
}

// Delete JWT token
export async function deleteToken() {
  await Keychain.resetGenericPassword();
}
