import React, { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroARPlaneSelector,
  ViroAmbientLight,
  ViroBox,
  ViroMaterials,
  ViroSphere,
  ViroNode,
} from "@reactvision/react-viro";

ViroMaterials.createMaterials({
  alleyMaterial: {
    diffuseColor: "#000000",
  },
  ballMaterial: {
    diffuseColor: "#2196F3",
  },
  pinMaterial: {
    diffuseColor: "#FFFFFF",
  },
  wallMaterial: {
    diffuseColor: "#FF0000",
  },
});

interface PhysicsDemoProps {
  sceneNavigator?: any;
}

const PhysicsDemo = (props: PhysicsDemoProps = {}) => {
  const { sceneNavigator } = props;
  const [planeSelected, setPlaneSelected] = useState(false);
  const [resetKey, setResetKey] = useState(0); // Key to force re-render and reset physics
  
  const ballRef = useRef<any>(null);

  const FALL_THRESHOLD = -0.5; // Reset objects that fall below this Y position
  const INITIAL_BALL_POS: [number, number, number] = [0, 0.1, 0.25];

  const onPlaneSelected = () => {
    setPlaneSelected(true);
  };

  const goBack = () => {
    sceneNavigator.pop();
  };

  const handleReset = () => {
    console.log("Resetting game...");
    // Increment key to force all objects to remount with initial positions
    setResetKey(prev => prev + 1);
  };

  const onDrag = (dragToPos: any, source: any) => {
    console.log("Ball dragged to position:", dragToPos);
  };

  // Check and reset ball if it falls too far
  const onBallUpdate = (position: number[]) => {
    if (position[1] < FALL_THRESHOLD) {
      console.log("Ball fell too far, resetting...");
      handleReset();
    }
  };

  return (
    <ViroARScene physicsWorld={{ gravity: -9.8 }}>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      
      <ViroText
        text="Back"
        scale={[0.3, 0.3, 0.3]}
        position={[-0.3, 0.3, -0.7]}
        style={styles.textStyle}
        onClick={goBack}
      />

      {planeSelected && (
        <ViroText
          text="Reset"
          scale={[0.3, 0.3, 0.3]}
          position={[0.3, 0.3, -0.7]}
          style={styles.textStyle}
          onClick={handleReset}
        />
      )}

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
          text="Drag the ball and throw it!"
          scale={[0.3, 0.3, 0.3]}
          position={[0, 0.3, -0.7]}
          style={styles.smallTextStyle}
        />
      )}

      <ViroARPlaneSelector
        minHeight={0.3}
        minWidth={0.3}
        onPlaneSelected={onPlaneSelected}
        key={`plane-${resetKey}`}
      >

        {/* Bowling Alley - Long black box */}
        <ViroBox
          position={[0, 0.03, -0.3]}
          width={0.3}
          height={0.05}
          length={1.2}
          materials={["alleyMaterial"]}
          opacity={0.8}
          physicsBody={{
            type: 'Static',
            shape: { type: "Box", params: [0.3, 0.05, 1.2] },
          }}
        />

        {/* Invisible Side Walls - Make it hard for the Sphere/ball to fall off */}
        {/* Left Wall */}
        <ViroBox
          position={[-0.16, 0.1, -0.3]}
          width={0.02}
          height={0.2}
          length={1.2}
          materials={["wallMaterial"]}
          opacity={0}
          physicsBody={{
            type: 'Static',
            shape: { type: "Box", params: [0.02, 0.2, 1.2] },
          }}
        />
        
        {/* Right Wall */}
        <ViroBox
          position={[0.16, 0.1, -0.3]}
          width={0.02}
          height={0.2}
          length={1.2}
          materials={["wallMaterial"]}
          opacity={0}
          physicsBody={{
            type: 'Static',
            shape: { type: "Box", params: [0.02, 0.2, 1.2] },
          }}
        />

        {/* Back Wall - Stops ball from going past pins */}
        <ViroBox
          position={[0, 0.1, -1.0]}
          width={0.3}
          height={0.2}
          length={0.02}
          materials={["wallMaterial"]}
          opacity={0}
          physicsBody={{
            type: 'Static',
            shape: { type: "Box", params: [0.3, 0.2, 0.02] },
          }}
        />

        {/* Front Wall - Stops ball from coming too far forward */}
        <ViroBox
          position={[0, 0.1, 0.4]}
          width={0.3}
          height={0.2}
          length={0.02}
          materials={["wallMaterial"]}
          opacity={0}
          physicsBody={{
            type: 'Static',
            shape: { type: "Box", params: [0.3, 0.2, 0.02] },
          }}
        />

        {/* Bowling Pins - Simple ViroBox components in triangle formation */}
        {/* Front Pin (closest to player) */}
        <ViroBox
          position={[0, 0.09, -0.5]}
          width={0.04}
          height={0.12}
          length={0.04}
          materials={["pinMaterial"]}
          physicsBody={{
            type: 'Dynamic',
            mass: 0.3,
            shape: { type: "Box", params: [0.04, 0.12, 0.04] },
            restitution: 0.3,
            friction: 0.5,
            useGravity: true,
          }}
        />

        {/* Back Left Pin */}
        <ViroBox
          position={[-0.06, 0.09, -0.6]}
          width={0.04}
          height={0.12}
          length={0.04}
          materials={["pinMaterial"]}
          physicsBody={{
            type: 'Dynamic',
            mass: 0.3,
            shape: { type: "Box", params: [0.04, 0.12, 0.04] },
            restitution: 0.3,
            friction: 0.5,
            useGravity: true,
          }}
        />

        {/* Back Right Pin */}
        <ViroBox
          position={[0.06, 0.09, -0.6]}
          width={0.04}
          height={0.12}
          length={0.04}
          materials={["pinMaterial"]}
          physicsBody={{
            type: 'Dynamic',
            mass: 0.3,
            shape: { type: "Box", params: [0.04, 0.12, 0.04] },
            restitution: 0.3,
            friction: 0.5,
            useGravity: true,
          }}
        />

        {/* Bowling Ball - Draggable Sphere */}

          <ViroSphere
            ref={ballRef}
            position={INITIAL_BALL_POS}
            onTransformUpdate={(updateObject: any) => {
              if (updateObject?.position) {
                onBallUpdate(updateObject.position);
              }
            }}
            radius={0.06}
            materials={["ballMaterial"]}
            dragType="FixedDistance"
            onDrag={onDrag}
            physicsBody={{
              type: 'Dynamic',
              mass: 3.0,
              shape: { type: "Sphere", params: [0.06] },
              restitution: 0.5,
              friction: 0.0,
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
  smallTextStyle: {
    fontFamily: "Arial",
    fontSize: 15,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

export default PhysicsDemo;

