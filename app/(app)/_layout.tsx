import { Redirect, Stack } from 'expo-router';

import Header from '../../components/header';
import { useSession } from '../../components/session-provider';
import { useEffect } from 'react';
import { initLocalStorage } from '../../database/storage.config';

export default function AppLayout() {
  const { session } = useSession();

  useEffect(() => {
    if (session) initLocalStorage();
  }, []);

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
