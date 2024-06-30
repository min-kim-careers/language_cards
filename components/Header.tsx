import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { ELEMENT_WIDTH } from '../global';
import { AntDesign } from '@expo/vector-icons';
import Title from './Title';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

const Header = ({ isTitle = false }: { isTitle?: boolean }) => {
  const [isPushed, setIsPushed] = useState(false);
  useEffect(() => {
    if (router.canGoBack()) {
      setIsPushed(true);
    }
  }, []);

  return (
    <Card style={styles.container}>
      {isPushed && (
        <AntDesign
          name="left"
          size={24}
          color="black"
          style={{
            position: 'absolute',
            right: ELEMENT_WIDTH * 0.55,
            top: 4,
          }}
          onPress={() => router.back()}
        />
      )}
      <Title isTitle={isTitle} />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 10,
    width: ELEMENT_WIDTH * 1.1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 7,
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default Header;
