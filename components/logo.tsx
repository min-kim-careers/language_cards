import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const Logo = ({
  isTitle,
  className,
}: {
  isTitle?: boolean;
  className?: string;
}) => {
  const styles = StyleSheet.create({
    mainHeader: {
      fontSize: isTitle ? 40 : 20,
      textAlign: 'center',
    },
    subHeader: {
      fontSize: isTitle ? 20 : 10,
      textAlign: 'center',
    },
  });

  return (
    <View className={className}>
      <Text style={styles.mainHeader}>S W I S H</Text>
      <Text style={styles.subHeader}>K O R E A N</Text>
    </View>
  );
};

export default Logo;
