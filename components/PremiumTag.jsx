import { View, Text, StyleSheet } from "react-native";

export default function PremiumTag() {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>Premium</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: "#E9C46A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  text: {
    color: "#264653",
    fontSize: 12,
    fontWeight: "800",
  },
});
