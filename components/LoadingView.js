import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function LoadingView() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E07A5F" />
      <Text style={styles.text}>Reading the vibe…</Text>
      <Text style={styles.subtext}>This usually takes a few seconds.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E9D8",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  text: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "600",
    color: "#264653",
  },
  subtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#264653",
    opacity: 0.7,
  },
});

