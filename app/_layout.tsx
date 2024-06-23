import { Slot } from 'expo-router';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { SettingsProvider } from '../components/SettingsProvider';
import { SessionProvider } from '../components/SessionProvider';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'grey',
    surfaceVariant: 'white',
    secondaryContainer: 'white',
    elevation: {
      level1: 'white',
    },
  },
};

export default function Layout() {
  return (
    <PaperProvider theme={theme}>
      <SessionProvider>
        <SettingsProvider>
          <Slot />
        </SettingsProvider>
      </SessionProvider>
    </PaperProvider>
  );
}
