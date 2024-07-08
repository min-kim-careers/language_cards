import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Portal, Snackbar, Text } from 'react-native-paper';
import Fallback from '../../components/fallback';
import { useSession } from '../../components/session-provider';
import { useSettings } from '../../components/settings-provider';
import SwishCard from '../../components/swish-card';
import TipBanner from '../../components/tip-banner';
import {
  addFavourite,
  favouriteExists,
  fetchWordsBetweenRangeForCollections,
  fetchWordsBetweenRangeForFavourites,
  removeFavourite
} from '../../database/supabase.config';
import { ANONYMOUS, DisplayOrder, ELEMENT_WIDTH, Word } from '../../global';

const generateRandomBooleans = (wordCount: number) => {
  return Array.from({ length: wordCount }, () => Math.random() >= 0.5);
};

const matchDisplayOrder = (displayOrder: string, wordCount: number) => {
  let newDisplayOrder: boolean[] = [];
  if (displayOrder === DisplayOrder.Alternate) {
    newDisplayOrder = generateRandomBooleans(wordCount);
  } else if (displayOrder === DisplayOrder.KoreanFirst) {
    newDisplayOrder = Array.from({ length: wordCount }, () => true);
  } else if (displayOrder === DisplayOrder.EnglishFirst) {
    newDisplayOrder = Array.from({ length: wordCount }, () => false);
  } else {
    console.error('Invalid argument passed as DisplayOrder');
  }
  return newDisplayOrder;
};

const SwishScreen = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(1);

  const [words, setWords] = useState<Word[]>([]);
  const [displayOrderList, setDisplayOrderList] = useState<boolean[]>([]);
  const [toast, setToast] = useState('');

  const { settings } = useSettings();
  const { session } = useSession();

  const { from, to, favourites } = useLocalSearchParams<{
    from?: string;
    to?: string;
    favourites?: string;
  }>();

  const fetchWords = async () => {
    try {
      let newWords: Word[] | null;
      // 1. fetch words from db
      if (favourites && session) {
        newWords = await fetchWordsBetweenRangeForFavourites(
          parseInt(from!),
          parseInt(to!),
          session!,
          settings.shuffled
        );
      } else {
        newWords = await fetchWordsBetweenRangeForCollections(
          parseInt(from!),
          parseInt(to!),
          settings.shuffled
        );
      }
      // 2. set words
      setWords(newWords!);
      // 3. match and get display order list
      const newDisplayOrderList = matchDisplayOrder(
        settings.displayOrder,
        newWords!.length
      );
      // 4. set display order list
      setDisplayOrderList(newDisplayOrderList);
    } catch (error) {
      console.error('Error fetching and loading words for cards');
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleOnSwipeTop = async (cardIndex: number) => {
    if (session === ANONYMOUS) {
      setToast(
        'This function is only available when signed in with an account'
      );
      return;
    }

    if (await favouriteExists(session!, words[cardIndex].word_id)) {
      setToast(`${words[cardIndex].korean} is already in favourites.`);
      return;
    }

    if (await addFavourite(session!, words[cardIndex].word_id)) {
      setToast(`Added ${words[cardIndex].korean} to favourites`);
    } else {
      setToast(
        `There was an error adding ${words[cardIndex].korean} to favourites`
      );
    }
  };

  const handleOnSwipeBottom = async (cardIndex: number) => {
    if (session === ANONYMOUS) {
      setToast(
        'This function is only available when signed in with an account'
      );
      return;
    }

    if (!(await favouriteExists(session!, words[cardIndex].word_id))) {
      setToast(
        `${words[cardIndex].korean} is not in favourites. It can't be removed.`
      );
      return;
    }

    if (await removeFavourite(session!, words[cardIndex].word_id)) {
      setToast(`Removed ${words[cardIndex].korean} from favourites`);
    } else {
      setToast(
        `There was an error removing ${words[cardIndex].korean} from favourites`
      );
    }
  };

  const handleOnSwipeAll = async () => {
    router.canGoBack() ? router.back() : router.replace('/');
  };

  if (!words.length) return <Fallback duration={20000} />;

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
        onSwiped={(cardIndex: number) => setCurrentCardIndex(cardIndex)}
        goBackToPreviousCardOnSwipeLeft
        disableLeftSwipe={currentCardIndex === 1}
        backgroundColor='lightgrey'
        onSwipedAll={handleOnSwipeAll}
        onSwipedTop={(cardIndex: number) => handleOnSwipeTop(cardIndex)}
        onSwipedBottom={(cardIndex: number) => handleOnSwipeBottom(cardIndex)}
      />
      <TipBanner buttonStyle={styles.buttonStyle}>
        <View style={styles.bannerContainer}>
          <Text variant='bodyMedium'>Double TAP/CLICK to flip the card</Text>
          <Text variant='bodyMedium'>Swipe RIGHT to view the next card</Text>
          <Text variant='bodyMedium'>Swipe LEFT to view the previous card</Text>
          {session !== ANONYMOUS && (
            <Text variant='bodyMedium'>Swipe UP to add to favourites</Text>
          )}
          {session !== ANONYMOUS && (
            <Text variant='bodyMedium'>
              Swipe DOWN to remove from favourites
            </Text>
          )}
        </View>
      </TipBanner>

      <Portal>
        <Snackbar
          visible={toast.length !== 0}
          onDismiss={() => setToast('')}
        >
          {toast}
        </Snackbar>
      </Portal>
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
  },
  lastCardContainer: {
    alignItems: 'center',
  },
  lastCard: {
    marginVertical: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: ELEMENT_WIDTH,
    height: 500,
    backgroundColor: 'white',
  },
});

export default SwishScreen;
