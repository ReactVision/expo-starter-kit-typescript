import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroARPlaneSelector,
  Viro3DObject,
  ViroAmbientLight,
  ViroBox,
  ViroMaterials,
} from "@reactvision/react-viro";

ViroMaterials.createMaterials({
  cubeMaterial: {
    diffuseColor: "#FF6B6B",
  },
  surfaceMaterial: {
    diffuseColor: "#000000",
  },
});

interface PhysicsDemoProps {
  sceneNavigator?: any;
}

const PhysicsDemo = (props: PhysicsDemoProps = {}) => {
  const { sceneNavigator } = props;
  const [planeSelected, setPlaneSelected] = useState(false);

  const onPlaneSelected = () => {
    setPlaneSelected(true);
  };

  const goBack = () => {
    sceneNavigator.pop();
  };

  const onDrag = (dragToPos: any, source: any) => {
    console.log("Robot dragged to position:", dragToPos);
  };

  return (
    <ViroARScene physicsWorld={{ gravity: -9.8 }}>
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

      {planeSelected && (
        <ViroText
          text="Drag robot, release to drop"
          scale={[0.3, 0.3, 0.3]}
          position={[0, 0.3, -0.7]}
          style={styles.textStyle}
        />
      )}

      <ViroARPlaneSelector
        minHeight={0.3}
        minWidth={0.3}
        onPlaneSelected={onPlaneSelected}
      >
        {/* Static plane surface - prevents objects from falling through */}
        <ViroBox
          position={[0, 0.0, 0]}
          width={1.0}
          height={0.02}
          length={1.0}
          materials={["surfaceMaterial"]}
          opacity={0.5}
          physicsBody={{
            type: 'Static',
            shape: { type: "Box", params: [1.5, 0.01, 1.5] },
          }}
        />

        {/* Robot with draggable physics - Dynamic allows collisions */}
        <Viro3DObject
          source={require("../../assets/models/robot.glb")}
          position={[-0.4, 0.0, 0]}
          scale={[0.35, 0.35, 0.35]}
          rotation={[0, 90, 0]}
          type="GLB"
          dragType="FixedToWorld"
          onDrag={onDrag}
          physicsBody={{
            type: 'Dynamic',
            mass: 2,
            shape: { type: "Box", params: [0.15, 0.3, 0.15] },
            restitution: 0.3,
            friction: 0.6,
            useGravity: true,
          }}
        />

        {/* Group of cubes with dynamic physics - can be pushed and fall off plane */}
        <ViroBox
          position={[-0.3, 0.12, -0.3]}
          scale={[0.12, 0.12, 0.12]}
          materials={["cubeMaterial"]}
          physicsBody={{
            type: 'Dynamic',
            mass: 0.5,
            shape: { type: "Box", params: [0.12, 0.12, 0.12] },
            restitution: 0.4,
            friction: 0.5,
            useGravity: true,
          }}
        />

        <ViroBox
          position={[-0.5, 0.12, -0.3]}
          scale={[0.12, 0.12, 0.12]}
          materials={["cubeMaterial"]}
          physicsBody={{
            type: 'Dynamic',
            mass: 0.5,
            shape: { type: "Box", params: [0.12, 0.12, 0.12] },
            restitution: 0.4,
            friction: 0.5,
            useGravity: true,
          }}
        />

        <ViroBox
          position={[-0.4, 0.18, -0.3]}
          scale={[0.12, 0.12, 0.12]}
          materials={["cubeMaterial"]}
          physicsBody={{
            type: 'Dynamic',
            mass: 0.5,
            shape: { type: "Box", params: [0.12, 0.12, 0.12] },
            restitution: 0.4,
            friction: 0.5,
            useGravity: true,
          }}
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

export default PhysicsDemo;

