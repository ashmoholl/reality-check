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

// Premium components
import PremiumBadge from "../components/PremiumBadge";
import LockedBadge from "../components/LockedBadge";
import PremiumTag from "../components/PremiumTag";

export default function ShareCardScreen() {
  const { data } = useLocalSearchParams();
  const analysis = JSON.parse(data);

  const [premium, setPremium] = useState(false);
  const viewShotRef = useRef(null);

  // Slide-up animation for premium users
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Screenshot logic:
  // ❌ Free users: blocked
  // ✅ Premium users: allowed ONLY here
  useEffect(() => {
    async function protect() {
      const p = await isPremium();
      setPremium(p);

      if (!p) {
        await ScreenCapture.preventScreenCaptureAsync();
      } else {
        await ScreenCapture.allowScreenCaptureAsync();
      }
    }
    protect();

    return () => ScreenCapture.preventScreenCaptureAsync();
  }, []);

  // Animate card reveal for premium users
  useEffect(() => {
    if (premium) {
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
  }, [premium]);

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

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Share Card</Text>
        {premium && <PremiumTag />}
      </View>

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

            {/* Premium Badge inside card header */}
            <View style={styles.cardHeader}>
              <Text style={styles.badgeText}>Reality Check</Text>
              {premium && <PremiumBadge />}
            </View>

            {/* Score */}
            <Text style={styles.score}>{analysis.score ?? "—"}</Text>

            {/* Summary */}
            <Text style={styles.summary}>{analysis.summary}</Text>

            {/* Texting Style */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>Texting Style</Text>
              </View>
              <Text style={styles.value}>{analysis.texting_style}</Text>
            </View>

            {/* Vibe Score */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>Vibe Score</Text>
              </View>

              <View style={styles.meterBackground}>
                <View
                  style={[
                    styles.meterFill,
                    {
                      width: `${analysis.vibe_score * 10}%`,
                      backgroundColor:
                        analysis.vibe_score <= 3
                          ? "#E76F51"
                          : analysis.vibe_score <= 6
                          ? "#E9C46A"
                          : "#2A9D8F",
                    },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.vibeNumber,
                  {
                    color:
                      analysis.vibe_score <= 3
                        ? "#E76F51"
                        : analysis.vibe_score <= 6
                        ? "#E9C46A"
                        : "#2A9D8F",
                  },
                ]}
              >
                {analysis.vibe_score}/10
              </Text>
            </View>

            {/* Top 3 Takeaways */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>Top 3 Takeaways</Text>
                {!premium && <PremiumBadge />}
              </View>

              {premium ? (
                <Text style={styles.value}>{analysis.takeaways}</Text>
              ) : (
                <LockedBadge label="Unlock Full Takeaways" />
              )}
            </View>

            {/* Would We Date Them? */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>Would We Date Them?</Text>
                {!premium && <PremiumBadge />}
              </View>

              {premium ? (
                <Text style={styles.value}>{analysis.date_meter}</Text>
              ) : (
                <LockedBadge label="Unlock This Insight" />
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
          onPress={() =>
            router.push({
              pathname: "/paywall",
              params: { reason: "share-card" },
            })
          }
        >
          <Text style={styles.unlockText}>Unlock Shareable Card</Text>
        </TouchableOpacity>
      )}

      {/* Back */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/deep-dive",
            params: { data: JSON.stringify(analysis) },
          })
        }
      >
        <Text style={styles.back}>← Back to Deep Dive</Text>
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#264653",
    textAlign: "center",
  },

  card: {
    width: "100%",
    backgroundColor: "#264653",
    padding: 28,
    borderRadius: 20,
    position: "relative",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  badgeText: {
    color: "#E9C46A",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
    marginRight: 8,
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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  label: {
    color: "#E76F51",
    fontSize: 14,
    fontWeight: "700",
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
  },

  vibeNumber: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "800",
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