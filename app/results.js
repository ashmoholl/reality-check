import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { isPremium } from "../utils/premium";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function ResultsScreen() {
  const { data } = useLocalSearchParams();
  const analysis = JSON.parse(data);
  const [premium, setPremiumState] = useState(false);

  useEffect(() => {
    async function load() {
      const p = await isPremium();
      setPremiumState(p);
    }
    load();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reality Check Results</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Honesty</Text>
        <Text style={styles.cardText}>{analysis.honesty}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Effort</Text>
        <Text style={styles.cardText}>{analysis.effort}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ghosting Risk</Text>
        <Text style={styles.cardText}>{analysis.ghosting}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Flags</Text>
        <Text style={styles.cardText}>{analysis.flags}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Suggested Reply</Text>

        {premium ? (
          <Text style={styles.cardText}>{analysis.suggested_reply}</Text>
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

        <TouchableOpacity onPress={() => router.back()}>
  <Text style={{ color: "#264653", fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
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
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
});


