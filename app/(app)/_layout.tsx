import { Redirect, Stack } from 'expo-router';

import Header from '../../components/header';
import { useSession } from '../../components/session-provider';

export default function AppLayout() {
  const { session } = useSession();

  return session ? (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          header: () => <Header />,
        }}
      />
      <Stack.Screen
        name="swish"
        options={{
          header: () => <Header />,
        }}
      />
    </Stack>
  ) : (
    <Redirect href="/auth" />
  );
}
