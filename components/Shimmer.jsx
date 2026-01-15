import { Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

export default function Shimmer({ children }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[styles.shimmer, { opacity }]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  shimmer: {
    width: "100%",
  },
});