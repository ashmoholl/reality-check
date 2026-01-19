import AsyncStorage from "@react-native-async-storage/async-storage";

const PREMIUM_KEY = "premiumStatus";
const FREE_USAGE_KEY = "freeUsage";
const FREE_LIMIT = 3;
const WINDOW_HOURS = 24;

/* -------------------------------------------------------
   ⭐ PREMIUM STATUS
------------------------------------------------------- */

// Check if user is premium
export async function isPremium() {
  const value = await AsyncStorage.getItem(PREMIUM_KEY);
  return value === "true";
}

// Set premium status
export async function setPremium(value) {
  await AsyncStorage.setItem(PREMIUM_KEY, value ? "true" : "false");
}

export async function restorePremium() {
  await AsyncStorage.setItem(PREMIUM_KEY, "true");
  return true;
}
/* -------------------------------------------------------
   ⭐ FREE UPLOAD LIMIT (3 per 24 hours)
------------------------------------------------------- */

export async function canUseFreeUpload() {
  const data = await AsyncStorage.getItem(FREE_USAGE_KEY);
  const parsed = data ? JSON.parse(data) : null;

  const now = Date.now();

  // No record yet → allow full free limit
  if (!parsed) {
    return { allowed: true, remaining: FREE_LIMIT };
  }

  // Window expired → reset free usage
  if (now > parsed.resetAt) {
    return { allowed: true, remaining: FREE_LIMIT };
  }

  const remaining = FREE_LIMIT - parsed.count;
  return { allowed: remaining > 0, remaining };
}

export async function recordFreeUpload() {
  const data = await AsyncStorage.getItem(FREE_USAGE_KEY);
  const parsed = data ? JSON.parse(data) : null;

  const now = Date.now();
  const resetAt = now + WINDOW_HOURS * 60 * 60 * 1000;

  // First upload or window expired
  if (!parsed || now > parsed.resetAt) {
    await AsyncStorage.setItem(
      FREE_USAGE_KEY,
      JSON.stringify({ count: 1, resetAt })
    );
  } else {
    await AsyncStorage.setItem(
      FREE_USAGE_KEY,
      JSON.stringify({
        count: parsed.count + 1,
        resetAt: parsed.resetAt,
      })
    );
  }
}

/* -------------------------------------------------------
   ⭐ UTILITIES FOR PREMIUM GATING
------------------------------------------------------- */

// Force redirect if user is not premium
export async function requirePremium(navigationCallback) {
  const premium = await isPremium();
  if (!premium) {
    navigationCallback();
    return false;
  }
  return true;
}

// Reset free usage (for debugging or dev tools)
export async function resetFreeUsage() {
  await AsyncStorage.removeItem(FREE_USAGE_KEY);
}