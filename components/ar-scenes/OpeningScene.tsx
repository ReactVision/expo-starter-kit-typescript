import React from "react";
import { StyleSheet } from "react-native";
import { ViroARScene, ViroText } from "@reactvision/react-viro";
import AutoPlaneScene from "./AutoPlaneScene";
import GeospatialAnchorScene from "./GeospatialAnchorScene";
import ManualPlaneScene from "./ManualPlaneScene";
import NoPlaneScene from "./NoPlaneScene";
import PhysicsDemo from "./PhysicsDemo";
import ShadersScene from "./ShadersScene";

interface OpeningSceneProps {
  sceneNavigator?: any;
}

const OpeningScene = (props: OpeningSceneProps = {}) => {
  const navigateToScene = (scene: any) => {
    props.sceneNavigator.push({ scene });
  };

  return (
    <ViroARScene>
      <ViroText
        text="Auto Plane"
        scale={[0.5, 0.5, 0.5]}
        position={[0, 1, -2]}
        style={styles.textStyle}
        onClick={() => navigateToScene(AutoPlaneScene)}
      />
      <ViroText
        text="Manual Plane"
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0.5, -2]}
        style={styles.textStyle}
        onClick={() => navigateToScene(ManualPlaneScene)}
      />
      <ViroText
        text="Physics Demo"
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -2]}
        style={styles.textStyle}
        onClick={() => navigateToScene(PhysicsDemo)}
      />
      <ViroText
        text="No Plane"
        scale={[0.5, 0.5, 0.5]}
        position={[0, -0.5, -2]}
        style={styles.textStyle}
        onClick={() => navigateToScene(NoPlaneScene)}
      />
      <ViroText
        text="Shaders"
        scale={[0.5, 0.5, 0.5]}
        position={[0, -1, -2]}
        style={styles.textStyle}
        onClick={() => navigateToScene(ShadersScene)}
      />
      <ViroText
        text="Geospatial Anchors"
        scale={[0.5, 0.5, 0.5]}
        position={[0, -1.5, -2]}
        style={styles.textStyle}
        onClick={() => navigateToScene(GeospatialAnchorScene)}
      />
    </ViroARScene>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

export default OpeningScene;
