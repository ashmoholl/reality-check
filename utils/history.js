import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

// Load history
export async function loadHistory() {
  try {
    const json = await AsyncStorage.getItem("history");
    if (!json) return [];
    return JSON.parse(json);
  } catch (err) {
    console.log("LOAD HISTORY ERROR:", err);
    return [];
  }
}

// Save new entry
export async function saveAnalysis(analysis, imageBase64) {
  try {
    const history = await loadHistory();

    const entry = {
      id: uuid.v4(),
      image: imageBase64,
      favorite: false,
      date: new Date().toISOString(),
      summary_title: analysis.summary_title || "Analysis",
      ...analysis,
    };

    const updated = [entry, ...history];
    await AsyncStorage.setItem("history", JSON.stringify(updated));
  } catch (err) {
    console.log("SAVE HISTORY ERROR:", err);
  }
}

// Update title
export async function updateTitle(id, newTitle) {
  const history = await loadHistory();
  const updated = history.map((item) =>
    item.id === id ? { ...item, summary_title: newTitle } : item
  );
  await AsyncStorage.setItem("history", JSON.stringify(updated));
  return updated;
}

// Toggle favorite
export async function toggleFavorite(id) {
  const history = await loadHistory();
  const updated = history.map((item) =>
    item.id === id ? { ...item, favorite: !item.favorite } : item
  );
  await AsyncStorage.setItem("history", JSON.stringify(updated));
  return updated;
}

// Delete entry
export async function deleteHistoryItem(id) {
  const history = await loadHistory();
  const updated = history.filter((item) => item.id !== id);
  await AsyncStorage.setItem("history", JSON.stringify(updated));
  return updated;
}

// Clear all
export async function clearHistory() {
  await AsyncStorage.setItem("history", JSON.stringify([]));
}