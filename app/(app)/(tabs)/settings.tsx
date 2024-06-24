import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  IconButton,
  SegmentedButtons,
  Text,
} from 'react-native-paper';
import { useSettings } from '../../../components/SettingsProvider';
import {
  DEFAULT_SETTINGS,
  DisplayOrder,
  ELEMENT_WIDTH,
  Settings,
} from '../../../global';
import { useSession } from '../../../components/SessionProvider';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

const SettingsScreen = () => {
  const [tempSettings, setTempSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Favourite folder settings
  // const [openDropDown, setOpenDropDown] = useState(false);
  // const [favouriteItemTypes, setFavouriteItemTypes] = useState<
  //   ItemType<string>[]
  // >([]);
  // const [dropDownValue, setDropDownValue] = useState('My Favourites');

  const { signOut } = useSession();
  const { settings, saveSettings } = useSettings();

  useEffect(() => {
    setTempSettings(settings);
  }, []);

  const handleDisplayOrderButton = (value: string) => {
    let newDisplayOrder: DisplayOrder = DisplayOrder.KoreanFirst;
    if (value === 'KoreanFirst') {
      newDisplayOrder = DisplayOrder.KoreanFirst;
    } else if (value === 'EnglishFirst') {
      newDisplayOrder = DisplayOrder.EnglishFirst;
    } else if (value === 'Alternate') {
      newDisplayOrder = DisplayOrder.Alternate;
    } else {
      console.error('Invalid value passed as DisplayOrder');
    }
    setTempSettings((prevSettings) => ({
      ...prevSettings,
      displayOrder: newDisplayOrder,
    }));
  };

  const handleShuffleButton = (value: string) => {
    setTempSettings((prevSettings) => ({
      ...prevSettings,
      shuffled: value === 'true' ? true : false,
    }));
  };

  const handleApplySettingsButton = () => {
    saveSettings(tempSettings);
  };

  const handleSignOutButton = () => {
    signOut();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.settingContainer}>
        <Text style={styles.settingText}>
          Select how items should be displayed
        </Text>
        <SegmentedButtons
          value={tempSettings.displayOrder}
          onValueChange={handleDisplayOrderButton}
          buttons={[
            {
              value: 'KoreanFirst',
              label: 'Korean First',
              style: styles.segmentedButtons,
            },
            {
              value: 'EnglishFirst',
              label: 'English First',
              style: styles.segmentedButtons,
            },
            {
              value: 'Alternate',
              label: 'Alternate',
              style: styles.segmentedButtons,
            },
          ]}
          style={styles.segmentedButtonsContainer}
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
          style={styles.segmentedButtonsContainer}
        />

        {/* <Text>Your favourites will be saved here</Text>
        <DropDownPicker
          open={openDropDown}
          value={dropDownValue}
          items={favouriteItemTypes}
          setOpen={setOpenDropDown}
          setValue={setDropDownValue}
          setItems={setFavouriteItemTypes}
        />

        <Button
          mode="outlined"
          labelStyle={{ color: 'black' }}
          style={{ width: ELEMENT_WIDTH }}
        >
          Create new favourites collection
        </Button> */}
      </ScrollView>

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
          onPress={handleApplySettingsButton}
        >
          Apply Settings
        </Button>

        <Button
          labelStyle={styles.button}
          mode="contained"
          onPress={handleSignOutButton}
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
  segmentedButtonsContainer: {
    width: ELEMENT_WIDTH,
  },
  segmentedButtons: {
    flexWrap: 'wrap',
    alignContent: 'center'
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
