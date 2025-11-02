import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import theme from '../../styles/theme';
import { NavigationArrow, Setting } from '../../assets/svgs/icons';

interface ButtonProps {
  buttonType: 'action' | 'full' | 'setting' | 'floating';
  children: string;
  onClick: () => void;
}

const Button = ({ buttonType, children, onClick }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={
        buttonType === 'action'
          ? style.actionButtonStyle
          : buttonType === 'setting'
            ? style.settingButtonStyle
            : buttonType === 'full'
              ? style.fullButtonStyle
              : style.floatingButtonStyle
      }
      onPress={onClick}
    >
      {(buttonType === 'setting' && <Setting />) ||
        (buttonType === 'floating' && <NavigationArrow />)}
      <Text
        style={
          buttonType === 'action'
            ? style.actionButtonTextStyle
            : buttonType === 'setting'
              ? style.settingButtonTextStyle
              : buttonType === 'full'
                ? style.fullButtonTextStyle
                : style.floatingButtonTextStyle
        }
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const style = StyleSheet.create({
  buttonStyle: {},
  settingButtonStyle: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: theme.color.white,
    borderWidth: 1,
    borderColor: theme.color.gray,
    borderRadius: 20,
    gap: 5,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingButtonTextStyle: {
    fontSize: 16,
    color: theme.color.darkGray1,
  },
  actionButtonStyle: {
    paddingVertical: 8,
    paddingHorizontal: 17,
    borderRadius: 10,
    backgroundColor: theme.color.main,
    alignSelf: 'flex-start',
  },
  actionButtonTextStyle: {
    fontSize: 16,
    color: theme.color.white,
  },
  fullButtonStyle: {
    paddingVertical: 17,
    borderRadius: 5,
    backgroundColor: theme.color.main,
    alignItems: 'center',
  },
  fullButtonTextStyle: {
    fontSize: 20,
    color: theme.color.white,
  },
  floatingButtonStyle: {
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 30,
    backgroundColor: theme.color.main,
    alignSelf: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    shadowColor: theme.color.black,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 4,
      height: 4,
    },
  },
  floatingButtonTextStyle: {
    fontSize: 16,
    color: theme.color.white,
    fontWeight: 700,
  },
  floatingButtonIconStyle: {
    width: 23,
    height: 27,
    color: theme.color.white,
  },
});
