import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import * as ScreenCapture from "expo-screen-capture";
import { isPremium } from "../utils/premium";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

export default function ShareCardScreen() {
  const { data } = useLocalSearchParams();
  const analysis = JSON.parse(data);

  const [premium, setPremium] = useState(false);
  const viewShotRef = useRef(null);

  // Slide-up animation for premium users
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    ScreenCapture.preventScreenCaptureAsync();
    return () => ScreenCapture.allowScreenCaptureAsync();
  }, []);

  useEffect(() => {
    async function load() {
      const p = await isPremium();
      setPremium(p);

      if (p) {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
    load();
  }, []);

  async function saveOrShare() {
    try {
      const uri = await viewShotRef.current.capture();
      const fileUri = FileSystem.cacheDirectory + "share-card.png";

      await FileSystem.copyAsync({ from: uri, to: fileUri });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Saved", "Your card has been saved to your device.");
      }
    } catch (err) {
      console.log("SHARE ERROR:", err);
      Alert.alert("Error", "Something went wrong saving your card.");
    }
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateY: premium ? slideAnim : 0 }],
          opacity: premium ? opacityAnim : 1,
        }}
      >
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 1 }}
          style={{ width: "100%" }}
        >
          <View style={styles.card}>
            {/* Header */}
            <Text style={styles.header}>REALITY CHECK</Text>

            {/* Score */}
            <Text style={styles.score}>{analysis.score ?? "—"}</Text>

            {/* Summary */}
            <Text style={styles.summary}>{analysis.summary}</Text>

            {/* Viral Add-On A: Emoji Cues */}
            <View style={styles.section}>
              <Text style={styles.label}>Vibe Emojis</Text>
              <Text style={styles.value}>{analysis.emojis}</Text>
            </View>

            {/* Viral Add-On B: Vibe Meter */}
            <View style={styles.section}>
              <Text style={styles.label}>Vibe Score</Text>
              <View style={styles.meterBackground}>
                <View
                  style={[
                    styles.meterFill,
                    { width: `${analysis.vibe_score}%` },
                  ]}
                />
              </View>
            </View>

            {/* Premium Add-On C: Top 3 Takeaways */}
            <View style={styles.section}>
              <Text style={styles.label}>Top 3 Takeaways</Text>

              {premium ? (
                <Text style={styles.value}>{analysis.takeaways}</Text>
              ) : (
                <View style={styles.lockedBox}>
                  <Text style={styles.lockedText}>🔒 Premium Feature</Text>
                </View>
              )}
            </View>

            {/* Premium Add-On D: Would We Date Them? */}
            <View style={styles.section}>
              <Text style={styles.label}>Would We Date Them?</Text>

              {premium ? (
                <Text style={styles.value}>{analysis.date_meter}</Text>
              ) : (
                <View style={styles.lockedBox}>
                  <Text style={styles.lockedText}>🔒 Premium Feature</Text>
                </View>
              )}
            </View>

            {/* Footer */}
            <Text style={styles.footer}>@RealityCheck</Text>
          </View>
        </ViewShot>
      </Animated.View>

      {/* Buttons */}
      {premium ? (
        <TouchableOpacity style={styles.saveButton} onPress={saveOrShare}>
          <Text style={styles.saveText}>Save / Share</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.unlockButton}
          onPress={() => router.push("/paywall")}
        >
          <Text style={styles.unlockText}>Unlock Shareable Card</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E9D8",
    padding: 24,
  },

  card: {
    width: "100%",
    backgroundColor: "#264653",
    padding: 28,
    borderRadius: 20,
  },

  header: {
    color: "#E9C46A",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 12,
  },

  score: {
    color: "#FF6F61",
    fontSize: 48,
    fontWeight: "900",
    marginBottom: 16,
  },

  summary: {
    color: "white",
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 24,
  },

  section: {
    marginBottom: 22,
  },

  label: {
    color: "#E76F51",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  value: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },

  meterBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#1F2F38",
    borderRadius: 6,
    overflow: "hidden",
  },

  meterFill: {
    height: "100%",
    backgroundColor: "#2A9D8F",
  },

  lockedBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  lockedText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontWeight: "600",
  },

  footer: {
    marginTop: 30,
    color: "#E9C46A",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
  },

  unlockButton: {
    marginTop: 20,
    backgroundColor: "#E76F51",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  unlockText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  saveButton: {
    marginTop: 20,
    backgroundColor: "#2A9D8F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  back: {
    marginTop: 20,
    textAlign: "center",
    color: "#264653",
    fontSize: 16,
  },
});