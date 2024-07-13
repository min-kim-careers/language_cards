import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, View, ViewStyle } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Divider,
  IconButton,
  Portal,
  Searchbar,
  Snackbar,
  Text,
} from 'react-native-paper';
import vocabs from '../database/vocabs.json';
import { addMultipleFavourites } from '../database/supabase.config';
import { useSession } from './session-provider';
import { Octicons } from '@expo/vector-icons';

interface Word {
  word_id: number;
  korean: string;
  english: string;
}

const SearchModal = ({ style }: { style?: ViewStyle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(false);

  const [words, setWords] = useState<Word[]>([]);
  const [queriedWords, setQueriedWords] = useState<Word[]>([]);
  const [selectedWordIds, setSelectedWordIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const { session, isAnonymous } = useSession();

  useEffect(() => {
    if (vocabs) setWords(vocabs);
    if (words) setQueriedWords(words);
  }, [words]);

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

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleAddToFavouritesButton = async () => {
    if (selectedWordIds.length > 0) {
      setLoading(true);
      if (session) await addMultipleFavourites(session, selectedWordIds);
      setTimeout(() => {
        setLoading(false);
        setToast('Words were successfully added! (if not duplicates)');
        setSelectedWordIds([]);
      }, 2000);
    }
  };

  return (
    <View style={style}>
      <Modal
        visible={visible}
        onRequestClose={hideModal}
        animationType='slide'
      >
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon='arrow-left'
            onPress={() => hideModal()}
          />
          <Searchbar
            placeholder='Search'
            onChangeText={(text: string) => {
              setSearchQuery(text);
              setSelectedWordIds([]);
            }}
            value={searchQuery}
          />
        </View>

        <Divider />

        <ScrollView
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {queriedWords.map((word) => (
            <View
              key={word.word_id}
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
                    ? 'grey'
                    : 'white',
                }}
                onPress={() =>
                  setSelectedWordIds((prev) => [...prev, word.word_id])
                }
              >
                <Text style={{ flex: 1, textAlign: 'center' }}>
                  {word.word_id}
                </Text>
                <Text style={{ flex: 1, textAlign: 'left' }}>
                  {word.english}
                </Text>
                <Text style={{ flex: 1, textAlign: 'left' }}>
                  {word.korean}
                </Text>
              </Pressable>
              <Divider />
            </View>
          ))}
        </ScrollView>

        {loading && (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          >
            <ActivityIndicator
              color='white'
              size={'large'}
            />
            <Text
              style={{
                color: 'white',
                padding: 30,
              }}
            >
              Adding the words to your favourites
            </Text>
          </View>
        )}

        {!isAnonymous && (
          <Button
            mode='contained'
            onPress={handleAddToFavouritesButton}
            style={{
              position: 'absolute',
              bottom: '5%',
              alignSelf: 'center',
            }}
          >
            Add to Favourites
          </Button>
        )}

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
      </Modal>

      <IconButton
        icon='magnify'
        onPress={showModal}
      />
    </View>
  );
};

export default SearchModal;
