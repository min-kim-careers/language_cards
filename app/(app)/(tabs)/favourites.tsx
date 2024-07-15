import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  LongPressGestureHandler,
  ScrollView,
} from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import HintButton from '../../../components/hint-button';
import { useSession } from '../../../components/session-provider';
import WordPreviewer from '../../../components/word-previewer';
import { ELEMENT_WIDTH, WordPreview } from '../../../constants/global';
import {
  fetchFavouritesWordCount,
  fetchWordsForFavouritesPreview,
} from '../../../database/supabase.config';

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

  useFocusEffect(
    useCallback(() => {
      initFavourites();
    }, [])
  );

  if (loading) {
    return (
      <View className='justify-center items-center flex-1'>
        <ActivityIndicator />
      </View>
    );
  }

  if (!favouritesCount) {
    return (
      <View className='justify-center items-center flex-1'>
        <Text style={{ textAlign: 'center' }}>
          Nothing in favourites. Add some words!
        </Text>
      </View>
    );
  }

  return (
    <View className='flex-1 justify-center items-center'>
      <View className='flex-[0.5]' />
      <View
        className={`flex-[10]`}
        style={{
          width: ELEMENT_WIDTH,
        }}
      >
        <ScrollView>
          {Array.from({ length: favouritesCount }, (_, index) => index).map(
            (index) => (
              <FavouritesButton
                handleLongPress={handleLongPress}
                index={index}
                limit={limit}
                setWordPreviews={setWordPreviews}
                wordCount={wordCount}
                key={index}
              />
            )
          )}
        </ScrollView>
      </View>
      <View className='flex-[0.5]' />

      <Toolbar
        className='absolute bg-white justify-center items-center bottom-5 left-4 rounded-xl shadow-sm'
        refreshing={loading}
        handleRefreshButton={handleRefreshButton}
      />

      <WordPreviewer wordPreviews={wordPreviews} />
    </View>
  );
};

const Toolbar = ({
  refreshing,
  handleRefreshButton,
  className,
}: {
  refreshing: boolean;
  handleRefreshButton: () => void;
  className?: string;
}) => {
  return (
    <View className={className}>
      <HintButton className='justify-center items-center flex-1' />
      {/* <RefreshButton
        className='justify-center items-center flex-1'
        loading={refreshing}
        onPress={handleRefreshButton}
      /> */}
    </View>
  );
};

const FavouritesButton = ({
  handleLongPress,
  setWordPreviews,
  index,
  wordCount,
  limit,
}: {
  handleLongPress: (from: number, to: number) => void;
  setWordPreviews: React.Dispatch<React.SetStateAction<WordPreview[] | null>>;
  index: number;
  wordCount: number;
  limit: number;
}) => {
  const from = (index: number) => {
    return index * limit;
  };

  const to = (index: number) => {
    return index * limit + limit;
  };

  return (
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
          },
        }}
        className='h-[80px] justify-center items-center bg-[grey] rounded-3xl shadow-sm'
        asChild
      >
        <Pressable>
          <Text style={{ color: 'white' }}>
            {`Favourites ${index + 1} (${
              to(index) < wordCount ? 10 : wordCount - from(index)
            })`}
          </Text>
        </Pressable>
      </Link>
    </LongPressGestureHandler>
  );
};

export default FavouritesScreen;
