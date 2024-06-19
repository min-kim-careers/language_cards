import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const Header = (_props: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainHeader}>S W I S H</Text>
      <Text style={styles.subHeader}>K O R E A N</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainHeader: {
    fontSize: 20
  },
  subHeader: {
    fontSize: 10
  }
})

export default Header;
