/**
 * Config plugin to enable React Native New Architecture by adding
 * RCT_NEW_ARCH_ENABLED=1 to ios/.xcode.env during prebuild.
 * 
 * This is required for ViroReact 2.43.5+ which only works with New Architecture.
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withNewArchEnabled(config) {
  return withDangerousMod(config, ['ios', async (config) => {
    const projectRoot = config.modRequest.projectRoot;
    const xcodeEnvPath = path.join(projectRoot, 'ios', '.xcode.env');
    
    if (!fs.existsSync(xcodeEnvPath)) {
      console.warn('⚠️  .xcode.env file not found. Skipping New Architecture config.');
      return config;
    }
    
    let content = fs.readFileSync(xcodeEnvPath, 'utf8');
    
    // Check if RCT_NEW_ARCH_ENABLED is already set
    if (content.includes('RCT_NEW_ARCH_ENABLED')) {
      // Replace existing value
      content = content.replace(
        /export\s+RCT_NEW_ARCH_ENABLED=.*/g, 
        'export RCT_NEW_ARCH_ENABLED=1'
      );
    } else {
      // Add it after the NODE_BINARY line
      content = content.replace(
        /(export\s+NODE_BINARY=.*)/,
        '$1\n\n# Enable React Native New Architecture (required for ViroReact)\nexport RCT_NEW_ARCH_ENABLED=1'
      );
    }
    
    fs.writeFileSync(xcodeEnvPath, content, 'utf8');
    console.log('✅ Enabled React Native New Architecture in .xcode.env');
    
    return config;
  }]);
}

module.exports = withNewArchEnabled;

