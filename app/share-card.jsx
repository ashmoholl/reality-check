import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useRef } from "react";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";

export default function ShareCardScreen() {
  const { data, title, body, accent, score, meter, mode } =
    useLocalSearchParams();

  const analysis = data ? JSON.parse(data) : null;

  const captureRef = useRef();

  async function exportImage() {
    try {
      const uri = await captureRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch (e) {
      console.log("Export error:", e);
    }
  }

  // ----------------------------------------------------------
  // ⭐ FULL DEEP DIVE EXPORT MODE
  // ----------------------------------------------------------
  if (mode === "deep-dive-full" && analysis) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#1F2F38" }}>
        <ViewShot
          ref={captureRef}
          options={{ format: "png", quality: 1 }}
          style={styles.fullCardContainer}
        >
          <Text style={styles.fullTitle}>Reality Check — Full Deep Dive</Text>

          {/* TEXTING STYLE */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Texting Style Archetype</Text>
            <Text style={styles.sectionBody}>{analysis.texting_style}</Text>
          </View>

          <View style={styles.divider} />

          {/* TRAITS */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Traits</Text>
            <Text style={styles.sectionBody}>{analysis.archetype_traits}</Text>
          </View>

          <View style={styles.divider} />

          {/* STRENGTHS */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Strengths</Text>
            <Text style={styles.sectionBody}>{analysis.archetype_strengths}</Text>
          </View>

          <View style={styles.divider} />

          {/* WEAK SPOTS */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Weak Spots</Text>
            <Text style={styles.sectionBody}>{analysis.archetype_weaknesses}</Text>
          </View>

          <View style={styles.divider} />

          {/* LIKE SIGNALS */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>When They Like You</Text>
            <Text style={styles.sectionBody}>
              {analysis.archetype_like_signals}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* PULLBACK SIGNALS */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>When They Pull Back</Text>
            <Text style={styles.sectionBody}>
              {analysis.archetype_pullback_signals}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* COMPATIBILITY */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Compatibility Snapshot</Text>
            <Text style={styles.sectionBody}>
              {analysis.archetype_compatibility}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* VIBE SCORE */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Vibe Score</Text>
            <Text style={styles.vibeScore}>{analysis.vibe_score}/10</Text>
          </View>

          <View style={styles.divider} />

          {/* TAKEAWAYS */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Top Takeaways</Text>
            <Text style={styles.sectionBody}>{analysis.takeaways}</Text>
          </View>

          <View style={styles.divider} />

          {/* DATE METER */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Would We Date Them?</Text>
            <Text style={styles.sectionBody}>{analysis.date_meter}</Text>
          </View>

          <View style={styles.divider} />

          {/* SUGGESTED REPLY */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Suggested Reply</Text>
            <Text style={styles.sectionBody}>{analysis.suggested_reply}</Text>
          </View>
        </ViewShot>

        <TouchableOpacity style={styles.exportButton} onPress={exportImage}>
          <Text style={styles.exportText}>Save Full Deep Dive</Text>
        </TouchableOpacity>

            <TouchableOpacity
  style={styles.newButton}
  onPress={() => router.push("/upload")}
>
  <Text style={styles.newButtonText}>Start New Analysis</Text>
</TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ----------------------------------------------------------
  // ⭐ DEFAULT SINGLE-CARD EXPORT (unchanged)
  // ----------------------------------------------------------
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#1F2F38" }}>
      <ViewShot
        ref={captureRef}
        options={{ format: "png", quality: 1 }}
        style={[styles.card, { borderLeftColor: accent || "#E9C46A" }]}
      >
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardBody}>{body}</Text>
      </ViewShot>

      <TouchableOpacity style={styles.exportButton} onPress={exportImage}>
        <Text style={styles.exportText}>Save Card</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // FULL DEEP DIVE CARD
  fullCardContainer: {
    backgroundColor: "#264653",
    padding: 28,
    borderRadius: 22,
    margin: 24,
  },

  fullTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#E9C46A",
    textAlign: "center",
    marginBottom: 24,
  },

  section: {
    marginBottom: 16,
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: "800",
    color: "#E9C46A",
    marginBottom: 6,
  },

  sectionBody: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(233,196,106,0.25)",
    marginVertical: 12,
  },

  vibeScore: {
    fontSize: 28,
    fontWeight: "900",
    color: "#E9C46A",
  },

  // SINGLE CARD (unchanged)
  card: {
    backgroundColor: "#264653",
    padding: 24,
    borderRadius: 20,
    margin: 24,
    borderLeftWidth: 6,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#E9C46A",
    marginBottom: 12,
  },

  cardBody: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },

  // BUTTONS
  exportButton: {
    backgroundColor: "#2A9D8F",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 16,
  },

  exportText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  newButton: {
  backgroundColor: "#264653",
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: "center",
  marginHorizontal: 24,
  marginBottom: 16,
},

newButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "700",
},

  back: {
    textAlign: "center",
    color: "#E9C46A",
    fontSize: 16,
    marginBottom: 40,
  },
});