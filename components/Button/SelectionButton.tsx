import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import theme from '../../styles/theme';

interface SelectionButtonProps {
  children: string;
  selected: boolean;
  onClick: (children: string) => void;
}

const SelectionButton = ({ children, selected, onClick }: SelectionButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        style.buttonStyle,
        selected ? style.selectedButtonStyle : style.unselectedButtonStyle,
      ]}
      onPress={() => onClick(children)}
    >
      <Text style={selected ? style.selectedButtonTextStyle : style.unselectedButtonTextStyle}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  buttonStyle: {
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  selectedButtonStyle: {
    backgroundColor: theme.color.black,
  },
  unselectedButtonStyle: {
    backgroundColor: theme.color.gray,
  },
  selectedButtonTextStyle: {
    color: theme.color.white,
    fontSize: 16,
  },
  unselectedButtonTextStyle: {
    color: theme.color.darkGray2,
    fontSize: 16,
  },
});

export default SelectionButton;
