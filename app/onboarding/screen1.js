import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Screen1() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Reality Check</Text>
      <Text style={styles.subtitle}>
        A grounded, emotionally intelligent way to understand the people you're talking to.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/onboarding/screen2")}
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
    textAlign: "center",
    color: "#264653",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
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

