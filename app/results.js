import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState, useRef, useContext } from "react";
import * as ScreenCapture from "expo-screen-capture";
import * as Clipboard from "expo-clipboard";
import { isPremium } from "../utils/premium";
import { getVibeLabel, getVibeDescription } from "../utils/vibeScale";

import PremiumBadge from "../components/PremiumBadge";
import LockedBadge from "../components/LockedBadge";
import PremiumTag from "../components/PremiumTag";
import ShareButton from "../components/ShareButton";
import { CardRendererContext } from "../context/CardRendererContext";

export default function ResultsScreen() {
  const { data } = useLocalSearchParams();

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: "#264653", fontSize: 18 }}>
          No analysis data found.
        </Text>
        <TouchableOpacity onPress={() => router.push("/upload")}>
          <Text style={{ marginTop: 20, color: "#2A9D8F" }}>
            Go back to upload
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  let analysis = {};
  try {
    analysis = JSON.parse(data);
  } catch (e) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: "#264653", fontSize: 18 }}>
          Error loading analysis.
        </Text>
      </SafeAreaView>
    );
  }

  const cardRendererRef = useContext(CardRendererContext);

  const vibeScore = analysis.vibe_score;
  const vibeLabel = getVibeLabel(vibeScore);
  const vibeDescription = getVibeDescription(vibeScore);

  const progressAnim = useRef(new Animated.Value(0)).current;

  function getVibeColor(score) {
    if (score <= 3) return "#E76F51";
    if (score <= 6) return "#E9C46A";
    return "#2A9D8F";
  }

  const vibeColor = getVibeColor(vibeScore);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: vibeScore * 10,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [vibeScore]);

  const [premium, setPremium] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    async function load() {
      const p = await isPremium();
      setPremium(p);
    }
    load();
  }, []);

  async function copyReply() {
    await Clipboard.setStringAsync(analysis.suggested_reply);
    Alert.alert("Copied", "Suggested reply copied to clipboard.");
  }

  function openPaywall() {
    Alert.alert(
      "Premium Required",
      "Save & Share is a premium feature. Unlock to export any insight.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Unlock Premium", onPress: () => router.push("/premium") },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4E9D8" }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Reality Check Results</Text>
            {premium && <PremiumTag />}
          </View>

          {/* Honesty */}
          <View style={[styles.card, styles.neutralCard]}>
            <ShareButton
              paywall={openPaywall}
              data={{
                title: "Honesty",
                body: analysis.honesty,
                accent: "#C46A4A",
              }}
            />
            <Text style={styles.cardTitle}>Honesty</Text>
            <Text style={styles.cardText}>{analysis.honesty}</Text>
          </View>

          {/* Effort */}
          <View style={[styles.card, styles.positiveCard]}>
            <ShareButton
              paywall={openPaywall}
              data={{
                title: "Effort",
                body: analysis.effort,
                accent: "#2A9D8F",
              }}
            />
            <Text style={styles.cardTitle}>Effort</Text>
            <Text style={styles.cardText}>{analysis.effort}</Text>
          </View>

          {/* Ghosting */}
          <View style={[styles.card, styles.warningCard]}>
            <ShareButton
              paywall={openPaywall}
              data={{
                title: "Ghosting Risk",
                body: analysis.ghosting,
                accent: "#F4A261",
              }}
            />
            <Text style={styles.cardTitle}>Ghosting Risk</Text>
            <Text style={styles.cardText}>{analysis.ghosting}</Text>
          </View>

          {/* Flags */}
          <View style={[styles.card, styles.flagCard]}>
            <ShareButton
              paywall={openPaywall}
              data={{
                title: "Flags",
                body: analysis.flags,
                accent: "#E76F51",
              }}
            />
            <Text style={styles.cardTitle}>Flags</Text>
            <Text style={styles.cardText}>{analysis.flags}</Text>
          </View>

          {/* Texting Style */}
          <View style={[styles.card, styles.neutralCard]}>
            <ShareButton
              paywall={openPaywall}
              data={{
                title: "Texting Style Archetype",
                body: analysis.texting_style,
                accent: "#E9C46A",
              }}
            />
            <Text style={styles.cardTitle}>Texting Style Archetype</Text>
            <Text style={styles.cardText}>{analysis.texting_style}</Text>
          </View>

          {/* Vibe Score */}
          <View style={[styles.card, styles.vibeCard]}>
            <ShareButton
              paywall={openPaywall}
              data={{
                title: "Vibe Score",
                body: `${vibeLabel} — ${vibeDescription}`,
                score: vibeScore,
                meter: vibeScore * 10,
                accent: vibeColor,
              }}
            />
            <Text style={styles.cardTitle}>Vibe Score</Text>

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

            <Text style={[styles.vibeScore, { color: vibeColor }]}>
              {vibeScore}/10
            </Text>
            <Text style={styles.vibeLabel}>{vibeLabel}</Text>
            <Text style={styles.vibeDescription}>{vibeDescription}</Text>
          </View>

          {/* Takeaways */}
          <View style={[styles.card, styles.neutralCard]}>
            <ShareButton
              paywall={openPaywall}
              data={{
                title: "Top Takeaways",
                body: premium ? analysis.takeaways : "Locked",
                accent: "#C46A4A",
              }}
            />
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>Top Takeaways</Text>
              {!premium && <PremiumBadge />}
            </View>

            {premium ? (
              <Text style={styles.cardText}>{analysis.takeaways}</Text>
            ) : (
              <LockedBadge label="Unlock Full Takeaways" />
            )}
          </View>

          {/* Would We Date Them */}
          <View style={[styles.card, styles.warningCard]}>
            <ShareButton
              paywall={openPaywall}
              data={{
                title: "Would We Date Them?",
                body: premium ? analysis.date_meter : "Locked",
                accent: "#C46A4A",
              }}
            />
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>Would We Date Them?</Text>
              {!premium && <PremiumBadge />}
            </View>

            {premium ? (
              <Text style={styles.cardText}>{analysis.date_meter}</Text>
            ) : (
              <LockedBadge label="Unlock This Insight" />
            )}
          </View>

          {/* Suggested Reply */}
          <View style={[styles.card, styles.flagCard]}>
            <ShareButton
              paywall={openPaywall}
              data={{
                title: "Suggested Reply",
                body: premium ? analysis.suggested_reply : "Locked",
                accent: "#2A9D8F",
              }}
            />
            <View style={styles.sectionHeader}>
              <Text style={styles.cardTitle}>Suggested Reply</Text>
              {!premium && <PremiumBadge />}
            </View>

            {premium ? (
              <>
                <Text style={styles.cardText}>{analysis.suggested_reply}</Text>
                <TouchableOpacity style={styles.copyButton} onPress={copyReply}>
                  <Text style={styles.copyButtonText}>Copy Reply</Text>
                </TouchableOpacity>
              </>
            ) : (
              <LockedBadge label="Unlock Suggested Reply" />
            )}
          </View>

          {/* Deep Dive */}
          <TouchableOpacity
            style={[
              styles.shareButton,
              { backgroundColor: premium ? "#2A9D8F" : "#999" },
            ]}
            onPress={() =>
              router.push({
                pathname: "/deep-dive",
                params: { data: JSON.stringify(analysis) },
              })
            }
          >
            <Text style={styles.shareButtonText}>
              View Deep Dive {premium ? "" : "(Premium Sections Locked)"}
            </Text>
          </TouchableOpacity>

          {/* New Analysis */}
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => router.push("/upload")}
          >
            <Text style={styles.newButtonText}>Start New Analysis</Text>
          </TouchableOpacity>

        </ScrollView>
      </Animated.View>
    </SafeAreaView>
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
    fontWeight: "bold",
    color: "#264653",
    textAlign: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  positiveCard: { borderLeftWidth: 6, borderLeftColor: "#2A9D8F" },
  neutralCard: { borderLeftWidth: 6, borderLeftColor: "#E9C46A" },
  warningCard: { borderLeftWidth: 6, borderLeftColor: "#F4A261" },
  flagCard: { borderLeftWidth: 6, borderLeftColor: "#E76F51" },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E07A5F",
    marginBottom: 6,
  },

  cardText: {
    fontSize: 16,
    color: "#264653",
    lineHeight: 22,
  },

  meterBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 6,
    overflow: "hidden",
  },

  meterFill: {
    height: "100%",
  },

  copyButton: {
    marginTop: 12,
    backgroundColor: "#2A9D8F",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  copyButtonText: {
    color: "white",
    fontWeight: "600",
  },

  shareButton: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  newButton: {
    marginTop: 20,
    backgroundColor: "#264653",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  newButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",

  },

  vibeCard: {
    borderLeftWidth: 6,
    borderLeftColor: "#2A9D8F",
  },

  vibeScore: {
    marginTop: 12,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },

  vibeLabel: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "600",
    color: "#4A3F35",
    textAlign: "center",
  },

  vibeDescription: {
    marginTop: 8,
    fontSize: 16,
    color: "#4A3F35",
    lineHeight: 22,
    textAlign: "center",
  },
});