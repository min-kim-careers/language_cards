import { Stack } from 'expo-router';

import SignIn from '../../components/auth/SignIn';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../services/supabase';

export default function AppLayout() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (!session) return <SignIn />

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
