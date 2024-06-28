import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Snackbar, Text } from 'react-native-paper';
import { Word } from '../../global';
import { fetchWordsBetweenRangeForFavourites } from '../../database/supabase.config';
import { useSession } from '../../components/SessionProvider';

const DEFAULT_LIMIT = 10;

const Item = ({
  word,
  onPress,
  backgroundColor,
  textColor,
}: {
  word: Word;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.itemContainer, { backgroundColor }]}
  >
    <Text style={[styles.rowItems, { color: textColor }]}>{word.word_id}</Text>
    <Text style={[styles.rowItems, { color: textColor }]}>{word.english}</Text>
    <Text style={[styles.rowItems, { color: textColor }]}>{word.korean}</Text>
  </TouchableOpacity>
);

const FlatListHeader = () => {
  return (
    <View style={styles.itemContainer}>
      <Text style={[styles.rowItems, styles.rowHeader]}>Word no.</Text>
      <Text style={[styles.rowItems, styles.rowHeader]}>English</Text>
      <Text style={[styles.rowItems, styles.rowHeader]}>Korean</Text>
    </View>
  );
};

const WordSelector = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [toast, setToast] = useState<string>('');
  const [[from, to], setRange] = useState([0, DEFAULT_LIMIT]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { session } = useSession();

  const fetchWords = async () => {
    const newWords = await fetchWordsBetweenRangeForFavourites(
      from,
      to,
      session!
    );
    if (newWords) setWords(newWords);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleNextPage = async () => {};

  const handlePreviousPage = async () => {};

  const renderItem = ({ item: word }: { item: Word }) => {
    const itemSelected = selectedIds.includes(word.word_id);
    const backgroundColor = itemSelected ? 'grey' : 'lightgrey';
    const color = itemSelected ? 'white' : 'black';

    return (
      <Item
        word={word}
        onPress={() => {
          if (itemSelected) {
            setSelectedIds(selectedIds.filter((id) => id !== word.word_id));
          } else {
            setSelectedIds([...selectedIds, word.word_id]);
          }
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={() => <FlatListHeader />}
        data={words}
        renderItem={renderItem}
        keyExtractor={(word) => word.word_id.toString()}
        extraData={selectedIds}
      />
      <View style={styles.buttonsContainer}>
        <IconButton icon='arrow-left'/>
        <IconButton icon='delete-outline'/>
      </View>
      <Snackbar visible={toast.length !== 0} onDismiss={() => setToast('')}>
        {toast}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
  },
  closeButton: {
    alignItems: 'flex-end',
  },
  itemContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  rowHeader: {
    fontWeight: 'bold',
    backgroundColor: '#36454F',
    color: 'white',
  },
  rowItems: {
    alignContent: 'center',
    textAlign: 'center',
    width: 130,
    height: 50,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 70
  }
});

export default WordSelector;
