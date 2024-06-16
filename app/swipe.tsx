import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Swiper from 'react-native-deck-swiper';
import Fallback from '../components/Fallback';
import FlipCardContainer from '../components/FlipCardContainer';
import { getWords } from '../db.config';
import { Word } from '../interface';

const generateRandomBooleans = (wordCount: number) =>
  Array.from({ length: wordCount }, () => Math.random() >= 0.5);

const SwipeScreen = () => {
  const [words, setWords] = useState<Word[]>([]);
  const { collection } = useLocalSearchParams<{ collection?: string }>();
  const [reverseList, setReverseList] = useState<boolean[]>([]);
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      const words: Word[] = await getWords(collection!);
      setWords(words);
      const booleanList = generateRandomBooleans(words.length);
      setReverseList(booleanList);
    };
    initialize();
  }, []);

  if (words.length === 0 || reverseList.length === 0) return <Fallback />;

  return (
    <Swiper
      cards={words}
      renderCard={(word: Word, index: number) => (
        <FlipCardContainer
          cardIndex={index + 1}
          word={word}
          reversed={reverseList[index]}
        />
      )}
      cardIndex={0}
      backgroundColor="lightgrey"
      onSwipedAll={() => router.back()}
    />
  );
};

export default SwipeScreen;
