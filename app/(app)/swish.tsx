import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Text } from 'react-native-paper';
import TipBanner from '../../components/Banner';
import Fallback from '../../components/Fallback';
import { useSettings } from '../../components/SettingsProvider';
import SwishCard from '../../components/SwishCard';
import { getOrderedWords, getShuffledWords } from '../../database/db.config';
import { DisplayOrder, Word } from '../../global';

const generateRandomBooleans = (wordCount: number) =>
  Array.from({ length: wordCount }, () => Math.random() >= 0.5);

const SwishScreen = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [displayOrderList, setDisplayOrderList] = useState<boolean[]>([]);
  const { settings } = useSettings();

  const { collection } = useLocalSearchParams<{ collection?: string }>();

  const initWords = async () => {
    let _words: Word[] = [];
    if (settings.shuffled) {
      _words = await getShuffledWords(collection!);
    } else {
      _words = await getOrderedWords(collection!);
    }
    setWords(_words);

    let _displayOrder: boolean[] = [];
    if (settings.displayOrder === DisplayOrder.Alternate) {
      _displayOrder = generateRandomBooleans(_words.length);
    } else if (settings.displayOrder === DisplayOrder.FrontFirst) {
      _displayOrder = Array.from({ length: _words.length }, () => true);
    } else if (settings.displayOrder === DisplayOrder.BackFirst) {
      _displayOrder = Array.from({ length: _words.length }, () => false);
    } else {
      console.error('Invalid argument passed as DisplayOrder');
    }
    setDisplayOrderList(_displayOrder);
  };

  useEffect(() => {
    initWords();
  }, []);

  if (!words.length) return <Fallback duration={3000} />;

  return (
    <View>
      <Swiper
        cards={words}
        renderCard={(word: Word, index: number) => (
          <SwishCard
            cardIndex={index + 1}
            word={word}
            englishFirst={displayOrderList[index]}
          />
        )}
        cardIndex={0}
        backgroundColor="lightgrey"
        onSwipedAll={() => router.back()}
      />
      <TipBanner buttonStyle={styles.buttonStyle}>
        <View style={styles.bannerContainer}>
          <Text>Double tap or click to flip the card</Text>
          <Text>Swipe left or right to view the next card</Text>
        </View>
      </TipBanner>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    margin: 20,
    width: 200,
  },
  bannerContainer: {
    gap: 10,
    height: 30,
  },
});

export default SwishScreen;
