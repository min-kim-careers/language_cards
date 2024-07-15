import { Redirect, Stack } from 'expo-router';

import Header from '../../components/header';
import { useSession } from '../../components/session-provider';
import { useEffect, useState } from 'react';
import { initLocalStorage } from '../../database/storage.config';
import Fallback from '../../components/fallback';

export default function AppLayout() {
  const { session } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (session) initLocalStorage();
    setLoading(false);
  }, []);

  if (loading) {
    return <Fallback />
  }

  return session ? (
    <Stack>
      <Stack.Screen
        name='(tabs)'
        options={{
          header: (props) => <Header {...props} />,
        }}
      />
      <Stack.Screen
        name='swish'
        options={{
          header: (props) => <Header {...props} />,
        }}
      />
      <Stack.Screen
        name='settings'
        options={{
          header: (props) => <Header {...props} />,
        }}
      />
    </Stack>
  ) : (
    <Redirect href='/auth' />
  );
}
