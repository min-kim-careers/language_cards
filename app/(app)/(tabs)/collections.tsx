import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Fallback from '../../../components/Fallback';
import { fetchCollectionsWordCount } from '../../../database/supabase.config';
import { ELEMENT_WIDTH } from '../../../global';

const DEFAULT_LIMIT = 10;

const CollectionsScreen = () => {
  const [collectionsCount, setCollectionsCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [wordCount, setWordCount] = useState(0);

  const initCollectionCount = async () => {
    const wordCount = await fetchCollectionsWordCount();
    if (wordCount) {
      setWordCount(wordCount);
      const collectionsCount = Math.ceil(wordCount / DEFAULT_LIMIT);
      setCollectionsCount(collectionsCount);
    }
  };

  useEffect(() => {
    initCollectionCount();
  });

  if (!collectionsCount) return <Fallback />;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {Array.from({ length: collectionsCount }, (_, index) => index).map(
          (index) => (
            <Link
              key={index}
              push
              href={{
                pathname: '/swish',
                params: { from: index * limit, to: index * limit + limit },
              }}
              asChild
            >
              <Button mode="contained" style={styles.button}>
                {`Collection ${index + 1} (${index * limit + limit < wordCount ? 10 : wordCount - index * limit})`}
              </Button>
            </Link>
          )
        )}
      </ScrollView>
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
