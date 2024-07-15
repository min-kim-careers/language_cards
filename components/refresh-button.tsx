import { IconButton } from 'react-native-paper';

const RefreshButton = ({
  className,
  onPress,
  loading,
}: {
  className?: string;
  onPress: () => void;
  loading: boolean;
}) => {
  return (
    <IconButton
      className={className}
      icon='refresh'
      onPress={onPress}
      disabled={loading}
      size={30}
    />
  );
};

export default RefreshButton;
