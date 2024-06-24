import { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Snackbar, Text } from 'react-native-paper';
import { Word } from '../global';
import { fetchWordsBetweenRangeForWordSelector } from '../database/supabase.config';

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

const WordSelector = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [words, setWords] = useState<Word[]>([]);
  const [toast, setToast] = useState<string>('');
  const [[from, to], setRange] = useState([0, DEFAULT_LIMIT]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      const res = await fetchWordsBetweenRangeForWordSelector(from, to);
      if (res) setWords(res);
    };
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
    <Modal animationType="slide" visible={isVisible}>

      <View style={styles.container}>
        <View style={styles.closeButton}>
          <Entypo name="cross" size={24} color="black" onPress={onClose} />
        </View>
        <FlatList
          ListHeaderComponent={() => <FlatListHeader />}
          data={words}
          renderItem={renderItem}
          keyExtractor={(word) => word.word_id.toString()}
          extraData={selectedIds}
        />
      </View>

      <Snackbar visible={toast.length !== 0} onDismiss={() => setToast('')}>
        {toast}
      </Snackbar>
    </Modal>
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
});

export default WordSelector;
