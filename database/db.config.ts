import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, Word } from '../global';
import vocabs from './vocabs.json';
import { supabase } from '../services/supabase';
import { useSession } from '../components/SessionProvider';

// ASYNCSTORAGE FUNCTIONS

const _storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

const _removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
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

const sessionKey = 'appSession';

export const getSession = async (): Promise<string> => {
  return await _getData(sessionKey);
};

export const storeSession = async (session: string) => {
  await _storeData(sessionKey, session);
};

export const removeSession = async () => {
  await _removeData(sessionKey);
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

export const getFavourites = async () => {
  return _getData(FAVOURITES_KEY) || [];
};

// SUPABASE FUNCTIONS

const VOCABS_TABLE = 'vocabs';
const COLLECTION_COUNT_KEY = 'collectionCount';

export const fetchCollectionCount = async (
  limit: number
): Promise<number | null> => {
  const result = await _getData(COLLECTION_COUNT_KEY);
  if (result) {
    console.log('Retrieved collection count from cache');
    return result;
  }
  const { count, error } = await supabase
    .from(VOCABS_TABLE)
    .select('*', { count: 'exact', head: true });
  if (error) {
    console.error(error);
    return null;
  }
  if (!count) {
    console.error('Database was empty..');
    return null;
  }
  const collectionCount = Math.floor(count! / limit);
  _storeData('collectionCount', collectionCount);
  console.log('Fetched collectionCount from DB');
  return collectionCount;
};

export const fetchWordsForCollection = async (
  from: number,
  to: number,
  shuffled: boolean = false
): Promise<Word[] | null> => {
  const { data, error } = await supabase
    .from(VOCABS_TABLE)
    .select()
    .range(from, to);
  if (error) {
    console.error(error);
    return null;
  }
  if (!data) {
    console.error('No words fetched..');
    return null;
  }
  if (shuffled) {
    return _shuffleWords(data);
  }
  return data;
};

export const fetchWordsForFavourites = async (
  favourites: number[],
  shuffled: boolean = false
): Promise<Word[] | null> => {
  const { data, error } = await supabase
    .from(VOCABS_TABLE)
    .select()
    .in('id', favourites);
  if (error) {
    console.error(error);
    return null;
  }
  if (!data) {
    console.error('No words fetched..');
    return null;
  }
  if (shuffled) {
    return _shuffleWords(data);
  }
  return data;
};

const FAVOURITES_TABLE = 'favourites';

const FAVOURITES_KEY = 'favourites';

const _getWordIds = async (userId: string) => {
  const { data } = await supabase
    .from(FAVOURITES_TABLE)
    .select('word_ids')
    .eq('user_id', userId)
    .single();
  if (!data) return [];
  return data.word_ids;
};

export const updateFavourites = async (
  userId: string,
  wordIds: number[]
): Promise<number[] | null> => {
  const prevWordIds: number[] = await _getWordIds(userId);

  const newWordIds: number[] = Array.from(
    new Set([...prevWordIds, ...wordIds])
  ).toSorted();

  if (prevWordIds.length === newWordIds.length) {
    console.log('Nothing to update..');
    return prevWordIds;
  }

  const { data, error } = await supabase
    .from(FAVOURITES_TABLE)
    .upsert({ user_id: userId, word_ids: newWordIds })
    .select()
    .single();
  if (error) {
    console.error('Error updating word IDs:', error);
    return null;
  }
  _storeData(FAVOURITES_KEY, data.word_ids);
  console.log('Word IDs updated and cached successfully');
  return data.word_ids || [];
};

const USER_TABLE = 'users';

export const addUserToDB = async (userId: string) => {
  const { data, error } = await supabase
    .from(USER_TABLE)
    .insert({ user_id: userId })
    .select();
  if (error) {
    console.error('Error adding user to Supabase:', error);
  }
  if (data) {
    console.log('Successfully added user to Supabase');
  }
};

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';

const _authDB = async (session: string) => {
  const response = await fetch(SUPABASE_URL, {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  });
  return response.ok;
};
