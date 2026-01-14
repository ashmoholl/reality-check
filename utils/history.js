import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "reality_check_history";

export async function saveAnalysis(entry) {
  const existing = await AsyncStorage.getItem(KEY);
  const list = existing ? JSON.parse(existing) : [];

  list.unshift({
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...entry,
  });

  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function getHistory() {
  const existing = await AsyncStorage.getItem(KEY);
  return existing ? JSON.parse(existing) : [];
}

