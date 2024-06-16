import AsyncStorage from '@react-native-async-storage/async-storage';
import vocabs from './vocabs.json';
import { Word } from './interface';

export const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const getWords = async (collection: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(collection);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};

export const storeAllData = async () => {
  if ((await AsyncStorage.getAllKeys()).length !== 0) return;
  let temp: Word[] = [];
  let sectionIndex = 1;
  vocabs.forEach((word, index) => {
    try {
      temp.push(word);
      if ((index + 1) % 10 == 0 && index > 0) {
        storeData(`Collection ${sectionIndex++}`, temp);
        temp = [];
      }
    } catch (error) {
      storeData(`Collection ${sectionIndex}`, temp);
    }
  });
};

export const getAllKeysSorted = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.toSorted(
      (a, b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1])
    );
  } catch (error) {
    console.error(error);
  }
};
