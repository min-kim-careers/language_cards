import { StyleSheet, View } from 'react-native';
import { Button, Card, SegmentedButtons, Text } from 'react-native-paper';
import { ELEMENT_WIDTH, Settings } from '../../../global';
import { useSettings } from '../../../components/SettingsProvider';
import { DisplayOrder } from '../../../global';
import { useEffect, useState } from 'react';
import { supabase } from '../../../services/supabase';

const SettingsScreen = () => {
  const [tempSettings, setTempSettings] = useState<Settings>({
    displayOrder: DisplayOrder.FrontFirst,
    shuffled: false,
  });

  const { settings, saveSettings } = useSettings();

  useEffect(() => {
    setTempSettings(settings);
  }, []);

  const handleDisplayOrderButton = (value: string) => {
    let temp: DisplayOrder = DisplayOrder.FrontFirst;
    if (value === 'FrontFirst') {
      temp = DisplayOrder.FrontFirst;
    } else if (value === 'BackFirst') {
      temp = DisplayOrder.BackFirst;
    } else if (value === 'Alternate') {
      temp = DisplayOrder.Alternate;
    } else {
      console.error('Invalid value passed as DisplayOrder');
    }
    setTempSettings({
      displayOrder: temp,
      shuffled: tempSettings.shuffled,
    });
  };

  const handleShuffleButton = (value: string) => {
    setTempSettings({
      displayOrder: tempSettings.displayOrder,
      shuffled: value === 'true' ? true : false,
    });
  };

  const handleSaveSettingsButton = () => {
    saveSettings(tempSettings);
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>
          Select how items should be displayed
        </Text>
        <SegmentedButtons
          value={tempSettings.displayOrder}
          onValueChange={handleDisplayOrderButton}
          buttons={[
            {
              value: 'FrontFirst',
              label: 'Korean first',
              style: { flexWrap: 'wrap' },
            },
            {
              value: 'BackFirst',
              label: 'English first',
              style: { flexWrap: 'wrap' },
            },
            {
              value: 'Alternate',
              label: 'Alternate',
              style: { flexWrap: 'wrap' },
            },
          ]}
          style={styles.segmentedButtons}
        />

        <Text style={styles.settingText}>Shuffle cards?</Text>
        <SegmentedButtons
          value={tempSettings.shuffled ? 'true' : 'false'}
          onValueChange={handleShuffleButton}
          buttons={[
            {
              value: 'true',
              label: 'Yes',
            },
            {
              value: 'false',
              label: 'No',
            },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <View style={styles.footerContainer}>
        <Card style={styles.tipCard} mode="contained">
          <Text style={styles.tipCardText}>
            Settings will be applied only after pressing the "Apply Settings"
            button.
          </Text>
        </Card>

        <Button
          labelStyle={styles.button}
          mode="contained"
          onPress={handleSaveSettingsButton}
        >
          Apply Settings
        </Button>

        <Button
          labelStyle={styles.button}
          mode="contained"
          onPress={async () => await supabase.auth.signOut({ scope: 'local' })}
          style={{ backgroundColor: 'darkgrey' }}
        >
          Sign out
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingContainer: {
    gap: 20,
    alignItems: 'center',
  },
  tipCard: {
    padding: 10,
    backgroundColor: 'white',
  },
  tipCardText: {
    textAlign: 'center',
  },
  settingText: {},
  segmentedButtons: {
    width: ELEMENT_WIDTH,
    flexWrap: 'wrap',
  },
  button: {
    // width: ELEMENT_WIDTH,
  },
  footerContainer: {
    width: ELEMENT_WIDTH,
    gap: 20,
  },
});

export default SettingsScreen;
