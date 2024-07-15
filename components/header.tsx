import { AntDesign } from '@expo/vector-icons';
import { getHeaderTitle } from '@react-navigation/elements';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Link, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ELEMENT_WIDTH, SHADOW_STYLE } from '../constants/global';
import Logo from './logo';
import { Ionicons } from '@expo/vector-icons';

const BACK_ALLOWED_SCREENS = ['swish', 'settings'];

const Header = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const title = getHeaderTitle(options, route.name);

  return (
    <View style={styles.container}>
      <BackButton
        className='flex-1 h-full justify-center items-start'
        canGoBack={BACK_ALLOWED_SCREENS.includes(title)}
      />
      <Logo className='flex-1 h-full justify-center items-center' />
      <SettingsButton
        className='flex-1 h-full justify-center items-end'
        isSettings={title === 'settings'}
      />
    </View>
  );
};

const SettingsButton = ({
  isSettings,
  className,
}: {
  isSettings: boolean;
  className?: string;
}) => {
  return (
    <View className={className}>
      <Link
        push
        href='settings'
        style={{
          display: isSettings ? 'none' : 'flex',
        }}
      >
        <Ionicons
          name='settings-outline'
          size={24}
          color='black'
        />
      </Link>
    </View>
  );
};

const BackButton = ({
  canGoBack,
  className,
}: {
  canGoBack: boolean;
  className?: string;
}) => {
  return (
    <View className={className}>
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
    </View>
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
