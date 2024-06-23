import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { Card, Text, TextInput } from 'react-native-paper';
import { ELEMENT_WIDTH, Word } from '../global';
import AudioPlayer from './AudioPlayer';

interface CardProps {
  cardIndex: number;
  word: Word;
  wordCount: number;
  englishFirst: boolean;
}

const SwishCard = ({
  cardIndex,
  word,
  wordCount,
  englishFirst = false,
}: CardProps) => {
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
          wordCount={wordCount}
          isFront={true}
          englishFirst={englishFirst}
        />
        <CardSide
          cardIndex={cardIndex}
          word={word}
          wordCount={wordCount}
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
  wordCount: number;
  isFront: boolean;
  englishFirst: boolean;
}

const CardSide = ({
  cardIndex,
  word,
  wordCount,
  isFront,
  englishFirst,
}: CardSideProps) => {
  const [input, setInput] = useState('');
  const [correct, setCorrect] = useState(false);

  const handleTextInput = (e: string) => {
    if (e === (englishFirst ? word.korean : word.english)) {
      setCorrect(true);
    } else {
      setCorrect(false);
    }
    setInput(e);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.cardContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text>{word.word_grade || ''}</Text>
          <Text style={styles.headerText}>
            {cardIndex} / {wordCount}
          </Text>
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
          <View style={styles.inputContainer}>
            {isFront && (
              <TextInput
                value={input}
                onChangeText={(e) => handleTextInput(e)}
                mode="flat"
                placeholder="Guess"
                style={styles.input}
                right={correct && <TextInput.Icon icon="check" color="green" />}
              />
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{word.pos}</Text>
          {((!isFront && englishFirst) || (isFront && !englishFirst)) &&
            word.url !== '' && <AudioPlayer soundUrl={word.url!} />}
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    gap: 10,
  },
  bodyText: {
    fontSize: 40,
  },
  inputContainer: {
    width: 150,
  },
  input: {
    backgroundColor: 'white',
    textAlign: 'center',
  },
  inputIcon: {},
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
