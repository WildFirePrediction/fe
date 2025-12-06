import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import theme from '../../styles/theme';
import { LocationIcon } from '../../assets/svgs/icons';

interface MapButtonProps {
  onClick: () => void;
  customStyle?: StyleProp<ViewStyle>;
}
const MapButton: React.FC<MapButtonProps> = ({ onClick, customStyle }: MapButtonProps) => {
  return (
    <TouchableOpacity
      style={[style.buttonStyle, customStyle]}
      onPress={onClick}
      activeOpacity={0.5}
    >
      <LocationIcon width={29} height={29} />
    </TouchableOpacity>
  );
};

export default MapButton;

const style = StyleSheet.create({
  buttonStyle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.color.white,
    borderWidth: 1,
    borderColor: theme.color.gray,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
