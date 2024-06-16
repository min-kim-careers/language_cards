import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Word } from '../interface';
// import { getData as getWords } from '../db.config';
import Fallback from '../components/Fallback';
import { Button, Text } from 'react-native-paper';
import { getAllKeysSorted } from '../db.config';

const HomeScreen = () => {
  const [collections, setCollections] = useState<string[]>([]);

  useEffect(() => {
    const initCollections = async () => {
      const collections = (await getAllKeysSorted()) ?? [];
      setCollections(collections);
    };

    initCollections();
  }, []);

  if (!collections || collections.length === 0) <Fallback />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* <View
        style={{
          height: 70,
          margin: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Settings Area</Text>
      </View> */}

      <ScrollView contentContainerStyle={{ flex: 1, gap: 20 }}>
        {collections.map((collection, index) => (
          <Link
            key={index}
            push
            href={{
              pathname: '/swipe',
              params: { collection: collection },
            }}
            asChild
          >
            <Button mode="contained" labelStyle={{ padding: 20 }}>
              {collection}
            </Button>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
