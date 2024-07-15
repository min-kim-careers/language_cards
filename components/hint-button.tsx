import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';

const HintButton = ({ className }: { className?: string }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <IconButton
        className={className}
        icon='help-circle-outline'
        size={30}
        onPress={() => setVisible(true)}
      />

      <Modal
        animationType='fade'
        visible={visible}
        onRequestClose={() => setVisible(false)}
        transparent
      >
        <View className='flex-1 justify-center items-center'>
          <View className='bg-white p-5 rounded-md shadow-md'>
            <Text>Long press a collection to preview!</Text>
            <Pressable
              className='flex-row self-end pt-4'
              onPress={() => setVisible(false)}
            >
              <Text>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HintButton;
