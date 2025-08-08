# Expo Starter Kit with React Viro (TypeScript)

React Viro AR/VR starter kit for Expo with TypeScript.

## Prerequisites

- React Viro requires native code and **cannot run in Expo Go**
- You must use development builds or prebuild to run this project

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

<a href="https://discord.gg/H3ksm5NhzT">
   <img src="https://discordapp.com/api/guilds/774471080713781259/widget.png?style=banner2" alt="Discord Banner 2"/>
</a>
