import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  isPremium,
  setPremium,
  resetFreeUsage,
} from "../utils/premium";

export default function DebugPanel() {
  const [premium, setPremiumState] = useState(false);
  const [freeUsage, setFreeUsage] = useState(null);

  async function load() {
    const p = await isPremium();
    setPremiumState(p);

    const usage = await AsyncStorage.getItem("freeUsage");
    setFreeUsage(usage ? JSON.parse(usage) : null);
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePremium() {
    await setPremium(!premium);
    load();
  }

  async function clearAll() {
    await AsyncStorage.clear();
    load();
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Developer Debug Panel</Text>
      <Text style={styles.subtitle}>For internal testing only</Text>

      {/* PREMIUM STATUS */}
      <View style={styles.card}>
        <Text style={styles.label}>Premium Status</Text>
        <Text style={styles.value}>{premium ? "Premium" : "Free User"}</Text>

        <TouchableOpacity style={styles.button} onPress={togglePremium}>
          <Text style={styles.buttonText}>
            Toggle Premium ({premium ? "Disable" : "Enable"})
          </Text>
        </TouchableOpacity>
      </View>

      {/* FREE USAGE */}
      <View style={styles.card}>
        <Text style={styles.label}>Free Usage</Text>

        {freeUsage ? (
          <>
            <Text style={styles.value}>Count: {freeUsage.count}</Text>
            <Text style={styles.value}>
              Resets At: {new Date(freeUsage.resetAt).toLocaleString()}
            </Text>
          </>
        ) : (
          <Text style={styles.value}>No usage recorded</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            await resetFreeUsage();
            load();
          }}
        >
          <Text style={styles.buttonText}>Reset Free Usage</Text>
        </TouchableOpacity>
      </View>

      {/* CLEAR ALL STORAGE */}
      <View style={styles.card}>
        <Text style={styles.label}>Storage</Text>

        <TouchableOpacity style={styles.buttonDanger} onPress={clearAll}>
          <Text style={styles.buttonText}>Clear ALL AsyncStorage</Text>
        </TouchableOpacity>
      </View>

      {/* QUICK NAVIGATION */}
      <View style={styles.card}>
        <Text style={styles.label}>Quick Navigation</Text>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/upload")}
        >
          <Text style={styles.navText}>Go to Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() =>
            router.push({
              pathname: "/results",
              params: {
                data: JSON.stringify({
                  score: 7,
                  summary: "Debug summary",
                  vibe_score: 6,
                  texting_style: "Debug archetype",
                  honesty: "Debug honesty",
                  effort: "Debug effort",
                  ghosting: "Debug ghosting",
                  flags: "Debug flags",
                  takeaways: "Debug takeaways",
                  date_meter: "Debug date meter",
                  suggested_reply: "Debug reply",
                }),
              },
            })
          }
        >
          <Text style={styles.navText}>Go to Results (Debug Data)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() =>
            router.push({
              pathname: "/deep-dive",
              params: {
                data: JSON.stringify({
                  score: 7,
                  summary: "Debug summary",
                  vibe_score: 6,
                  texting_style: "Debug archetype",
                  honesty: "Debug honesty",
                  effort: "Debug effort",
                  ghosting: "Debug ghosting",
                  flags: "Debug flags",
                  takeaways: "Debug takeaways",
                  date_meter: "Debug date meter",
                  suggested_reply: "Debug reply",
                  archetype_traits: "Debug traits",
                  archetype_strengths: "Debug strengths",
                  archetype_weaknesses: "Debug weaknesses",
                  archetype_like_signals: "Debug like signals",
                  archetype_pullback_signals: "Debug pullback signals",
                  archetype_compatibility: "Debug compatibility",
                }),
              },
            })
          }
        >
          <Text style={styles.navText}>Go to Deep Dive (Debug Data)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() =>
            router.push({
              pathname: "/share-card",
              params: {
                data: JSON.stringify({
                  score: 7,
                  summary: "Debug summary",
                  vibe_score: 6,
                  texting_style: "Debug archetype",
                  takeaways: "Debug takeaways",
                  date_meter: "Debug date meter",
                }),
              },
            })
          }
        >
          <Text style={styles.navText}>Go to Share Card (Debug Data)</Text>
        </TouchableOpacity>
      </View>

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

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#E9C46A",
    textAlign: "center",
    marginBottom: 4,
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
    borderRadius: 16,
    marginBottom: 24,
  },

  label: {
    color: "#E9C46A",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },

  value: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },

  button: {
    backgroundColor: "#2A9D8F",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDanger: {
    backgroundColor: "#E76F51",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  navButton: {
    backgroundColor: "#1F2F38",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E9C46A",
  },

  navText: {
    color: "#E9C46A",
    fontSize: 16,
    fontWeight: "600",
  },

  back: {
    textAlign: "center",
    color: "#E9C46A",
    fontSize: 16,
    marginTop: 12,
  },
});