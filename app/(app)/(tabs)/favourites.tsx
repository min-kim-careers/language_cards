import { Link, router, useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
} from 'react-native-paper';
import { useSession } from '../../../components/session-provider';
import {
  fetchFavouritesWordCount,
  fetchWordsForFavouritesPreview,
} from '../../../database/supabase.config';
import { ELEMENT_WIDTH, WordPreview } from '../../../global';
import { LongPressGestureHandler } from 'react-native-gesture-handler';
import WordPreviewer from '../../../components/word-previewer';
import HintIcon from '../../../components/hint-icon';

const DEFAULT_LIMIT = 10;

const FavouritesScreen = () => {
  const [wordPreviews, setWordPreviews] = useState<WordPreview[] | null>(null);

  const [favouritesCount, setFavouritesCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const { session, isAnonymous } = useSession();

  const initFavourites = async () => {
    if (session) {
      const wordCount = await fetchFavouritesWordCount(session);
      if (wordCount) {
        setWordCount(wordCount);
        const newFavouritesCount = Math.ceil(wordCount / DEFAULT_LIMIT);
        setFavouritesCount(newFavouritesCount);
      } else {
        setWordCount(0);
        setFavouritesCount(0);
      }
    }
  };

  const handleLongPress = async (from: number, to: number) => {
    if (session) {
      const previews = await fetchWordsForFavouritesPreview(from, to, session);
      if (previews) setWordPreviews(previews);
    }
  };

  const handleRefreshButton = () => {
    const minLoadingDuration = 2000;
    setLoading(true);
    initFavourites();
    setTimeout(() => {
      setLoading(false);
    }, minLoadingDuration);
  };

  useFocusEffect(() => {
    if (!isAnonymous) {
      initFavourites();
    }
  });

  const from = (index: number) => {
    return index * limit;
  };

  const to = (index: number) => {
    return index * limit + limit;
  };

  if (isAnonymous) {
    return (
      <View style={styles.container}>
        <Text
          variant='bodyLarge'
          style={{ textAlign: 'center' }}
        >
          Please sign in if you would like to favourite your words for a better
          experience!
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!favouritesCount) {
    return (
      <View style={styles.container}>
        <Text
          variant='bodyLarge'
          style={{ textAlign: 'center' }}
        >
          Nothing in favourites. Add some words!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {Array.from({ length: favouritesCount }, (_, index) => index).map(
          (index) => (
            <LongPressGestureHandler
              onActivated={() => handleLongPress(from(index), to(index))}
              onEnded={() => setWordPreviews(null)}
              minDurationMs={800}
              key={index}
            >
              <Link
                key={index}
                push
                href={{
                  pathname: '/swish',
                  params: {
                    from: from(index),
                    to: to(index),
                    favourites: 'true',
                    pushed: 'true',
                  },
                }}
                asChild
              >
                <Button
                  mode='contained'
                  style={styles.swishButton}
                >
                  {`Favourites ${index + 1} (${
                    to(index) < wordCount ? 10 : wordCount - from(index)
                  })`}
                </Button>
              </Link>
            </LongPressGestureHandler>
          )
        )}
      </ScrollView>
      <IconButton
        icon='refresh'
        size={36}
        style={styles.refreshButton}
        onPress={handleRefreshButton}
        disabled={loading}
      />
      <WordPreviewer wordPreviews={wordPreviews} />

      <HintIcon />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  scrollView: {
    width: '100%',
    paddingVertical: 20,
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  swishButton: {
    width: ELEMENT_WIDTH,
    height: 50,
    justifyContent: 'center',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 10,
  },
  selectorButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    margin: 10,
  },
});

export default FavouritesScreen;
