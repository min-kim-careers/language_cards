import { Link, router, useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
} from 'react-native-paper';
import { useSession } from '../../../components/SessionProvider';
import { fetchFavouritesWordCount } from '../../../database/supabase.config';
import { ELEMENT_WIDTH } from '../../../global';

const DEFAULT_LIMIT = 10;

const FavouritesScreen = () => {
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const { session, isAnonymous } = useSession();

  const getFavouritesCount = async () => {
    if (session) {
      const wordCount = await fetchFavouritesWordCount(session);
      if (wordCount) {
        setWordCount(wordCount);
        const newFavouritesCount = Math.ceil(wordCount / DEFAULT_LIMIT);
        setFavouritesCount(newFavouritesCount);
      }
    }
  };

  const handleRefreshButton = () => {
    setLoading(true);
    getFavouritesCount();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleSelectorButton = () => {
    router.push({
      pathname: '/selector',
      params: {
        wordCountParam: wordCount,
      },
    });
  };

  useFocusEffect(() => {
    if (!isAnonymous!()) {
      getFavouritesCount();
    }
  });

  if (isAnonymous!()) {
    return (
      <View style={styles.container}>
        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
          Please sign in if you would like to favourite your words for a better
          experience!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : !favouritesCount ? (
        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
          Nothing in favourites. Add some words!
        </Text>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {Array.from({ length: favouritesCount }, (_, index) => index).map(
            (index) => (
              <Link
                key={index}
                push
                href={{
                  pathname: '/swish',
                  params: {
                    from: index * limit,
                    to: index * limit + limit,
                    favourites: 'true',
                  },
                }}
                asChild
              >
                <Button mode="contained" style={styles.swishButton}>
                  {`Favourites ${index + 1} (${
                    index * limit + limit < wordCount
                      ? 10
                      : wordCount - index * limit
                  })`}
                </Button>
              </Link>
            )
          )}
        </ScrollView>
      )}
      <IconButton
        icon="refresh"
        size={36}
        style={styles.refreshButton}
        onPress={handleRefreshButton}
        disabled={loading}
      />

      {/* <IconButton
        icon="table-large"
        size={36}
        style={styles.selectorButton}
        onPress={handleSelectorButton}
      /> */}
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
