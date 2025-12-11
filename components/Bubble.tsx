import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../styles/theme';
import { BubbleTail, BubbleTailBorder } from '../assets/svgs/icons';

interface BubbleProps {
  text: string;
}

const Bubble: React.FC<BubbleProps> = ({ text }: BubbleProps) => {
  return (
    <View style={styles.wrapper} collapsable={false}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.tailOverlay} />
      <View style={styles.tailContainer}>
        <BubbleTailBorder color={theme.color.white} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: theme.color.black,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.5,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: theme.color.white,
    borderWidth: 1,
    borderColor: theme.color.darkGray2,
    borderRadius: 10,
    maxWidth: '80%',
  },
  tailContainer: {
    overflow: 'hidden',
    marginTop: -4,
  },

  tail: {
    backgroundColor: theme.color.white,
    color: theme.color.white,
    position: 'absolute',
  },
  tailOverlay: {
    width: 20,
    height: 4,
    backgroundColor: theme.color.white,
    marginTop: -3,
    zIndex: 100,
  },
  text: {
    fontSize: 14,
    color: theme.color.darkGray3,
    fontWeight: '900',
  },
});

export default Bubble;
