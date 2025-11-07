import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../../styles/theme';
import { LocationIcon } from '../../assets/svgs/icons';

interface MapButtonProps {
  onClick: () => void;
}
const MapButton: React.FC<MapButtonProps> = ({ onClick }: MapButtonProps) => {
  return (
    <TouchableOpacity style={style.buttonStyle} onPress={onClick}>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
