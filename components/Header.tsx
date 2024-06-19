import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const Header = ({ isTitle = false }: { isTitle?: boolean }) => {

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainHeader: {
      fontSize: isTitle ? 40 : 20,
    },
    subHeader: {
      fontSize: isTitle ? 20 : 10,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeader}>S W I S H</Text>
      <Text style={styles.subHeader}>K O R E A N</Text>
    </View>
  );
};



export default Header;
