import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { getHistory } from "../utils/history";
import { router } from "expo-router";

export default function HistoryScreen() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getHistory();
      setItems(data);
    }
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/results",
                params: { data: JSON.stringify(item) },
              })
            }
          >
            <Text style={styles.cardTitle}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
            <Text style={styles.cardText} numberOfLines={2}>
              {item.honesty}
            </Text>
          </TouchableOpacity>
        )}
      />
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#264653",
    marginBottom: 24,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E07A5F",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#264653",
  },
});