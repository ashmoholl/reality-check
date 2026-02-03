import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { analyzeImage } from "../utils/analyzeImage";
import { saveAnalysis } from "../utils/history";
import { useEffect } from "react";

export default function AnalyzeScreen() {
  const { base64 } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function run() {
      try {
        const result = await analyzeImage(base64);

        // ⭐ FIX: Save with image
        await saveAnalysis(result, base64);

        router.replace({
          pathname: "/results",
          params: { data: JSON.stringify(result) },
        });
      } catch (err) {
        console.log("ANALYSIS ERROR:", err);
        alert("Something went wrong analyzing the image.");
        router.back();
      }
    }

    run();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#264653" />
      <Text style={styles.text}>Running your Reality Check…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E9D8",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 16,
    fontSize: 18,
    color: "#4A3F35",
  },
});