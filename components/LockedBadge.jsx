import { View, Text, StyleSheet } from "react-native";

export default function LockedBadge({ label = "Locked" }) {
  return (
    <View style={styles.overlay}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    marginTop: 12,
    paddingVertical: 20,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#E9C46A",
    fontSize: 16,
    fontWeight: "700",
  },
});