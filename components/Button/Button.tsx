import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import theme from '../../styles/theme';
import { NavigationArrow, SettingIcon } from '../../assets/svgs/icons';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

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
  const getButtonStyle = () => {
    const baseStyles = {
      action:
        colorStyle === 'main'
          ? [style.actionButtonStyle]
          : [style.actionButtonStyle, style.actionButtonWhiteStyle],
      setting: [style.settingButtonStyle],
      floating: [style.floatingButtonStyle],
      full:
        colorStyle === 'main'
          ? [style.fullButtonStyle]
          : [style.fullButtonStyle, style.fullButtonWhiteStyle],
    };

    return baseStyles[buttonType];
  };
  const getButtonTextStyle = () => {
    const baseStyles = {
      action:
        colorStyle === 'main'
          ? [style.actionButtonTextStyle]
          : [style.actionButtonTextStyle, style.actionButtonWhiteTextStyle],
      setting: [style.settingButtonTextStyle],
      floating: [style.floatingButtonTextStyle],
      full:
        colorStyle === 'main'
          ? [style.fullButtonTextStyle]
          : [style.fullButtonTextStyle, style.fullButtonWhiteTextStyle],
    };

    return baseStyles[buttonType];
  };

  return (
    <>
      {buttonType === 'floating' ? (
        <TouchableOpacity
          onPress={onClick}
          style={style.floatingButtonContainer}
          activeOpacity={0.7}
        >
          <LinearGradient
            style={[getButtonStyle(), customStyle]}
            colors={[theme.color.main, theme.color.mainGradient]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <NavigationArrow />
            <Text style={getButtonTextStyle()}>{children}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[getButtonStyle(), customStyle]}
          onPress={onClick}
          activeOpacity={0.7}
        >
          {buttonType === 'setting' && <SettingIcon style={style.settingButtonIcon} />}
          <Text style={getButtonTextStyle()}>{children}</Text>
        </TouchableOpacity>
      )}
    </>
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
  settingButtonIcon: {
    color: theme.color.darkGray1,
    width: 13,
  },
  actionButtonStyle: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: theme.color.main,
    alignSelf: 'flex-start',
  },
  actionButtonTextStyle: {
    fontSize: 12,
    color: theme.color.white,
  },
  actionButtonWhiteStyle: {
    backgroundColor: theme.color.white,
    borderWidth: 1,
    borderColor: theme.color.gray,
  },
  actionButtonWhiteTextStyle: {
    color: theme.color.black,
  },
  fullButtonStyle: {
    paddingVertical: 17,
    borderRadius: 15,
    backgroundColor: theme.color.main,
    alignItems: 'center',
  },
  fullButtonTextStyle: {
    fontSize: 16,
    color: theme.color.white,
    fontWeight: 'bold',
  },
  fullButtonWhiteStyle: {
    backgroundColor: theme.color.white,
    borderWidth: 1,
    borderColor: theme.color.gray,
  },
  fullButtonWhiteTextStyle: {
    color: theme.color.darkGray2,
  },
  floatingButtonContainer: {
    shadowColor: theme.color.black,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 5,
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
