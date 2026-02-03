// components/CardRenderer.js
import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from "react";
import { View } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as Font from "expo-font";
import ShareCard from "./ShareCard";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const CardRenderer = forwardRef((props, ref) => {
  const [cardData, setCardData] = useState(null);
  const viewRef = useRef(null);

  // ✅ Ensure fonts are loaded before capture
  useEffect(() => {
    async function ensureFonts() {
      await Font.loadAsync({
        Playfair: require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
      });
    }
    ensureFonts();
  }, []);

  useImperativeHandle(ref, () => ({
    async renderAndShare(data) {
      setCardData(data);

      // ✅ Wait for layout + font render
      await wait(50);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await wait(50);

      // ✅ Capture
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1,
      });

      // ✅ Share
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }

      // ✅ Cleanup
      setCardData(null);
    },
  }));

  if (!cardData) return null;

  return (
    <View
      ref={viewRef}
      collapsable={false}
      style={{
        position: "relative",
        width: 1080,
        height: 1080,
        backgroundColor: "#26868b",
        borderWidth: 2,
        borderColor: "#9c3505",
      }}
    >
      <ShareCard {...cardData} />
    </View>
  );
});

export default CardRenderer;