import AsyncStorage from "@react-native-async-storage/async-storage";

const PREMIUM_KEY = "premiumStatus";
const FREE_LIMIT = 3;
const WINDOW_HOURS = 24;

// ⭐ Check if user is premium
export async function isPremium() {
  const value = await AsyncStorage.getItem(PREMIUM_KEY);
  return value === "true";
}

// ⭐ Set premium status
export async function setPremium(value) {
  await AsyncStorage.setItem(PREMIUM_KEY, value ? "true" : "false");
}

// ⭐ Free usage logic
export async function canUseFreeUpload() {
  const data = await AsyncStorage.getItem("freeUsage");
  const parsed = data ? JSON.parse(data) : null;

  const now = Date.now();

  if (!parsed) {
    return { allowed: true, remaining: FREE_LIMIT };
  }

  if (now > parsed.resetAt) {
    return { allowed: true, remaining: FREE_LIMIT };
  }

  const remaining = FREE_LIMIT - parsed.count;
  return { allowed: remaining > 0, remaining };
}

export async function recordFreeUpload() {
  const data = await AsyncStorage.getItem("freeUsage");
  const parsed = data ? JSON.parse(data) : null;

  const now = Date.now();
  const resetAt = now + WINDOW_HOURS * 60 * 60 * 1000;

  if (!parsed || now > parsed.resetAt) {
    await AsyncStorage.setItem(
      "freeUsage",
      JSON.stringify({ count: 1, resetAt })
    );
  } else {
    await AsyncStorage.setItem(
      "freeUsage",
      JSON.stringify({
        count: parsed.count + 1,
        resetAt: parsed.resetAt,
      })
    );
  }
}

