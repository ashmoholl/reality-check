import { View, Text, Button, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { analyzeImage } from "../utils/analyzeImage";
import { router } from "expo-router";
import { useState } from "react";
import LoadingView from "../components/LoadingView";
import { saveAnalysis } from "../utils/history";
import { isPremium, canUseFreeUpload, recordFreeUpload } from "../utils/premium";

export default function UploadScreen() {
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const mime = asset.mimeType || "image/jpeg";
    const base64Image = `data:${mime};base64,${asset.base64}`;

    const premium = await isPremium();
    if (!premium) {
      const { allowed } = await canUseFreeUpload();
      if (!allowed) {
        router.push("/paywall");
        return;
      }
    }

    setLoading(true);

    try {
      const analysis = await analyzeImage(base64Image);

      if (!premium) {
        await recordFreeUpload();
      }

      await saveAnalysis(analysis);

      router.push({
        pathname: "/results",
        params: { data: JSON.stringify(analysis) },
      });
    } catch (err) {
      console.log("ANALYSIS ERROR:", err);
      alert("Something went wrong analyzing the image.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingView />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a Profile Screenshot</Text>

      <View style={{ marginTop: 40 }}>
        <Button title="Upload Image" onPress={pickImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E9D8",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#264653",
    marginTop: 40,
  },
});





