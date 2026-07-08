import type { ComponentType } from "react";
import type { ViroARSceneNavigator } from "@reactvision/react-viro";

export type { Viro3DPoint } from "@reactvision/react-viro/dist/components/Types/ViroUtils";

// The navigation API Viro injects into every scene. Viro types push/replace/jump
// with an internal shape that omits the `{ scene }` object the API actually takes
// (see the @todo in Viro's ViroARSceneNavigator source), so override push here.
type ViroSceneNavigator = ViroARSceneNavigator["sceneNavigator"];

export type SceneNavigator = Omit<ViroSceneNavigator, "push"> & {
  push: (scene: { scene: ComponentType }) => void;
};

export type SceneProps = {
  sceneNavigator?: SceneNavigator;
};
