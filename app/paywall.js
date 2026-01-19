import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import * as ScreenCapture from "expo-screen-capture";
import { setPremium } from "../utils/premium";

export default function PaywallScreen() {
  const { reason } = useLocalSearchParams();
  const [title, setTitle] = useState("Unlock Premium");

  useEffect(() => {
    ScreenCapture.preventScreenCaptureAsync();
    return () => ScreenCapture.allowScreenCaptureAsync();
  }, []);

  useEffect(() => {
    if (reason === "deep-dive") setTitle("Unlock Full Deep Dive");
    if (reason === "share-card") setTitle("Unlock Share Card");
  }, [reason]);

  async function unlock() {
    await setPremium(true);
    router.push("/premium-unlocked");
  }

  async function restore() {
    await setPremium(true);
    router.push("/premium-unlocked");
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>
        Get unlimited uploads, full Deep Dive analysis, extended archetypes,
        premium insights, and the shareable Reality Check card.
      </Text>

      <View style={styles.benefitCard}>
        <Text style={styles.benefit}>⭐ Unlimited uploads</Text>
        <Text style={styles.benefit}>⭐ Full Deep Dive breakdown</Text>
        <Text style={styles.benefit}>⭐ Extended texting archetype</Text>
        <Text style={styles.benefit}>⭐ Full takeaways & date meter</Text>
        <Text style={styles.benefit}>⭐ Personalized suggested reply</Text>
        <Text style={styles.benefit}>⭐ Shareable Reality Check card</Text>
      </View>

      <TouchableOpacity style={styles.unlockButton} onPress={unlock}>
        <Text style={styles.unlockText}>Unlock Premium</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.restoreButton} onPress={restore}>
        <Text style={styles.restoreText}>Restore Purchases</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Not Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2F38",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#E9C46A",
    textAlign: "center",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: "#E9C46A",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },

  benefitCard: {
    backgroundColor: "#264653",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },

  benefit: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },

  unlockButton: {
    backgroundColor: "#2A9D8F",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },

  unlockText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  restoreButton: {
    backgroundColor: "#1F2F38",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9C46A",
    marginBottom: 16,
  },

  restoreText: {
    color: "#E9C46A",
    fontSize: 16,
    fontWeight: "700",
  },

  back: {
    textAlign: "center",
    color: "#E9C46A",
    fontSize: 16,
    marginTop: 12,
  },
});

