import { Redirect, Stack } from 'expo-router';

import Header from '../../components/Header';
import { useSession } from '../../components/SessionProvider';
import Fallback from '../../components/Fallback';

export default function AppLayout() {
  const { session } = useSession();

  if (!session) return <Redirect href="/signin" />;

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerTitle: () => <Header  />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="swish"
        options={{
          headerTitle: () => <Header />,
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
