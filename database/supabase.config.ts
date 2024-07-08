import { Word, WordPreview } from '../global';
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

export const fetchCollectionsWordCount = async (): Promise<number | null> => {
  // Check cache first before fetching
  // const result = await getData(COLLECTION_COUNT_KEY);
  // if (result) {
  //   console.log('Retrieved collection count from cache');
  //   return result;
  // }

  const { count, error } = await supabase
    .from(WORDS_TABLE)
    .select('*', { count: 'exact', head: true });
  if (error) {
    console.error('Error fetching collection count:', error);
    return null;
  }
  if (!count) {
    console.log('Zero count retrieved while fetching collection count');
    return null;
  }
  // const collectionCount = Math.floor(count / limit) || 1;

  // Caching collection count
  // storeData(COLLECTION_COUNT_KEY, count);

  console.log('Succesfully fetched and cached collection count');
  return count;
};

export const fetchWordsBetweenRangeForCollections = async (
  from: number,
  to: number,
  shuffled: boolean = false
): Promise<Word[] | null> => {
  const { data, error } = await supabase
    .from(WORDS_TABLE)
    .select()
    .order('word_id', { ascending: true })
    .range(from, to > 1 ? to - 1 : to);
  if (error) {
    console.error('Error fetching words between range for collections:', error);
    return null;
  }
  if (!data) {
    console.log(
      'Empty array returned while fetching words between range for collections'
    );
    return null;
  }
  if (shuffled) {
    return shuffleWords(data);
  }
  console.log('Successfully fetched words between range for collections');
  return data;
};

export const addNewUser = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .insert({ user_id: userId })
    .select();
  if (error) {
    console.error('Error adding user:', error);
    return false;
  }
  console.log('Successfully added user:', data);
  return true;
};

export const addFavourite = async (
  sessionId: string,
  wordId: number,
  collectionName: string = 'My Favourites'
): Promise<boolean> => {
  const { data, error } = await supabase
    .from(FAVOURITES_TABLE)
    .upsert({
      session_id: sessionId,
      word_id: wordId,
      collection_name: collectionName,
    })
    .select();
  if (error) {
    console.error('Error adding favourite:', error);
    return false;
  }
  console.log('Successfully added favourite:', data);
  return true;
};

export const removeFavourite = async (
  sessionId: string,
  wordId: number,
  collectionName: string = 'My Favourites'
): Promise<boolean> => {
  const { data, error } = await supabase
    .from(FAVOURITES_TABLE)
    .delete()
    .match({
      session_id: sessionId,
      word_id: wordId,
      collection_name: collectionName,
    })
    .select();
  if (error) {
    console.error('Error removing favourite:', error);
    return false;
  }
  console.log('Successfully removed favourite:', data);
  return true;
};

export const favouriteExists = async (
  sessionId: string,
  wordId: number,
  collectionName: string = 'My Favourites'
): Promise<boolean> => {
  const { count, error } = await supabase
    .from(FAVOURITES_TABLE)
    .select('*', { count: 'exact', head: true })
    .match({
      session_id: sessionId,
      word_id: wordId,
      collection_name: collectionName,
    })
    .select();
  if (error) {
    console.error('Error checking if word exists:', error);
    return false;
  }
  console.log('Successfully checked word exists:', count);
  return count !== 0;
};

export const fetchFavouritesWordCount = async (session: string) => {
  const { count, error } = await supabase
    .from(FAVOURITES_TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('session_id', session);
  if (error) {
    console.error('Error fetching favourites count:', error);
    return null;
  }
  if (!count) {
    console.log('Zero count retrieved while fetching collection count');
    return 0;
  }

  console.log('Succesfully fetched favourites word count');
  return count;
};

export const fetchWordsBetweenRangeForFavourites = async (
  from: number,
  to: number,
  session: string,
  shuffled: boolean = false
): Promise<Word[] | null> => {
  const { data, error } = await supabase
    .from(FAVOURITES_TABLE)
    .select('words(*)')
    .order('word_id', { ascending: true })
    .eq('session_id', session)
    .range(from, to);
  if (error) {
    console.error('Error fetching words between range for collections:', error);
    return null;
  }
  if (!data) {
    console.log(
      'Empty array returned while fetching words between range for collections'
    );
    return null;
  }
  const words = data.map((o) => o.words as unknown as Word);
  if (shuffled) {
    return shuffleWords(words);
  }
  console.log('Successfully fetched words between range for collections');
  return words;
};

export const fetchWordsForCollectionPreview = async (
  from: number,
  to: number
): Promise<WordPreview[] | null> => {
  const { data, error } = await supabase
    .from(WORDS_TABLE)
    .select('korean, english')
    .order('word_id', { ascending: true })
    .range(from, to > 1 ? to - 1 : to);
  if (error) {
    console.error('Error fetching words for collections preview:', error);
    return null;
  }
  if (!data) {
    console.log(
      'Empty array returned while fetching words for collections preview'
    );
    return null;
  }
  console.log('Successfully fetched words for collections preview');
  return data;
};

export const fetchWordsForFavouritesPreview = async (
  from: number,
  to: number,
  session: string
): Promise<WordPreview[] | null> => {
  const { data, error } = await supabase
    .from(FAVOURITES_TABLE)
    .select('words(korean, english)')
    .order('word_id', { ascending: true })
    .eq('session_id', session)
    .range(from, to);
  if (error) {
    console.error('Error fetching words for favourites preview:', error);
    return null;
  }
  if (!data) {
    console.log(
      'Empty array returned while fetching words for favourites preview'
    );
    return null;
  }
  const previews = data.map((o) => o.words as unknown as WordPreview);
  console.log('Successfully fetched words for favourites preview');
  return previews;
};
