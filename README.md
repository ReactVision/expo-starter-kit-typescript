# Expo Starter Kit for ViroReact

ViroReact AR/VR starter kit for Expo with TypeScript.

## Prerequisites

- ViroReact requires native code and **cannot run in Expo Go**
- You must use development builds or prebuild to run this project

## Project Demos

This starter kit demonstrates multiple AR scenarios to help you understand how ViroReact works.

### Project Structure

The app is built around a multi-scene navigation pattern:

- **`App.tsx`**: Entry point that initializes the `ViroARSceneNavigator` with the opening scene
- **`components/ar-scenes/`**: Contains all AR scene components
  - `OpeningScene.tsx`: Main menu with navigation options
  - `AutoPlaneScene.tsx`: Automatic plane detection demo
  - `ManualPlaneScene.tsx`: Manual plane selection demo
  - `NoPlaneScene.tsx`: AR without plane anchoring demo

### Scene Navigation

The app uses `ViroARSceneNavigator` to manage scene transitions. Each scene receives a `sceneNavigator` prop that enables:
- **`sceneNavigator.push({ scene })`**: Navigate to a new scene
- **`sceneNavigator.pop()`**: Return to the previous scene

### Scene Breakdown

#### 1. Opening Scene
**Purpose**: Navigation hub for exploring different AR plane detection methods

**Features**:
- Three clickable `ViroText` elements stacked vertically
- Each text navigates to a different demonstration scene
- Uses `onClick` handlers to trigger scene transitions

**Key Viro Components**:
- `ViroARScene`: Container for AR content
- `ViroText`: 3D text elements with click interaction

---

#### 2. Auto Plane Scene
**Purpose**: Demonstrates automatic horizontal plane detection with interactive 3D objects

**Features**:
- Automatically detects horizontal planes (tables, floors) with minimum dimensions of 0.1m x 0.1m
- Displays a robot 3D model (GLB format) when a plane is detected
- Robot is draggable within the plane boundaries
- Shows "Detecting plane..." message until a plane is found
- Back button to return to opening scene

**Key Viro Components**:
- `ViroARPlane`: Automatically detects and anchors to horizontal planes
  - `minHeight={0.1}` and `minWidth={0.1}`: Minimum plane dimensions
  - `onAnchorFound`: Callback when a plane is detected
- `Viro3DObject`: Loads and renders the robot.glb 3D model
  - `type="GLB"`: Specifies GLB/GLTF format
  - `dragType="FixedToPlane"`: Constrains dragging to the plane surface
  - `dragPlane`: Configuration for drag plane properties
    - `planePoint`: Origin of the drag plane
    - `planeNormal`: Normal vector defining plane orientation (0, 0.5, 0 for horizontal)
    - `maxDistance`: Maximum drag distance in meters
  - `onDrag`: Callback that fires during drag events, logs position changes
- `ViroAmbientLight`: Provides lighting for 3D models

**Interaction Methods**:
- Plane detection is automatic upon entering the scene
- Touch and drag the robot to move it across the detected plane

---

#### 3. Manual Plane Scene
**Purpose**: Demonstrates user-controlled plane selection with 3D content placement

**Features**:
- User taps to manually select a plane from detected surfaces
- Displays a dog 3D model (GLB format) on the selected plane
- Shows "Tap to select a plane" instruction until user selects
- Back button to return to opening scene

**Key Viro Components**:
- `ViroARPlaneSelector`: Allows user to manually choose from detected planes
  - `minHeight={0.1}` and `minWidth={0.1}`: Minimum plane dimensions
  - `onPlaneSelected`: Callback when user taps to select a plane
- `Viro3DObject`: Loads and renders the dog.glb 3D model
  - `type="GLB"`: Specifies GLB/GLTF format
- `ViroAmbientLight`: Provides lighting for 3D models

**Interaction Methods**:
- User taps on a detected plane surface to place the dog model
- Provides more control over object placement compared to automatic detection

---

#### 4. No Plane Scene
**Purpose**: Demonstrates AR without plane anchoring, allowing free-space object manipulation

**Features**:
- Places a 3D box in space without requiring plane detection
- Box is freely draggable in 3D world space
- No plane detection or anchoring required
- Back button to return to opening scene

**Key Viro Components**:
- `ViroBox`: Simple 3D box primitive for placeholder content
  - `materials`: Custom material with color (lime green)
- `ViroMaterials.createMaterials()`: Defines visual appearance
  - `diffuseColor`: Base color of the material
- Dragging configuration:
  - `dragType="FixedToWorld"`: Allows free dragging in 3D world coordinates
  - `onDrag`: Callback that fires during drag events, logs position changes

**Interaction Methods**:
- Touch and drag the box to move it freely in 3D space
- No plane detection required - object exists in world coordinates

---

### Common Viro Components Used

- **`ViroARScene`**: Root container for all AR content in a scene
- **`ViroText`**: 3D text with styling, positioning, and interaction support
- **`ViroAmbientLight`**: Provides even lighting across the scene for 3D models
- **`Viro3DObject`**: Loads external 3D models (GLB, GLTF, OBJ, etc.)
- **`ViroBox`**: Built-in 3D box primitive geometry
- **`ViroARPlane`**: Automatic plane detection and anchoring
- **`ViroARPlaneSelector`**: User-controlled plane selection
- **`ViroMaterials`**: Material system for defining object appearance

### Drag Functionality

This project demonstrates two drag types:

1. **`FixedToPlane`** (Auto Plane Scene)
   - Constrains object movement to a specific plane surface
   - Requires `dragPlane` configuration with plane point, normal, and max distance
   - Perfect for objects that should stay on surfaces (tables, floors)

2. **`FixedToWorld`** (No Plane Scene)
   - Allows free movement in 3D world space
   - No plane constraints
   - Ideal for floating objects or free-form placement

Both require an `onDrag` callback to handle position updates during drag events.

### Metro Configuration

The project includes a `metro.config.js` file that configures Metro bundler to handle 3D model file formats:
- `.glb`, `.gltf`: 3D model formats
- `.obj`, `.mtl`: Alternative 3D formats
- `.hdr`, `.ktx`: Texture formats

This configuration is essential for using `require()` to load 3D assets.

## Installation

```shell
npm install
```

## Setup

Generate native directories (required for ViroReact):

```shell
npx expo prebuild --clean
```

Check for any project issues:

```shell
npx expo-doctor
```

## Running

**Development builds** (recommended):

```shell
npx expo run:ios
npx expo run:android
```

**Development server** (after building):

```shell
npx expo start --dev-client
```

## Troubleshooting

### iOS Build Error: "no such module 'ExpoModulesCore'"

If building through `npx expo run:ios` presents the following error "no such module 'ExpoModulesCore'", follow these steps:

1. Start your development server:
   ```shell
   npx expo start --dev-client
   ```

2. Open the Xcode workspace for the project within the ios folder:
   ```shell
   open ios/expostarterkittypescript.xcworkspace
   ```

3. Build and run the application directly within Xcode

This ensures the Metro bundler is running and properly connected to your iOS build.

## Expo Docs

[Expo Docs](https://docs.expo.dev/)

## Need help?

[ViroReact Docs](https://viro-community.readme.io/docs/overview)

[ViroReact Website](https://reactvision.xyz/viro-react?source=starterkit-readme)

<a href="https://discord.gg/H3ksm5NhzT">
   <img src="https://discordapp.com/api/guilds/774471080713781259/widget.png?style=banner2" alt="Discord Banner 2"/>
</a>
