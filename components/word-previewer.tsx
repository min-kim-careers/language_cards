import { useEffect, useState } from 'react';
import { Button, Card, Divider, Modal, Portal, Text } from 'react-native-paper';
import { WordPreview } from '../global';
import { StyleSheet, View } from 'react-native';

const WordPreviewer = ({
  wordPreviews,
}: {
  wordPreviews: WordPreview[] | null;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    wordPreviews ? setVisible(true) : setVisible(false);
  }, [wordPreviews]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  if (!wordPreviews) return;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Preview</Text>
        {wordPreviews.map((word, i) => (
          <View key={i}>
            <View style={styles.view}>
              <Text style={styles.words}>{word.english}</Text>
              <Text style={styles.words}>{word.korean}</Text>
            </View>
          </View>
        ))}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '50%',
    width: '75%',
    justifyContent: 'center',
    paddingHorizontal: '15%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingVertical: '1%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
    width: '100%',
  },
  words: {
    width: '50%',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default WordPreviewer;
