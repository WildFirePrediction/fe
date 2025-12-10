import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../styles/theme';
import { BubbleTail } from '../assets/svgs/icons';

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
        <BubbleTail color={theme.color.main} />
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
    backgroundColor: theme.color.main,
    borderRadius: 10,
    maxWidth: '80%',
  },
  tailContainer: {
    overflow: 'hidden',
    marginTop: -3,
  },

  tail: {
    backgroundColor: theme.color.white,
    color: theme.color.white,
    position: 'absolute',
  },
  tailOverlay: {
    width: 20,
    height: 3,
    backgroundColor: theme.color.main,
    marginTop: -4,
    zIndex: 100,
  },
  text: {
    fontSize: 14,
    color: theme.color.white,
    fontWeight: '900',
  },
});

export default Bubble;
