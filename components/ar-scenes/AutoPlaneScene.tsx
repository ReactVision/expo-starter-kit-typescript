import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroARPlane,
  Viro3DObject,
  ViroAmbientLight,
} from "@reactvision/react-viro";

interface AutoPlaneSceneProps {
  sceneNavigator?: any;
}

const AutoPlaneScene = (props: AutoPlaneSceneProps = {}) => {
  const { sceneNavigator } = props;
  const [planeDetected, setPlaneDetected] = useState(false);

  const onPlaneDetected = () => {
    setPlaneDetected(true);
  };

  const goBack = () => {
    sceneNavigator.pop();
  };

  const onDrag = (dragToPos: any, source: any) => {
    console.log("Robot dragged to position:", dragToPos);
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

      {!planeDetected && (
        <ViroText
          text="Detecting plane..."
          scale={[0.4, 0.4, 0.4]}
          position={[0, 0, -2]}
          style={styles.textStyle}
        />
      )}

      <ViroARPlane
        minHeight={0.1}
        minWidth={0.1}
        onAnchorFound={onPlaneDetected}
      >
        <Viro3DObject
          source={require("../../assets/models/robot.glb")}
          position={[0, 0, 0]}
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, 180, 0]}
          type="GLB"
          dragType="FixedToPlane"
          dragPlane={{
            planePoint: [0, 0, 0],
            planeNormal: [0, 0.5, 0],
            maxDistance: 5
          }}
          onDrag={onDrag}
        />
      </ViroARPlane>
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

export default AutoPlaneScene;

