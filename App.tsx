import React from "react";
import { StyleSheet } from "react-native";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import OpeningScene from "./components/ar-scenes/OpeningScene";

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: OpeningScene,
      }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: { flex: 1 },
});