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
    <TouchableOpacity style={[style.buttonStyle, customStyle]} onPress={onClick}>
      <LocationIcon />
    </TouchableOpacity>
  );
};

export default MapButton;

const style = StyleSheet.create({
  buttonStyle: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    backgroundColor: theme.color.white,
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
