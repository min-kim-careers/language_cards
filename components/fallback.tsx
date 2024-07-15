import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const Fallback = ({
  duration = 0,
  isFavouriteScreen = false,
}: {
  duration?: number;
  isFavouriteScreen?: boolean;
}) => {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (duration) {
      const timeout = setTimeout(() => setTimedOut(true), duration);
      return () => clearTimeout(timeout);
    }
  }, []);

  return duration && timedOut ? (
    <View style={styles.container}>
      {isFavouriteScreen ? (
        <Text>Your words will show up hear once favourited!</Text>
      ) : (
        <Text>Nothing to display...</Text>
      )}
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
