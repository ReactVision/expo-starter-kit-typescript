import React, { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroARPlaneSelector,
  Viro3DObject,
  ViroAmbientLight,
} from "@reactvision/react-viro";

interface ManualPlaneSceneProps {
  sceneNavigator?: any;
}

const ManualPlaneScene = (props: ManualPlaneSceneProps = {}) => {
  const { sceneNavigator } = props;
  const [planeSelected, setPlaneSelected] = useState(false);
  const selectorRef = useRef<ViroARPlaneSelector>(null);

  const onPlaneSelected = () => {
    setPlaneSelected(true);
  };

  const goBack = () => {
    sceneNavigator.pop();
  };

  return (
    <ViroARScene
      onAnchorFound={(a) => selectorRef.current?.handleAnchorFound(a)}
      onAnchorUpdated={(a) => selectorRef.current?.handleAnchorUpdated(a)}
      onAnchorRemoved={(a) => a && selectorRef.current?.handleAnchorRemoved(a)}
    >
      <ViroAmbientLight color="#ffffff" intensity={200} />

      <ViroText
        text="Back"
        scale={[0.3, 0.3, 0.3]}
        position={[-0.2, 0.3, -0.7]}
        style={styles.textStyle}
        onClick={goBack}
      />

      {!planeSelected && (
        <ViroText
          text="Tap to select a plane"
          scale={[0.4, 0.4, 0.4]}
          position={[0, 0, -2]}
          style={styles.textStyle}
        />
      )}

      <ViroARPlaneSelector
        ref={selectorRef}
        minHeight={0.1}
        minWidth={0.1}
        onPlaneSelected={onPlaneSelected}
      >
        <Viro3DObject
          source={require("../../assets/models/dog.glb")}
          position={[0, 0, 0]}
          scale={[0.3, 0.3, 0.3]}
          type="GLB"
        />
      </ViroARPlaneSelector>
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

export default ManualPlaneScene;
