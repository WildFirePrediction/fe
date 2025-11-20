import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import theme from '../../styles/theme';
import { NavigationArrow, SettingIcon } from '../../assets/svgs/icons';
import React from 'react';

interface ButtonProps {
  buttonType: 'action' | 'full' | 'setting' | 'floating';
  colorStyle?: 'main' | 'white';
  children: string;
  onClick: () => void;
  customStyle?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({
  buttonType,
  colorStyle = 'main',
  children,
  onClick,
  customStyle,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        buttonType === 'action'
          ? style.actionButtonStyle
          : buttonType === 'setting'
            ? style.settingButtonStyle
            : buttonType === 'floating'
              ? style.floatingButtonStyle
              : colorStyle === 'main'
                ? style.fullButtonStyle
                : [style.fullButtonStyle, style.fullButtonWhiteStyle],
        customStyle,
      ]}
      onPress={onClick}
    >
      {(buttonType === 'setting' && <SettingIcon />) ||
        (buttonType === 'floating' && <NavigationArrow />)}
      <Text
        style={
          buttonType === 'action'
            ? style.actionButtonTextStyle
            : buttonType === 'setting'
              ? style.settingButtonTextStyle
              : buttonType === 'floating'
                ? style.floatingButtonTextStyle
                : colorStyle === 'main'
                  ? style.fullButtonTextStyle
                  : [style.fullButtonTextStyle, style.fullButtonWhiteTextStyle]
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
    borderRadius: 7,
    backgroundColor: theme.color.main,
    alignItems: 'center',
  },
  fullButtonTextStyle: {
    fontSize: 18,
    color: theme.color.white,
  },
  fullButtonWhiteStyle: {
    backgroundColor: theme.color.white,
    borderWidth: 1,
    borderColor: theme.color.gray,
  },
  fullButtonWhiteTextStyle: {
    color: theme.color.black,
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
    width: 20,
    height: 23,
    color: theme.color.white,
  },
});
