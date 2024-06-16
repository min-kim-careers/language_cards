import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { Card, Text } from 'react-native-paper';
import { Word } from '../interface';

interface CardProps {
  cardIndex: number;
  word: Word;
  reversed?: boolean;
}

const FlipCardContainer = ({
  cardIndex,
  word,
  reversed = false,
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
      style={{ flex: 1 }}
      activeOpacity={1}
    >
      <FlipCard
        friction={10}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={false}
        flip={isFlipped}
        clickable={false}
      >
        <CardFront cardIndex={cardIndex} word={word} reversed={reversed} />
        <CardBack cardIndex={cardIndex} word={word} reversed={reversed} />
      </FlipCard>
    </TouchableOpacity>
  );
};

const CardFront = ({ cardIndex, word, reversed = false }: CardProps) => {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text>{cardIndex} / 10</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyText}>{reversed ? word.korean : word.english}</Text>
      </View>
      <View style={styles.footer}></View>
    </Card>
  );
};

const CardBack = ({ cardIndex, word, reversed = false }: CardProps) => {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text>{cardIndex} / 10</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyText}>{reversed ? word.english : word.korean}</Text>
        <Text>{word.origin}</Text>
      </View>
      <View style={styles.footer}></View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 500,
  },
  header: {
    // borderWidth: 2,
    height: 25,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 5
  },
  body: {
    // borderWidth: 2,
    height: 450,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyText: {
    fontSize: 40
  },
  footer: {
    // borderWidth: 2,
    height: 25,
  }
});

export default FlipCardContainer;
