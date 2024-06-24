import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import WordSelector from '../../../components/WordSelector';

const FavouritesScreen = () => {
  const [showWordSelector, setShowWordSelector] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
      }}
    >
      <IconButton
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
        }}
        icon="plus-box"
        iconColor="grey"
        size={48}
        onPress={() => setShowWordSelector(true)}
      />

      <WordSelector
        isVisible={showWordSelector}
        onClose={() => setShowWordSelector(false)}
      />
    </View>
  );
};

export default FavouritesScreen;
