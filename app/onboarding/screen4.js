import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { setHasSeenOnboarding } from "../../utils/onboarding";

export default function Screen4() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready?</Text>
      <Text style={styles.subtitle}>
        Let’s help you date with clarity, not chaos.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await setHasSeenOnboarding();
          router.replace("/");
        }}
      >
        <Text style={styles.buttonText}>Get Started</Text>
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

