import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSession } from '../../../components/SessionProvider';
import { fetchFavouritesCount } from '../../../database/supabase.config';
import { ANONYMOUS, ELEMENT_WIDTH } from '../../../global';

const DEFAULT_LIMIT = 10;

const FavouritesScreen = () => {
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const { session } = useSession();

  const getFavouritesCount = async () => {
    const res = await fetchFavouritesCount(session!, limit);
    setFavouritesCount(res!);
  };

  useEffect(() => {
    getFavouritesCount();
  }, [favouritesCount]);

  if (session === ANONYMOUS) {
    return (
      <View style={styles.container}>
        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
          Please sign in if you would like to favourite your words for a better
          experience!
        </Text>
      </View>
    );
  }

  if (!favouritesCount) {
    return (
      <View style={styles.container}>
        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
          Nothing in favourites. Add some words!
        </Text>
        <Button
          mode="elevated"
          style={styles.refreshButton}
          onPress={getFavouritesCount}
        >
          Refresh Favourites
        </Button>
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
                {`Favourite ${index + 1}`}
              </Button>
            </Link>
          )
        )}
      </ScrollView>
      <Button
        mode="elevated"
        style={styles.refreshButton}
        onPress={getFavouritesCount}
      >
        Refresh Favourites
      </Button>
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
    margin: 10,
    width: 200,
  },
});

export default FavouritesScreen;
