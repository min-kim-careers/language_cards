import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Fallback from '../../../components/fallback';
import { useSession } from '../../../components/session-provider';
import {
  fetchCollectionsWordCount,
  fetchWordsForCollectionPreview,
} from '../../../database/supabase.config';
import { ELEMENT_WIDTH, WordPreview } from '../../../global';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';
import WordPreviewer from '../../../components/word-previewer';
import HintIcon from '../../../components/hint-icon';

const DEFAULT_LIMIT = 10;
const ANONYMOUS_COUNT = 2;

const CollectionsScreen = () => {
  const [wordPreviews, setWordPreviews] = useState<WordPreview[] | null>(null);

  const [collectionsCount, setCollectionsCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [wordCount, setWordCount] = useState(0);

  const { isAnonymous } = useSession();

  const handleLongPress = async (from: number, to: number) => {
    const previews = await fetchWordsForCollectionPreview(from, to);
    if (previews) setWordPreviews(previews);
  };

  const getCollectionsCount = async () => {
    if (isAnonymous!()) {
      setCollectionsCount(ANONYMOUS_COUNT);
      setWordCount(ANONYMOUS_COUNT * DEFAULT_LIMIT);
      return;
    }
    const wordCount = await fetchCollectionsWordCount();
    if (wordCount) {
      setWordCount(wordCount);
      const collectionsCount = Math.ceil(wordCount / DEFAULT_LIMIT);
      setCollectionsCount(collectionsCount);
    } else {
      setWordCount(0);
      setCollectionsCount(0);
    }
  };

  useEffect(() => {
    getCollectionsCount();
  });

  const from = (index: number) => {
    return index * limit;
  };

  const to = (index: number) => {
    return index * limit + limit;
  };

  if (!collectionsCount) return <Fallback />;


  if (isAnonymous!()) {
    return (
      <View style={styles.container}>
        <Text variant='bodyLarge'>Sign in for more words!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {Array.from({ length: collectionsCount }, (_, index) => index).map(
          (index) => (
            <LongPressGestureHandler
              onActivated={() => handleLongPress(from(index), to(index))}
              onEnded={() => setWordPreviews(null)}
              minDurationMs={800}
              key={index}
            >
              <Link
                push
                href={{
                  pathname: '/swish',
                  params: { from: from(index), to: to(index) },
                }}
                asChild
              >
                <Button
                  mode='contained'
                  style={styles.button}
                >
                  {`Collection ${index + 1} (${
                    to(index) < wordCount ? 10 : wordCount - index * limit
                  })`}
                </Button>
              </Link>
            </LongPressGestureHandler>
          )
        )}
      </ScrollView>
      <WordPreviewer wordPreviews={wordPreviews} />
      <HintIcon/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  button: {
    width: ELEMENT_WIDTH,
    height: 50,
    justifyContent: 'center',
  },
});

export default CollectionsScreen;
