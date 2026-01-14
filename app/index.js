import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { devReset } from "../utils/devReset";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reality Check</Text>
      <Text style={styles.subtitle}>Date smarter. Not delusional.</Text>

      {/* Primary Action */}
      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={() => router.push("/upload")}
      >
        <Text style={styles.buttonText}>Start a Reality Check</Text>
      </TouchableOpacity>

      {/* History Button */}
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => router.push("/history")}
      >
        <Text style={styles.buttonSecondaryText}>View History</Text>
      </TouchableOpacity>

        {/* Developer Reset - Long Press */}
<TouchableOpacity onLongPress={async () => {
  await devReset();
  alert("Developer reset complete");
}}>
  <Text style={{ color: "#aaa", fontSize: 12 }}>v1.0.0</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E9D8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#264653",
  },
  subtitle: {
    fontSize: 18,
    color: "#4A3F35",
    marginTop: 10,
    textAlign: "center",
  },

  // Primary CTA
  buttonPrimary: {
    marginTop: 32,
    backgroundColor: "#E07A5F",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#F4E9D8",
    fontSize: 16,
    fontWeight: "600",
  },

  // Secondary CTA (History)
  buttonSecondary: {
    marginTop: 16,
    backgroundColor: "#264653",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonSecondaryText: {
    color: "#F4E9D8",
    fontSize: 16,
    fontWeight: "600",
  },
});