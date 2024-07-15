import { useEffect, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import { SHADOW_STYLE, WordPreview } from '../constants/global';

const WordPreviewer = ({
  wordPreviews,
}: {
  wordPreviews: WordPreview[] | null;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    wordPreviews ? setVisible(true) : setVisible(false);
  }, [wordPreviews]);

  if (!wordPreviews) return;

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType='fade'
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(!visible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {wordPreviews.map((word, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-evenly',
                }}
              >
                <Text style={styles.text}>{word.english}</Text>
                <Text style={styles.text}>{word.korean}</Text>
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    position: 'absolute',
    width: '65%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW_STYLE,
  },
  text: {
    marginBottom: 15,
    textAlign: 'center',
    width: '50%',
  },
});
export default WordPreviewer;
