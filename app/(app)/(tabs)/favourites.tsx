import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { getFavourites } from '../../../database/db.config';
import { Link } from 'expo-router';
import { ELEMENT_WIDTH } from '../../../global';

const DEFAULT_LIMIT = 10;

const _splitArray = (array: number[], size: number) => {
  const result: number[][] = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }
  return result;
};

const FavouritesScreen = () => {
  const [favourites, setFavourites] = useState<number[][]>([]);

  useEffect(() => {
    const initFavourites = async () => {
      const newFavourites = await getFavourites();
      if (newFavourites) {
        const splitNewFavourites = _splitArray(newFavourites, DEFAULT_LIMIT);
        if (splitNewFavourites) {
          setFavourites(splitNewFavourites);
        }
      }
    };

    initFavourites();
  }, []);

  if (!favourites.length)
    return (
      <View style={styles.placeHolder}>
        <Text variant="bodyLarge" style={styles.placeHolderText}>
          Nothing here...
        </Text>
      </View>
    );

  return (
    <View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {favourites.map((favourite, index) => (
          <Link
            key={index}
            push
            href={{
              pathname: '/swish',
              params: {
                favourites: favourite,
              },
            }}
            asChild
          >
            <Button mode="contained" style={styles.button}>
              {`Favourites ${index + 1}`}
            </Button>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  placeHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeHolderText: {
    color: 'grey',
  },
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

export default FavouritesScreen;
