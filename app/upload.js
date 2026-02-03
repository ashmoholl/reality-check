import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { analyzeImage } from "../utils/analyzeImage";
import { router } from "expo-router";
import { useState, useEffect, useRef } from "react";
import LoadingView from "../components/LoadingView";
import { saveAnalysis } from "../utils/history";
import { isPremium, canUseFreeUpload, recordFreeUpload } from "../utils/premium";
import PremiumTag from "../components/PremiumTag";   // ⭐ NEW
import Shimmer from "../components/Shimmer";

export default function UploadScreen() {
  const [loading, setLoading] = useState(false);
  const [freeUploadsLeft, setFreeUploadsLeft] = useState(null);
  const [premium, setPremium] = useState(false);

  // 🔥 Triple‑tap debug gesture
  const tapCount = useRef(0);

  function handleDebugTap() {
    tapCount.current++;
    setTimeout(() => (tapCount.current = 0), 500);

    if (tapCount.current === 3) {
      router.push("/debug");
    }
  }

  useEffect(() => {
    async function loadStatus() {
      const premiumStatus = await isPremium();
      setPremium(premiumStatus);

      if (!premiumStatus) {
        const { remaining } = await canUseFreeUpload();
        setFreeUploadsLeft(remaining);
      }
    }

    loadStatus();
  }, []);

  const isLocked = !premium && freeUploadsLeft === 0;

  async function pickImage() {
    if (isLocked) {
      router.push("/paywall");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const mime = asset.mimeType || "image/jpeg";
    const base64Image = `data:${mime};base64,${asset.base64}`;

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

      await saveAnalysis(analysis, base64Image);
      console.log("Saved analysis:",{summary_title: analysis.summary_title, hasImage: !!base64Image});
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

      {/* 🔥 Triple‑tap gesture */}
      <TouchableOpacity activeOpacity={1} onPress={handleDebugTap}>
        <Text style={styles.title}>
          Upload a Screenshot of a Text Message or Dating Profile
        </Text>
      </TouchableOpacity>

      {/* ⭐ PremiumTag pill for premium users */}
      {premium && (
        <View style={styles.premiumTagWrapper}>
          <PremiumTag />
        </View>
      )}

      {!premium && freeUploadsLeft !== null && (
        <Text style={styles.counter}>
          You have {freeUploadsLeft} free uploads left today
        </Text>
      )}

{/* View History Button */}
<TouchableOpacity
  style={styles.historyButton}
  onPress={() => router.push("/history")}
>
  <Text style={styles.historyText}>View History</Text>
</TouchableOpacity>

      <Shimmer>
        <TouchableOpacity
          style={[styles.uploadButton, isLocked && styles.lockedButton]}
          onPress={pickImage}
          activeOpacity={0.7}
        >
          <Text style={styles.uploadText}>
            {isLocked ? "Upload (Locked)" : "Upload Image"}
          </Text>

          {isLocked && <Text style={styles.lockIcon}>🔒</Text>}
        </TouchableOpacity>
      </Shimmer>
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

  premiumTagWrapper: {
    alignItems: "center",
    marginTop: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#264653",
    marginTop: 20,
    textAlign: "center",
  },

  counter: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
    color: "#6B4F4F",
  },

  uploadButton: {
    marginTop: 20,
    backgroundColor: "#2A9D8F",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  lockedButton: {
    backgroundColor: "#A8A8A8",
  },

  uploadText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  lockIcon: {
    marginLeft: 8,
    fontSize: 18,
  },

  historyButton: {
  marginTop: 20,
  backgroundColor: "#264653",
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: "center",
},

historyText: {
  color: "white",
  fontSize: 16,
  fontWeight: "700",
},
});