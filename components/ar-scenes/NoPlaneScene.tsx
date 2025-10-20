import React from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroBox,
  ViroAmbientLight,
  ViroMaterials,
} from "@reactvision/react-viro";

ViroMaterials.createMaterials({
  boxMaterial: {
    diffuseColor: "#32CD32",
  },
});

interface NoPlaneSceneProps {
  sceneNavigator?: any;
}

const NoPlaneScene = (props: NoPlaneSceneProps = {}) => {
  const { sceneNavigator } = props;
  const goBack = () => {
    sceneNavigator.pop();
  };

  const onDrag = (dragToPos: any, source: any) => {
    console.log("Box dragged to position:", dragToPos);
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      
      <ViroText
        text="Back"
        scale={[0.3, 0.3, 0.3]}
        position={[-0.2, 0.3, -0.7]}
        style={styles.textStyle}
        onClick={goBack}
      />

      <ViroText
        text="No Plane Detection"
        scale={[0.4, 0.4, 0.4]}
        position={[0, 0.5, -2]}
        style={styles.textStyle}
      />

      
      <ViroBox
        position={[0, 0, -1]}
        scale={[0.1, 0.1, 0.1]}
        materials={["boxMaterial"]}
        dragType="FixedToWorld"
        onDrag={onDrag}
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

export default NoPlaneScene;

