import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState, useRef } from "react";
import * as ScreenCapture from "expo-screen-capture";
import * as Clipboard from "expo-clipboard";
import { isPremium } from "../utils/premium";

export default function ResultsScreen() {
  const { data } = useLocalSearchParams();
  const analysis = JSON.parse(data);

  const [premium, setPremium] = useState(false);

  // Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Screenshot protection
  useEffect(() => {
    ScreenCapture.preventScreenCaptureAsync();
    return () => ScreenCapture.allowScreenCaptureAsync();
  }, []);

  // Load premium + animate
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

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Reality Check Results</Text>

        {/* Honesty */}
        <View style={[styles.card, styles.neutralCard]}>
          <Text style={styles.cardTitle}>Honesty</Text>
          <Text style={styles.cardText}>{analysis.honesty}</Text>
        </View>

        {/* Effort */}
        <View style={[styles.card, styles.positiveCard]}>
          <Text style={styles.cardTitle}>Effort</Text>
          <Text style={styles.cardText}>{analysis.effort}</Text>
        </View>

        {/* Ghosting Risk */}
        <View style={[styles.card, styles.warningCard]}>
          <Text style={styles.cardTitle}>Ghosting Risk</Text>
          <Text style={styles.cardText}>{analysis.ghosting}</Text>
        </View>

        {/* Flags */}
        <View style={[styles.card, styles.flagCard]}>
          <Text style={styles.cardTitle}>Flags</Text>
          <Text style={styles.cardText}>{analysis.flags}</Text>
        </View>

        {/* Viral Add-On A: Emoji Cues */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vibe Emojis</Text>
          <Text style={styles.cardText}>{analysis.emojis}</Text>
        </View>

        {/* Viral Add-On B: Vibe Meter */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vibe Score</Text>
          <View style={styles.meterBackground}>
            <View
              style={[
                styles.meterFill,
                { width: `${analysis.vibe_score}%` },
              ]}
            />
          </View>
        </View>

        {/* Viral Add-On C: Top 3 Takeaways */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top 3 Takeaways</Text>

          {premium ? (
            <Text style={styles.cardText}>{analysis.takeaways}</Text>
          ) : (
            <View style={styles.lockedBox}>
              <Text style={styles.lockedText}>🔒 Premium Feature</Text>
            </View>
          )}
        </View>

        {/* Viral Add-On D: Would We Date Them? */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Would We Date Them?</Text>

          {premium ? (
            <Text style={styles.cardText}>{analysis.date_meter}</Text>
          ) : (
            <View style={styles.lockedBox}>
              <Text style={styles.lockedText}>🔒 Premium Feature</Text>
            </View>
          )}
        </View>

        {/* Suggested Reply */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Suggested Reply</Text>

          {premium ? (
            <>
              <Text style={styles.cardText}>{analysis.suggested_reply}</Text>

              <TouchableOpacity style={styles.copyButton} onPress={copyReply}>
                <Text style={styles.copyButtonText}>Copy Reply</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.cardText, { opacity: 0.3 }]}>
                Unlock to see your personalized reply.
              </Text>

              <TouchableOpacity
                style={styles.unlockButton}
                onPress={() => router.push("/paywall")}
              >
                <Text style={styles.unlockButtonText}>Unlock</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Share Card Button */}
        <TouchableOpacity
          style={[
            styles.shareButton,
            { backgroundColor: premium ? "#2A9D8F" : "#999" },
          ]}
          onPress={() =>
            premium
              ? router.push({
                  pathname: "/share-card",
                  params: { data: JSON.stringify(analysis) },
                })
              : router.push("/paywall")
          }
        >
          <Text style={styles.shareButtonText}>
            Generate Share Card {premium ? "" : "(Premium)"}
          </Text>
        </TouchableOpacity>

        {/* New Analysis */}
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => router.push("/upload")}
        >
          <Text style={styles.newButtonText}>Start New Analysis</Text>
        </TouchableOpacity>

        {/* Back */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E9D8",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#264653",
    marginBottom: 24,
    marginTop: 20,
    textAlign: "center",
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

  positiveCard: {
    borderLeftWidth: 6,
    borderLeftColor: "#2A9D8F",
  },
  neutralCard: {
    borderLeftWidth: 6,
    borderLeftColor: "#E9C46A",
  },
  warningCard: {
    borderLeftWidth: 6,
    borderLeftColor: "#F4A261",
  },
  flagCard: {
    borderLeftWidth: 6,
    borderLeftColor: "#E76F51",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E07A5F",
    marginBottom: 8,
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
    backgroundColor: "#2A9D8F",
  },

  lockedBox: {
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  lockedText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },

  unlockButton: {
    marginTop: 12,
    backgroundColor: "#E07A5F",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  unlockButtonText: {
    color: "#F4E9D8",
    fontSize: 14,
    fontWeight: "600",
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

  backText: {
    marginTop: 20,
    color: "#264653",
    fontSize: 16,
    textAlign: "center",
  },
});