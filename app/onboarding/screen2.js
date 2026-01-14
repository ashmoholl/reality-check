import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Screen2() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What Reality Check Does</Text>
      <Text style={styles.subtitle}>
        It reads tone, effort, honesty, and emotional patterns — the things your gut notices but your brain can’t always articulate.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/onboarding/screen3")}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#264653",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#4A3F35",
    marginBottom: 40,
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
});

