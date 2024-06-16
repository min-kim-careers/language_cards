import { ActivityIndicator, Text, View } from 'react-native';

const Fallback = () => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 30
    }}>
      <ActivityIndicator size={'large'} />
      <Text>Loading...</Text>
    </View>
  );
};

export default Fallback;
