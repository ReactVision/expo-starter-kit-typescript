# Expo Starter Kit for ViroReact

ViroReact AR/VR starter kit for Expo with TypeScript.

## Prerequisites

- ViroReact requires native code and **cannot run in Expo Go**
- You must use development builds or prebuild to run this project

## Project Demos

This starter kit demonstrates multiple AR scenarios to help you understand how ViroReact works.

### Project Structure

The app is built around a multi-scene navigation pattern, with Expo Router on the base:

- **`index.tsx`**: Entry point that initializes the `ViroARSceneNavigator` with the opening scene
- **`components/ar-scenes/`**: Contains all AR scene components
  - `OpeningScene.tsx`: Main menu with navigation options
  - `AutoPlaneScene.tsx`: Automatic plane detection demo
  - `ManualPlaneScene.tsx`: Manual plane selection demo
  - `NoPlaneScene.tsx`: AR without plane anchoring demo
  - `PhysicsDemo.tsx`: Physics-based bowling game demo

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

#### 5. Physics Demo (Bowling Game)
**Purpose**: Demonstrates physics simulation with a playable bowling mini-game

**Features**:
- Interactive AR bowling game with realistic physics simulation
- User selects a plane to place the bowling alley
- Draggable bowling ball with physics-based collision detection
- Three bowling pins arranged in a triangle formation
- Reset button to restart the game
- Invisible boundary walls to contain objects within the alley
- Automatic object reset when objects fall too far (prevents memory issues)

**Key Viro Components**:
- `ViroARScene`: Container with physics world configuration
  - `physicsWorld={{ gravity: -9.8 }}`: Enables physics simulation with Earth-like gravity
- `ViroARPlaneSelector`: Allows user to select a plane for the bowling alley
  - `minHeight={0.3}` and `minWidth={0.3}`: Minimum plane dimensions
  - `onPlaneSelected`: Callback when user selects a plane
  - `key={resetKey}`: Forces scene remount for clean physics reset
- `ViroBox`: Used for multiple purposes:
  - Bowling alley surface (black, 0.8 opacity)
  - Bowling pins (white, dynamic physics bodies)
  - Invisible boundary walls (left, right, front, back)
- `ViroSphere`: Bowling ball with draggable physics
  - `radius={0.06}`: Size of the bowling ball
  - `dragType="FixedDistance"`: Stable dragging at fixed distance from camera
  - `onTransformUpdate`: Monitors ball position for fall detection
- Physics Bodies:
  - **Static**: Used for alley surface and walls (don't move)
  - **Dynamic**: Used for ball and pins (affected by gravity and collisions)
  - `mass`: Controls object weight and collision response
  - `restitution`: Bounciness factor (0.3-0.5)
  - `friction`: Surface friction (affects rolling/sliding)
  - `useGravity`: Enables gravity effect on object

**Game Mechanics**:
- Bowling alley dimensions: 0.3m wide × 1.2m long × 0.05m tall
- Ball: 0.06m radius, 3.0 mass, low friction for rolling
- Pins: 0.04m × 0.12m × 0.04m, 0.3 mass each
- Pin positions:
  - Front pin: Z = -0.5
  - Back pins: Z = -0.6 (left and right)
- Invisible walls prevent objects from escaping the alley
- Fall detection threshold: Y < -0.5 triggers reset

**Interaction Methods**:
1. Tap to select a plane where the bowling alley will be placed
2. Drag the blue bowling ball to aim
3. Release to throw - physics handles the collision and pin knockdown
4. Tap "Reset" button to restart the game with fresh pin placement
5. Tap "Back" to return to the opening scene

**Physics Optimizations**:
- Objects that fall below Y = -0.5 automatically trigger a scene reset
- Scene uses a key-based reset system to properly clear physics state
- Boundary walls prevent infinite falling (which caused memory crashes)

---

### Common Viro Components Used

- **`ViroARScene`**: Root container for all AR content in a scene
- **`ViroText`**: 3D text with styling, positioning, and interaction support
- **`ViroAmbientLight`**: Provides even lighting across the scene for 3D models
- **`Viro3DObject`**: Loads external 3D models (GLB, GLTF, OBJ, etc.)
- **`ViroBox`**: Built-in 3D box primitive geometry
- **`ViroSphere`**: Built-in 3D sphere primitive geometry
- **`ViroARPlane`**: Automatic plane detection and anchoring
- **`ViroARPlaneSelector`**: User-controlled plane selection
- **`ViroMaterials`**: Material system for defining object appearance

### Drag Functionality

This project demonstrates three drag types:

1. **`FixedToPlane`** (Auto Plane Scene)
   - Constrains object movement to a specific plane surface
   - Requires `dragPlane` configuration with plane point, normal, and max distance
   - Perfect for objects that should stay on surfaces (tables, floors)

2. **`FixedToWorld`** (No Plane Scene)
   - Allows free movement in 3D world space
   - No plane constraints
   - Ideal for floating objects or free-form placement

3. **`FixedDistance`** (Physics Demo)
   - Keeps object at a fixed distance from the camera/user during drag
   - Most stable for AR interactions with physics
   - Object maintains consistent scale/distance while being repositioned
   - Works well with physics bodies as it doesn't override collision detection when released

All drag types can include an `onDrag` callback to handle position updates during drag events.

### Metro Configuration

The project includes a `metro.config.js` file that configures Metro bundler to handle 3D model file formats:
- `.glb`, `.gltf`: 3D model formats
- `.obj`, `.mtl`: Alternative 3D formats
- `.hdr`, `.ktx`: Texture formats

This configuration is essential for using `require()` to load 3D assets.

### Physics System

The Physics Demo scene demonstrates ViroReact's built-in physics engine capabilities:

**Physics World Setup**:
- Configured on `ViroARScene` with `physicsWorld={{ gravity: -9.8 }}`
- Gravity value in m/s² (negative Y direction)
- Affects all objects with `useGravity: true` in their physics body

**Physics Body Types**:
1. **Static** - Fixed objects that don't move (alley surface, walls)
   - Not affected by forces or collisions
   - Other objects can collide with them
   - Zero computational overhead

2. **Dynamic** - Movable objects affected by physics (ball, pins)
   - Responds to gravity, forces, and collisions
   - Has mass, friction, and restitution properties
   - Requires collision shape definition

**Physics Properties**:
- `mass`: Weight of the object (affects collision response)
- `shape`: Collision geometry (`Box`, `Sphere`, etc. with dimensions)
- `restitution`: Bounciness (0 = no bounce, 1 = perfect bounce)
- `friction`: Surface friction (0 = ice, 1 = rubber)
- `useGravity`: Enable/disable gravity for this object

**Collision Detection**:
- Automatic between all physics bodies
- No manual collision callbacks needed for basic interactions
- Objects with physics bodies will naturally interact based on their properties

**Best Practices**:
- Use simple collision shapes (Box, Sphere) for better performance
- Keep mass ratios reasonable (ball 10x heavier than pins works well)
- Add boundary walls to prevent infinite falling
- Monitor object positions with `onTransformUpdate` for cleanup
- Use key-based resets to properly clear physics state

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
