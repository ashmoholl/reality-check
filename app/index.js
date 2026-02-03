import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { hasSeenOnboarding } from "../utils/onboarding";

export default function Index() {
  const [seen, setSeen] = useState(null);

  useEffect(() => {
    async function load() {
      const value = await hasSeenOnboarding();
      setSeen(value);
    }
    load();
  }, []);

  if (seen === null) return <Text>Loading...</Text>;

  return seen ? (
    <Redirect href="/home" />
  ) : (
    <Redirect href="/onboarding/screen1" />
  );
}