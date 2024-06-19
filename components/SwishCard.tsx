import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { Card, Text } from 'react-native-paper';
import { ELEMENT_WIDTH, Word } from '../global';
import AudioPlayer from './AudioPlayer';

interface CardProps {
  cardIndex: number;
  word: Word;
  englishFirst: boolean;
}

const SwishCard = ({ cardIndex, word, englishFirst = false }: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [lastPress, setLastPress] = useState(0);

  const handleDoubleTap = () => {
    const currentTime = new Date().getTime();
    const delta = currentTime - lastPress;
    const delay = 300;
    if (delta < delay) setIsFlipped(!isFlipped);
    setLastPress(currentTime);
  };

  return (
    <TouchableOpacity
      onPress={handleDoubleTap}
      activeOpacity={1}
      style={{
        flex: 1,
      }}
    >
      <FlipCard
        friction={10}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={isFlipped}
        clickable={false}
      >
        <CardSide
          cardIndex={cardIndex}
          word={word}
          isFront={true}
          englishFirst={englishFirst}
        />
        <CardSide
          cardIndex={cardIndex}
          word={word}
          isFront={false}
          englishFirst={englishFirst}
        />
      </FlipCard>
    </TouchableOpacity>
  );
};

interface CardSideProps {
  cardIndex: number;
  word: Word;
  isFront: boolean;
  englishFirst: boolean;
}

const CardSide = ({
  cardIndex,
  word,
  isFront,
  englishFirst,
}: CardSideProps) => {
  return (
    <View style={styles.container}>
      <Card style={styles.cardContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text>{word.word_grade || ''}</Text>
          <Text style={styles.headerText}>{cardIndex} / 10</Text>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.bodyText}>
            {isFront
              ? englishFirst
                ? word.english
                : word.korean
              : englishFirst
              ? word.korean
              : word.english}
          </Text>
          <Text>{!isFront && word.origin}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{word.pos}</Text>
          {((!isFront && englishFirst) || (isFront && !englishFirst)) &&
            word.url && <AudioPlayer soundUrl={word.url} />}
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: ELEMENT_WIDTH,
    height: 500,
  },
  header: {
    width: ELEMENT_WIDTH,
    height: 25,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 5,
    flexDirection: 'row',
  },
  headerText: {
    // fontWeight: 'bold',
  },
  body: {
    height: 450,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyText: {
    fontSize: 40,
  },
  footer: {
    width: ELEMENT_WIDTH,
    height: 25,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 5,
    flexDirection: 'row',
  },
});

export default SwishCard;
