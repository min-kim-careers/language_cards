import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, Word } from '../global';
import vocabs from './vocabs.json';
import { supabase } from '../services/supabase';

const _storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

const _getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};

const _shuffleWords = (words: Word[]) => {
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words;
};

export const loadDBFile = async () => {
  let temp: Word[] = [];
  let sectionIndex = 1;
  vocabs.forEach((word, index) => {
    try {
      temp.push(word);
      if ((index + 1) % 10 == 0 && index > 0) {
        _storeData(`Collection ${sectionIndex++}`, temp);
        temp = [];
      }
    } catch (error) {
      _storeData(`Collection ${sectionIndex}`, temp);
    }
  });
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
  const words: Word[] = await _getData(collection);
  const shuffledWords = _shuffleWords(words);
  return shuffledWords;
};

export const getOrderedWords = async (collection: string): Promise<Word[]> => {
  const words: Word[] = await _getData(collection);
  return words;
};

const SETTINGS_KEY = 'appSettings';

export const getSettings = async (): Promise<Settings> => {
  return _getData(SETTINGS_KEY);
};

export const storeSettings = async (settings: Settings) => {
  await _storeData(SETTINGS_KEY, settings);
};

// SUPABASE FUNCTIONS

const TABLE_NAME = 'vocabs';

export const fetchCollectionLabels = async (limit: number): Promise<string[] | null> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*', { count: 'exact', head: true })
  if (error) {
    console.error(error);
    return null;
  }
  console.log(data);
  
  return null;
  // for (let i = 0; i < Math.floor(data.count / limit); i++) {

  // }
};
