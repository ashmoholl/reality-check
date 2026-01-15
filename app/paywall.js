import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { setPremium } from "../utils/premium";
import { router } from "expo-router";

export default function PaywallScreen() {
  async function unlock() {
    await setPremium(true);
    router.back(); // return to results
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock Suggested Replies</Text>
      <Text style={styles.subtitle}>
        Get emotionally intelligent, grounded messages you can send back.
      </Text>

      <TouchableOpacity style={styles.button} onPress={unlock}>
        <Text style={styles.buttonText}>Unlock for Free (MVP)</Text>
      </TouchableOpacity>

      <Text style={styles.note}>No subscription yet — just testing flow.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E9D8",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#264653",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#4A3F35",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#E07A5F",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#F4E9D8",
    fontSize: 16,
    fontWeight: "600",
  },
  note: {
    marginTop: 16,
    color: "#4A3F35",
    opacity: 0.7,
    fontSize: 12,
  },
});

