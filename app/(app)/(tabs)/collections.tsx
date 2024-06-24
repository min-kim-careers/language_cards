import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { fetchCollectionCount } from '../../../database/supabase.config';
import { ELEMENT_WIDTH } from '../../../global';

const DEFAULT_LIMIT = 10;

const HomeScreen = () => {
  const [collectionCount, setCollectionCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  useEffect(() => {
    const fetchCollections = async () => {
      const res = await fetchCollectionCount(limit);
      if (res) setCollectionCount(res);
    };
    fetchCollections();
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {Array.from({ length: collectionCount }, (_, index) => index).map(
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
                {`Collection ${index + 1}`}
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

export default HomeScreen;
