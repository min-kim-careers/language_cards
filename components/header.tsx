import { AntDesign } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ELEMENT_WIDTH, SHADOW_STYLE } from '../global';
import SearchModal from './search-modal';
import Title from './title';
import { useEffect, useState } from 'react';

const Header = ({ isTitle = false }: { isTitle?: boolean }) => {
  const [wasPushed, setWasPushed] = useState(false);

  const { pushed } = useLocalSearchParams<{
    pushed?: string;
  }>();

  useEffect(() => {
    if (pushed) setWasPushed(pushed === 'true');
  }, []);

  return (
    <View style={styles.container}>
      <BackButton canGoBack={wasPushed} />
      <Title isTitle={isTitle} />
      <SearchModal style={styles.right} />
    </View>
  );
};

const BackButton = ({ canGoBack }: { canGoBack: boolean }) => {
  return (
    <AntDesign
      name='left'
      size={24}
      color='black'
      style={{
        ...styles.left,
        display: canGoBack ? 'flex' : 'none',
      }}
      onPress={() => router.back()}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    top: 10,
    width: ELEMENT_WIDTH * 1.1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 5,
    paddingHorizontal: 20,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    ...SHADOW_STYLE,
  },
  left: {
    position: 'absolute',
    left: 10,
  },
  right: {
    position: 'absolute',
    right: 10,
  },
});

export default Header;
