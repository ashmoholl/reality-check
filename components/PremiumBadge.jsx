import { View, Text, StyleSheet } from "react-native";

export default function PremiumBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.star}>⭐</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    marginLeft: "auto",
  },
  star: {
    fontSize: 20,
    color: "#E9C46A",
  },
});