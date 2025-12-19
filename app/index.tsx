import React from 'react';
import { StyleSheet } from 'react-native';
import { ViroARSceneNavigator } from '@reactvision/react-viro';
import OpeningScene from '@/components/ar-scenes/OpeningScene';

export default function ARHome() {
  return (
    <ViroARSceneNavigator
      initialScene={{ scene: OpeningScene }}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

