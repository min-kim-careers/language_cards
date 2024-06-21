import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Text } from 'react-native-paper';
import TipBanner from '../../components/Banner';
import Fallback from '../../components/Fallback';
import { useSettings } from '../../components/SettingsProvider';
import SwishCard from '../../components/SwishCard';
import {
  fetchWordsForCollection,
  fetchWordsForFavourites,
  updateFavourites,
} from '../../database/db.config';
import { DisplayOrder, Word } from '../../global';

const generateRandomBooleans = (wordCount: number) =>
  Array.from({ length: wordCount }, () => Math.random() >= 0.5);

const SwishScreen = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [displayOrderList, setDisplayOrderList] = useState<boolean[]>([]);
  const [favouriteIds, setFavouriteIds] = useState<number[]>([]);

  const { settings } = useSettings();

  const { from, to, favourites } = useLocalSearchParams<{
    from?: string;
    to?: string;
    favourites?: string;
  }>();

  const fetchWords = async () => {
    let newWords: Word[] | null = [];
    if (from && to) {
      newWords = await fetchWordsForCollection(
        parseInt(from!),
        parseInt(to!),
        settings.shuffled
      );
    } else if (favourites) {
      newWords = await fetchWordsForFavourites(
        favourites.split(',').map((e) => parseInt(e)),
        settings.shuffled
      );
    } else {
      console.error('Unable to fetch words in swish.tsx');
    }

    if (newWords) {
      setWords(newWords);

      let _displayOrder: boolean[] = [];
      if (settings.displayOrder === DisplayOrder.Alternate) {
        _displayOrder = generateRandomBooleans(newWords.length);
      } else if (settings.displayOrder === DisplayOrder.FrontFirst) {
        _displayOrder = Array.from({ length: newWords.length }, () => true);
      } else if (settings.displayOrder === DisplayOrder.BackFirst) {
        _displayOrder = Array.from({ length: newWords.length }, () => false);
      } else {
        console.error('Invalid argument passed as DisplayOrder');
      }
      setDisplayOrderList(_displayOrder);
    }
  };

  useEffect(() => {
    fetchWords();

    BackHandler.addEventListener('hardwareBackPress', () => {
      if (favouriteIds.length) updateFavourites(favouriteIds);
      console.log('back pressed');
      
      return true;
    });
  }, []);

  const handleOnSwipeTop = (cardIndex: number) => {
    setFavouriteIds([...favouriteIds, cardIndex]);
  };

  const handleOnSwipeAll = async () => {
    if (favouriteIds.length) updateFavourites(favouriteIds);
    router.back();
  };

  if (!words.length) return <Fallback duration={5000} />;

  return (
    <View>
      <Swiper
        cards={words}
        renderCard={(word: Word, index: number) => (
          <SwishCard
            cardIndex={index + 1}
            word={word}
            wordCount={words.length}
            englishFirst={displayOrderList[index]}
          />
        )}
        cardIndex={0}
        backgroundColor="lightgrey"
        onSwipedAll={handleOnSwipeAll}
        showSecondCard={true}
        stackSize={2}
        onSwipedTop={(cardIndex: number) =>
          handleOnSwipeTop(words[cardIndex].id)
        }
      />
      <TipBanner buttonStyle={styles.buttonStyle}>
        <View style={styles.bannerContainer}>
          <Text>Double tap or click to flip the card</Text>
          <Text>Swipe LEFT or RIGHT to view the next card</Text>
          <Text>Swipe UP to save word to favourites</Text>
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
    marginBottom: 40,
    width: 200,
  },
  bannerContainer: {
    gap: 10,
    height: 30,
  },
});

export default SwishScreen;
