// components/ShareCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ShareCard({
  title,
  body,
  score,
  meter,
  traits,
  accent = "#C46A4A",
  premium = true,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{title.toUpperCase()}</Text>
        {premium && <Text style={styles.premiumStar}>★</Text>}
      </View>

      <View style={[styles.underline, { backgroundColor: accent }]} />

      {score !== null && <Text style={[styles.score, { color: accent }]}>{score}</Text>}

      {meter !== null && (
        <View style={styles.meterContainer}>
          <View style={[styles.meterFill, { width: `${meter}%`, backgroundColor: accent }]} />
        </View>
      )}

      {traits && traits.length > 0 && (
        <View style={styles.traitsContainer}>
          {traits.map((t, i) => (
            <Text key={i} style={styles.trait}>• {t}</Text>
          ))}
        </View>
      )}

      <Text style={styles.body}>{body}</Text>

      <Text style={styles.footer}>Reality Check</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 1080,
    height: 1080,
    backgroundColor: "#F7F2EB",
    padding: 80,
    justifyContent: "flex-start",
    borderRadius: 0,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
    underline:{
      height: 6,
      width: "100%",
      marginTop: 12,
      marginBottom: 40,
      borderRadius: 3,
  },
  accentEdge: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width:50,
    borderTopLeftRadius: 48,
    borderBottomLeftRadius: 48,
    borderTopRightRadius:48,
    borderBottomRightRadius:48,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 72,
    fontFamily: "Playfair",
    color: "#2E2E2E",
    textAlign: "center",
    letterSpacing: 2,
  },
  premiumStar: {
    fontSize: 60,
    color: "#D4A857",
    fontFamily: "Playfair",
  },
  underline: {
    height: 6,
    width: "100%",
    marginTop: 12,
    marginBottom: 40,
  },
  score: {
    fontSize: 200,
    fontFamily: "Playfair",
    color: "#2E2E2E",
    marginBottom: 40,
  },
  meterContainer: {
    height: 20,
    width: "100%",
    backgroundColor: "#E0D8CF",
    borderRadius: 10,
    marginBottom: 40,
  },
  meterFill: {
    height: "100%",
    borderRadius: 10,
  },
  traitsContainer: {
    marginBottom: 40,
  },
  trait: {
    fontSize: 48,
    color: "#3A3A3A",
    marginBottom: 12,
    fontFamily: "Playfair",
  },
  body: {
    fontSize: 54,
    color: "#3A3A3A",
    lineHeight: 72,
    marginBottom: 80,
    fontFamily: "Playfair",
  },
  footer: {
    position: "absolute",
    bottom: 80,
    left: 80,
    fontSize: 48,
    color: "#A38F7B",
    fontFamily: "Playfair",
  },
});