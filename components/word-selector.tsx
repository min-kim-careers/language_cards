import { Octicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import {
  addMultipleFavourites,
  fetchAllFavouritesForUser,
  removeMultipleFavourites,
} from '../database/supabase.config';
import vocabs from '../database/vocabs.json';
import { useSession } from './session-provider';
import { useFocusEffect } from 'expo-router';

interface Word {
  word_id: number;
  korean: string;
  english: string;
}

export type SelectorType = 'append' | 'remove';

const WordSelector = ({ selectorType }: { selectorType: SelectorType }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const [words, setWords] = useState<Word[]>([]);
  const [queriedWords, setQueriedWords] = useState<Word[]>([]);
  const [selectedWordIds, setSelectedWordIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const { session, isAnonymous } = useSession();

  const initWordAppender = () => {
    if (selectorType === 'append') {
      if (vocabs) setWords(vocabs);
      if (words) setQueriedWords(words);
    }
  };

  const initWordRemover = async () => {
    if (selectorType === 'remove' && session) {
      const newWords = await fetchAllFavouritesForUser(session);
      if (newWords) setWords(newWords);
      if (newWords) setQueriedWords(newWords);
    }
  };

  useEffect(() => {
    initWordAppender();
  }, [words]);

  useFocusEffect(
    useCallback(() => {
      initWordRemover();
    }, [])
  );

  useEffect(() => {
    if (!searchQuery) {
      setQueriedWords(words);
    } else {
      const queriedWords = words.filter((w) =>
        w.english.startsWith(searchQuery)
      );
      setQueriedWords(queriedWords);
    }
  }, [searchQuery]);

  const handleSelectorButton = async () => {
    if (selectedWordIds.length > 0) {
      setLoading(true);

      if (session) {
        if (selectorType === 'append') {
          await addMultipleFavourites(session, selectedWordIds);
        } else if (selectorType === 'remove') {
          await removeMultipleFavourites(session, selectedWordIds);
        }
      }

      setTimeout(() => {
        setLoading(false);
        if (selectorType === 'append') {
          setToast('Words were successfully added! (if not duplicates)');
        } else if (selectorType === 'remove') {
          setToast('Words were successfully removed! (if not duplicates)');
          initWordRemover();
        }
        setSelectedWordIds([]);
      }, 2000);
    } else {
      setToast('No words were selected');
    }
  };

  return (
    <View className='flex-1 items-center'>
      <View className='flex-[2] justify-center items-center w-[80%]'>
        <TextInput
          className='w-full p-4 border-[1px] border-[lightgrey] rounded-md'
          placeholder='Search'
          onChangeText={(text: string) => {
            setSearchQuery(text);
            setSelectedWordIds([]);
          }}
          value={searchQuery}
        />
      </View>

      <View className='flex-[10] w-[80%] border-[1px] border-[lightgrey] rounded-md py-1'>
        <ScrollView>
          {queriedWords.map((word) => (
            <RowItem
              key={word.word_id}
              selectedWordIdsState={[selectedWordIds, setSelectedWordIds]}
              word={word}
            />
          ))}
        </ScrollView>
      </View>

      {loading && <LoadingScreen selectorType={selectorType} />}

      {!isAnonymous && (
        <SelectorButton
          selectorType={selectorType}
          onPress={handleSelectorButton}
        />
      )}

      <Toast toastState={[toast, setToast]} />

      <View className='flex-[0.5]' />
    </View>
  );
};

const RowItem = ({
  selectedWordIdsState,
  word,
}: {
  selectedWordIdsState: [
    number[],
    React.Dispatch<React.SetStateAction<number[]>>
  ];
  word: Word;
}) => {
  const [selectedWordIds, setSelectedWordIds] = selectedWordIdsState;

  const handleSelection = (word_id: number) => {
    if (selectedWordIds.includes(word_id)) {
      setSelectedWordIds((prev) => prev.filter((p) => p !== word_id));
    } else {
      setSelectedWordIds((prev) => [...prev, word.word_id]);
    }
  };

  return (
    <View
      style={{
        width: '100%',
      }}
    >
      <Pressable
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          height: 30,
          alignItems: 'center',
          backgroundColor: selectedWordIds.includes(word.word_id)
            ? 'lightgrey'
            : '',
        }}
        onPress={() => handleSelection(word.word_id)}
      >
        <Text style={{ flex: 1, textAlign: 'center' }}>{word.word_id}</Text>
        <Text style={{ flex: 1, textAlign: 'left' }}>{word.english}</Text>
        <Text style={{ flex: 1, textAlign: 'left' }}>{word.korean}</Text>
      </Pressable>
    </View>
  );
};

const SelectorButton = ({
  selectorType,
  onPress,
}: {
  selectorType: SelectorType;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      className='absolute bottom-6 bg-gray-500 p-3 rounded-xl shadow-sm'
    >
      {selectorType === 'append' && (
        <Text className='text-white'>Add Words</Text>
      )}
      {selectorType === 'remove' && (
        <Text className='text-white'>Remove Words</Text>
      )}
    </Pressable>
  );
};

const LoadingScreen = ({ selectorType }: { selectorType: SelectorType }) => {
  return (
    <View
      style={{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className='h-screen w-screen'
    >
      <ActivityIndicator size={'large'} />
      <Text
        style={{
          padding: 30,
        }}
      >
        {selectorType === 'append' && 'Adding the words to your favourites'}
        {selectorType === 'remove' && 'Removing words from your favourites'}
      </Text>
    </View>
  );
};

const Toast = ({
  toastState,
}: {
  toastState: [string, React.Dispatch<React.SetStateAction<string>>];
}) => {
  const [toast, setToast] = toastState;

  return (
    <Snackbar
      visible={toast.length !== 0}
      onDismiss={() => setToast('')}
      duration={5000}
    >
      <View
        style={{
          justifyContent: 'space-evenly',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Text
          style={{
            color: 'white',
          }}
        >
          {toast}
        </Text>
        <Octicons
          name='thumbsup'
          size={24}
          color='white'
        />
      </View>
    </Snackbar>
  );
};

export default WordSelector;
