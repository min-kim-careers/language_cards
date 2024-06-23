import { Redirect, Stack } from 'expo-router';

import Header from '../../components/Header';
import { useSession } from '../../components/SessionProvider';

export default function AppLayout() {
  const { session } = useSession();

  return session ? (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerTitle: () => <Header />,
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
  ) : (
    <Redirect href="/auth" />
  );
}
