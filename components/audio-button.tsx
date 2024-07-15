import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

const AudioButton = ({ soundUrl }: { soundUrl: string }) => {
  const [sound, setSound] = useState<Audio.Sound>();

  const playSound = async () => {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync({ uri: soundUrl });
    console.log('Playing Sound');
    setSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return <AntDesign name="sound" size={24} color="black" onPress={playSound} />;
};

export default AudioButton;
