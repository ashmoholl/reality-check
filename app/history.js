import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import {
  loadHistory,
  deleteHistoryItem,
  toggleFavorite,
  clearHistory,
  updateTitle,
} from "../utils/history";
import { isPremium } from "../utils/premium";
import { router } from "expo-router";
import PremiumTag from "../components/PremiumTag";
import PremiumBadge from "../components/PremiumBadge";

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [premium, setPremium] = useState(false);
  const [search, setSearch] = useState("");

  const [editingItem, setEditingItem] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    async function load() {
      const p = await isPremium();
      setPremium(p);

      const h = await loadHistory();
      setHistory(h);
    }
    load();
  }, []);

  const filtered = history.filter((item) =>
    item.summary_title.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [
    ...filtered.filter((i) => i.favorite),
    ...filtered.filter((i) => !i.favorite),
  ];

  const visibleHistory = premium ? sorted : sorted.slice(0, 3);

  function handleDelete(id) {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this analysis?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = await deleteHistoryItem(id);
            setHistory(updated);
          },
        },
      ]
    );
  }

  function handleClearAll() {
    Alert.alert(
      "Clear All History",
      "This will permanently delete all saved analyses.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearHistory();
            setHistory([]);
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1F2F38" }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>History</Text>
          {premium && <PremiumTag />}
        </View>

        {premium && (
          <TextInput
            style={styles.search}
            placeholder="Search history..."
            placeholderTextColor="#A7B1B7"
            value={search}
            onChangeText={setSearch}
          />
        )}

        {visibleHistory.length === 0 && (
          <Text style={styles.empty}>No history yet</Text>
        )}

        {visibleHistory.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/results",
                params: { data: JSON.stringify(item) },
              })
            }
            onLongPress={() => handleDelete(item.id)}
          >
            <Image source={{ uri: item.image }} style={styles.thumbnail} />

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.cardTitle}>{item.summary_title}</Text>

                <TouchableOpacity
                  onPress={() => {
                    setEditingItem(item);
                    setNewTitle(item.summary_title);
                  }}
                >
                  <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.cardDate}>
                {new Date(item.date).toLocaleString()}
              </Text>
            </View>

            {premium && (
              <TouchableOpacity
                onPress={async () => {
                  const updated = await toggleFavorite(item.id);
                  setHistory(updated);
                }}
              >
                <Text style={styles.favoriteIcon}>
                  {item.favorite ? "⭐" : "☆"}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}

        {!premium && history.length > 3 && (
          <TouchableOpacity
            style={styles.lockedCard}
            onPress={() => router.push("/paywall")}
          >
            <View style={styles.lockHeader}>
              <Text style={styles.lockTitle}>Unlock Full History</Text>
              <PremiumBadge />
            </View>

            <Text style={styles.lockText}>
              View all your past analyses, search, favorite, and manage your full
              history with premium.
            </Text>
          </TouchableOpacity>
        )}

        {premium && history.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear All History</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* EDIT TITLE MODAL */}
      {editingItem && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Edit Title</Text>

            <TextInput
              style={styles.modalInput}
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={async () => {
                  const updated = await updateTitle(editingItem.id, newTitle);
                  setHistory(updated);
                  setEditingItem(null);
                }}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#555" }]}
                onPress={() => setEditingItem(null)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 24 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#E9C46A",
    textAlign: "center",
  },

  search: {
    backgroundColor: "#264653",
    padding: 14,
    borderRadius: 12,
    color: "white",
    marginBottom: 20,
    fontSize: 16,
  },

  empty: {
    color: "white",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },

  card: {
    backgroundColor: "#264653",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 14,
  },

  cardTitle: {
    color: "#E9C46A",
    fontSize: 18,
    fontWeight: "700",
  },

  editIcon: {
    marginLeft: 8,
    fontSize: 18,
    color: "#E9C46A",
  },

  cardDate: {
    color: "white",
    marginTop: 4,
    fontSize: 14,
  },

  favoriteIcon: {
    fontSize: 26,
    marginLeft: 10,
    color: "#E9C46A",
  },

  lockedCard: {
    backgroundColor: "#2A2A2A",
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E9C46A",
  },

  lockHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  lockTitle: {
    color: "#E9C46A",
    fontSize: 18,
    fontWeight: "800",
    marginRight: 8,
  },

  lockText: {
    color: "white",
    fontSize: 15,
    lineHeight: 20,
  },

  clearButton: {
    marginTop: 30,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#E76F51",
    alignItems: "center",
  },

  clearText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "80%",
    backgroundColor: "#264653",
    padding: 20,
    borderRadius: 12,
  },

  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  modalInput: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  modalButton: {
    backgroundColor: "#2A9D8F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  modalButtonText: {
    color: "white",
    fontWeight: "700",
  },
});