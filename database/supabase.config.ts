import { Word } from '../global';
import { supabase } from '../services/supabase';
import {
  COLLECTION_COUNT_KEY,
  getData,
  shuffleWords,
  storeData,
} from './storage.config';

const WORDS_TABLE = 'words';
const FAVOURITES_TABLE = 'favourites';
const USERS_TABLE = 'users';

export const fetchCollectionCount = async (
  limit: number
): Promise<number | null> => {
  const result = await getData(COLLECTION_COUNT_KEY);
  if (result) {
    console.log('Retrieved collection count from cache');
    return result;
  }
  const { count, error } = await supabase
    .from(WORDS_TABLE)
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
  storeData('collectionCount', collectionCount);
  console.log('Fetched collectionCount from DB');
  return collectionCount;
};

export const fetchWordsBetweenRangeForCollections = async (
  from: number,
  to: number,
  shuffled: boolean = false
): Promise<Word[] | null> => {
  const { data, error } = await supabase
    .from(WORDS_TABLE)
    .select()
    .gte('word_id', from)
    .lte('word_id', to);
  if (error) {
    console.error(error);
    return null;
  }
  if (!data) {
    console.error('No words fetched..');
    return null;
  }
  if (shuffled) {
    return shuffleWords(data);
  }
  return data;
};

export const fetchWordsBetweenRangeForWordSelector = async (
  from: number,
  to: number
): Promise<Word[] | null> => {
  const { data, error } = await supabase
    .from(WORDS_TABLE)
    .select(`word_id, korean, english`)
    .gte('word_id', from)
    .lte('word_id', to);
  if (error) {
    console.error(error);
    return null;
  }
  if (!data) {
    console.error('No words fetched..');
    return null;
  }
  return data;
};

export const addNewUser = async (userId: string) => {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .insert({ user_id: userId })
    .select();
  if (error) {
    console.error('Error adding user to Supabase:', error);
  }
  if (data) {
    console.log('Successfully added user to Supabase');
  }
};
