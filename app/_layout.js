import * as Font from "expo-font";
import { useState, useEffect, useRef } from "react";
import { Text } from "react-native";
import { Stack } from "expo-router";

import CardRenderer from "../components/CardRenderer";
import { CardRendererContext } from "../context/CardRendererContext";

export default function RootLayout() {
  const [fontsReady, setFontsReady] = useState(false);
  const cardRendererRef = useRef(null);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Playfair: require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
      });
      setFontsReady(true);
    }
    loadFonts();
  }, []);

  if (!fontsReady) {
    return <Text>Loading...</Text>;
  }

  return (
    <CardRendererContext.Provider value={cardRendererRef}>
      <CardRenderer ref={cardRendererRef} />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="upload" />
        <Stack.Screen name="analyze" />
        <Stack.Screen name="results" />
        <Stack.Screen name="history" />
        <Stack.Screen name="paywall"
        options={{ headerShown: false, freezeOnBlu: false }} />
        <Stack.Screen name="modal" />
        <Stack.Screen name="premium-unlocked" />
        <Stack.Screen name="onboarding/screen1" />
        <Stack.Screen name="onboarding/screen2" />
        <Stack.Screen name="onboarding/screen3" />
        <Stack.Screen name="onboarding/screen4" />
      </Stack>
    </CardRendererContext.Provider>
  );
}