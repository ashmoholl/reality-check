import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import ConfettiCannon from "react-native-confetti-cannon";

export default function PremiumUnlocked() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Fade + scale animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: false,
          }),
        ])
      ),
    ]).start();
  }, []);

  // Auto redirect after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.back();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const glowShadow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0px", "18px"],
  });

  return (
    <View style={styles.container}>
      {/* Confetti */}
      <ConfettiCannon
        count={60}
        origin={{ x: 200, y: -10 }}
        fadeOut={true}
        fallSpeed={2500}
      />

      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            shadowRadius: glowShadow,
          },
        ]}
      >
        <Text style={styles.star}>⭐</Text>
        <Text style={styles.title}>Premium Unlocked</Text>
        <Text style={styles.subtitle}>Welcome to the full Reality Check experience</Text>
      </Animated.View>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2F38",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  card: {
    backgroundColor: "#264653",
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#E9C46A",
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 40,
  },

  star: {
    fontSize: 48,
    color: "#E9C46A",
    marginBottom: 12,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#E9C46A",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 260,
  },

  back: {
    marginTop: 20,
    color: "#E9C46A",
    fontSize: 18,
    fontWeight: "700",
  },
});