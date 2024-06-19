import * as React from 'react';
import {
  Image,
  StyleProp,
  StyleSheetProperties,
  View,
  ViewStyle,
} from 'react-native';
import { Banner, Button, Portal } from 'react-native-paper';

const TipBanner = ({
  buttonStyle,
  children,
}: {
  buttonStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <View>
      <Portal>
        <Button
          mode="elevated"
          style={buttonStyle}
          onPress={() => setVisible(!visible)}
        >
          {visible ? 'Hide Instructions' : 'Show Instructions'}
        </Button>
      </Portal>
      <Banner
        visible={visible}
        actions={[
          {
            label: 'Close',
            onPress: () => setVisible(false),
          },
        ]}
      >
        {children}
      </Banner>
    </View>
  );
};

export default TipBanner;
