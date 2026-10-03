import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readStorageValue<T>(key: string, fallback: T): Promise<T> {
  try {
    const rawValue = await AsyncStorage.getItem(key);

    if (rawValue === null) {
      return fallback;
    }

    const parsed = JSON.parse(rawValue) as T;
    return parsed;
  } catch (error) {
    console.warn(`FocusFlow storage read failed for ${key}:`, error);
    return fallback;
  }
}

export async function writeStorageValue<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`FocusFlow storage write failed for ${key}:`, error);
  }
}
