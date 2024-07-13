import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, Word } from '../global';
import vocabs from './vocabs.json';

export const SESSION_KEY = 'appSession';
export const SETTINGS_KEY = 'appSettings';
export const COLLECTION_COUNT_KEY = 'collectionCount';
export const FAVOURITES_COUNT_KEY = 'favouritesCount';

export const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(e);
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};

export const shuffleWords = (words: Word[]) => {
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words;
};

export const getSession = async (): Promise<string> => {
  return await getData(SESSION_KEY);
};

export const storeSession = async (session: string) => {
  await storeData(SESSION_KEY, session);
};

export const removeSession = async () => {
  await removeData(SESSION_KEY);
};

export const initLocalStorage = () => {
  try {
    storeData(COLLECTION_COUNT_KEY, vocabs.length);
  } catch (error) {
    console.error('Failed to store word count in local storage');
  }
};

export const getCollectionsWordCount = async () => {
  try {
    const collectionsWordCount = await getData(COLLECTION_COUNT_KEY);
    return collectionsWordCount;
  } catch (error) {
    console.error('Failed to get collections word count');
    return null;
  }
};

export const getAllCollectionNamesSorted = async (): Promise<string[]> => {
  try {
    const collectionNames = (await AsyncStorage.getAllKeys()).filter(
      (key) => key.split(' ')[0] === 'Collection'
    );
    return collectionNames.toSorted(
      (a, b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1])
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getShuffledWords = async (collection: string): Promise<Word[]> => {
  const words: Word[] = await getData(collection);
  const shuffledWords = shuffleWords(words);
  return shuffledWords;
};

export const getOrderedWords = async (collection: string): Promise<Word[]> => {
  const words: Word[] = await getData(collection);
  return words;
};

export const getSettings = async (): Promise<Settings> => {
  return getData(SETTINGS_KEY);
};

export const storeSettings = async (settings: Settings) => {
  await storeData(SETTINGS_KEY, settings);
};
