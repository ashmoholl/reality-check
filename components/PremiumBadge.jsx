import { View, Text, StyleSheet } from "react-native";

export default function PremiumBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>Premium</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#E9C46A",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: "#264653",
    fontWeight: "700",
    fontSize: 14,
  },
});