import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

const HintIcon = () => {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 5000,
  //     useNativeDriver: false,
  //   }).start();
  // }, [fadeAnim]);

  return (
    <>
      <IconButton
        icon='help-circle'
        size={36}
        style={styles.container}
        iconColor='black'
        onPress={() => {
          if (visible) {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }).start();
            setVisible(false);
          } else {
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: false,
            }).start();
            setVisible(true);
          }
        }}
      />
      <Animated.View
        style={{
          ...styles.hintContainer,
          opacity: fadeAnim,
        }}
      >
        <Text
          variant='bodyLarge'
          style={styles.hint}
        >
          Long press to preview!
        </Text>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    margin: 10,
  },
  hintContainer: {
    position: 'absolute',
    width: 200,
    height: 100,
    backgroundColor: 'white',
    bottom: '10%',
    left: '15%',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    fontStyle: 'italic',
  },
});

export default HintIcon;
