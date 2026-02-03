// components/ShareButton.js
import React, { useEffect, useState, useContext } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { isPremium } from "../utils/premium";
import { CardRendererContext } from "../context/CardRendererContext";

export default function ShareButton({ data, paywall }) {
  const [premium, setPremium] = useState(false);

  // Get global renderer ref
  const cardRendererRef = useContext(CardRendererContext);

  useEffect(() => {
    async function load() {
      const p = await isPremium();
      setPremium(p);
    }
    load();
  }, []);

  const handlePress = () => {
    if (!premium) {
      paywall();
      return;
    }

    // Call global renderer
    cardRendererRef?.current?.renderAndShare(data);
  };

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <Text style={styles.icon}>⤴</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
  },
  icon: {
    fontSize: 28,
    color: "#3A3A3A",
    opacity: 0.7,
  },
});