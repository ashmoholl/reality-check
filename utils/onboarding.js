import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "reality_check_onboarding";

export async function setHasSeenOnboarding() {
  await AsyncStorage.setItem(KEY, "true");
}

export async function hasSeenOnboarding() {
  const value = await AsyncStorage.getItem(KEY);
  return value === "true";
}

