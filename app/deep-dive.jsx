import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import * as ScreenCapture from "expo-screen-capture";
import { isPremium } from "../utils/premium";

// Premium components
import PremiumBadge from "../components/PremiumBadge";
import LockedBadge from "../components/LockedBadge";
import PremiumTag from "../components/PremiumTag";

export default function DeepDiveScreen() {
  const { data } = useLocalSearchParams();
  const analysis = JSON.parse(data);

  const [premium, setPremium] = useState(false);

  // Animated vibe bar
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Screenshot protection (Deep Dive = always blocked)
  useEffect(() => {
    ScreenCapture.preventScreenCaptureAsync();
    return () => ScreenCapture.allowScreenCaptureAsync();
  }, []);

  useEffect(() => {
    async function load() {
      const p = await isPremium();
      setPremium(p);
    }
    load();
  }, []);

  // Animate vibe bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: analysis.vibe_score * 10,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, []);

  function getVibeColor(score) {
    if (score <= 3) return "#E76F51";
    if (score <= 6) return "#E9C46A";
    return "#2A9D8F";
  }

  const vibeColor = getVibeColor(analysis.vibe_score);

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Deep Dive</Text>
        {premium && <PremiumTag />}
      </View>

      <Text style={styles.subtitle}>Your full Reality Check breakdown</Text>

      {/* TEXTING STYLE ARCHETYPE */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Texting Style Archetype</Text>
          {!premium && <PremiumBadge />}
        </View>

        {/* Free: Basic archetype */}
        {!premium && (
          <Text style={styles.text}>{analysis.texting_style}</Text>
        )}

        {/* Premium: Extended archetype */}
        {premium && (
          <>
            <Text style={styles.text}>{analysis.texting_style}</Text>

            <View style={styles.subSection}>
              <Text style={styles.subLabel}>Traits</Text>
              <Text style={styles.text}>{analysis.archetype_traits}</Text>
            </View>

            <View style={styles.subSection}>
              <Text style={styles.subLabel}>Strengths</Text>
              <Text style={styles.text}>{analysis.archetype_strengths}</Text>
            </View>

            <View style={styles.subSection}>
              <Text style={styles.subLabel}>Weak Spots</Text>
              <Text style={styles.text}>{analysis.archetype_weaknesses}</Text>
            </View>

            <View style={styles.subSection}>
              <Text style={styles.subLabel}>When They Like You</Text>
              <Text style={styles.text}>{analysis.archetype_like_signals}</Text>
            </View>

            <View style={styles.subSection}>
              <Text style={styles.subLabel}>When They Pull Back</Text>
              <Text style={styles.text}>
                {analysis.archetype_pullback_signals}
              </Text>
            </View>

            <View style={styles.subSection}>
              <Text style={styles.subLabel}>Compatibility Snapshot</Text>
              <Text style={styles.text}>
                {analysis.archetype_compatibility}
              </Text>
            </View>
          </>
        )}

        {/* Free users: blur extended content */}
        {!premium && (
          <LockedBadge label="Unlock Full Archetype" />
        )}
      </View>

      {/* VIBE SCORE */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vibe Score</Text>
        </View>

        <View style={styles.meterBackground}>
          <Animated.View
            style={[
              styles.meterFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
                backgroundColor: vibeColor,
              },
            ]}
          />
        </View>

        <Text style={[styles.vibeNumber, { color: vibeColor }]}>
          {analysis.vibe_score}/10
        </Text>
      </View>

      {/* COMMUNICATION SNAPSHOT */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Communication Snapshot</Text>
          {!premium && <PremiumBadge />}
        </View>

        {/* Free: teaser */}
        {!premium && (
          <>
            <Text style={styles.text}>
              {analysis.takeaways?.split(".")[0] + "."}
            </Text>
            <LockedBadge label="Unlock Full Insights" />
          </>
        )}

        {/* Premium: full */}
        {premium && (
          <>
            <View style={styles.subSection}>
              <Text style={styles.subLabel}>Top 3 Takeaways</Text>
              <Text style={styles.text}>{analysis.takeaways}</Text>
            </View>

            <View style={styles.subSection}>
              <Text style={styles.subLabel}>Would We Date Them?</Text>
              <Text style={styles.text}>{analysis.date_meter}</Text>
            </View>

            <View style={styles.subSection}>
              <Text style={styles.subLabel}>Suggested Reply</Text>
              <Text style={styles.text}>{analysis.suggested_reply}</Text>
            </View>
          </>
        )}
      </View>

      {/* SHARE CARD PREVIEW */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Share Card Preview</Text>
          {!premium && <PremiumBadge />}
        </View>

        <Image
          source={require("../assets/sharecard-preview.png")}
          style={styles.previewImage}
        />

        {!premium && (
          <LockedBadge label="Unlock Share Card" />
        )}
      </View>

      {/* BUTTONS */}
      {premium ? (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.push({
              pathname: "/share-card",
              params: { data: JSON.stringify(analysis) },
            })
          }
        >
          <Text style={styles.primaryText}>Generate Share Card</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.push({
              pathname: "/paywall",
              params: { reason: "share-card" },
            })
          }
        >
          <Text style={styles.primaryText}>Unlock Premium</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#E9C46A",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#E9C46A",
    textAlign: "center",
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#264653",
    padding: 20,
    borderRadius: 18,
    marginBottom: 24,
    position: "relative",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#E9C46A",
  },

  text: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },

  subSection: {
    marginTop: 16,
  },

  subLabel: {
    color: "#E76F51",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
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
    marginTop: 12,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },

  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    opacity: 0.9,
  },

  primaryButton: {
    backgroundColor: "#2A9D8F",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },

  primaryText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  back: {
    textAlign: "center",
    color: "#E9C46A",
    fontSize: 16,
    marginTop: 12,
  },
});