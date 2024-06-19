import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const DURATION = 30000;

const Fallback = () => {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setTimedOut(true), DURATION);
    return () => clearTimeout(timeout);
  }, []);

  return timedOut ? (
    <View style={styles.container}>
      <Text>Nothing to display...</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} />
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
});

export default Fallback;
