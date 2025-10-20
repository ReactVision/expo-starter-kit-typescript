const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for 3D model file extensions
config.resolver.assetExts.push(
  // 3D model formats
  'glb',
  'gltf',
  'obj',
  'mtl',
  'fbx',
  'dae',
  'vrx',
  'arobject',
  // Additional asset formats that ViroReact might use
  'hdr',
  'ktx'
);

module.exports = config;

