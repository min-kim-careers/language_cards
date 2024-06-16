import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from 'react-native-paper';
import Fallback from '../components/Fallback';
import { getAllKeysSorted } from '../db.config';

const HomeScreen = () => {
  const [collections, setCollections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const collections = await getAllKeysSorted();
      setCollections(collections ?? []);
      setLoading(false);
    };
    initialize();
  }, [loading]);

  if (loading) return <Fallback />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
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
