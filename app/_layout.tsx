import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { storeAllData } from '../db.config';

export default function Layout() {
  useEffect(() => {
    storeAllData();
  }, []);

  return <Stack screenOptions={{ title: 'Swish Cards',  }} />;
}
