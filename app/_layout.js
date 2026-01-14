import { Stack, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { hasSeenOnboarding } from "../utils/onboarding";

export default function RootLayout() {
  const [seen, setSeen] = useState(null);

  useEffect(() => {
    async function check() {
      const value = await hasSeenOnboarding();
      console.log("ONBOARDING FLAG:", value);
      setSeen(value);
    }
    check();
  }, []);

  if (seen === null) return null;

  return (
    <>
      {seen ? (
        <Redirect href="/" />
      ) : (
        <Redirect href="/onboarding/screen1" />
      )}

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding/screen1" />
        <Stack.Screen name="onboarding/screen2" />
        <Stack.Screen name="onboarding/screen3" />
        <Stack.Screen name="onboarding/screen4" />

        <Stack.Screen name="index" />
        <Stack.Screen name="upload" />
        <Stack.Screen name="analyze" />
        <Stack.Screen name="results" />
        <Stack.Screen name="history" />
        <Stack.Screen name="paywall" />
        <Stack.Screen name="modal" />
      </Stack>
    </>
  );
}
