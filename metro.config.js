const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add glb/gltf 3D model support
config.resolver.assetExts.push('glb', 'gltf');

module.exports = config;

