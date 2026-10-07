// XR_TARGET=quest builds the Meta Quest APK. QUEST mode makes the manifest
// require head tracking, which hides the app from phones on the Play Store, so
// phone and Quest builds stay separate.
module.exports = ({ config }) => {
  if (process.env.XR_TARGET !== "quest") return config;
  return {
    ...config,
    plugins: config.plugins.map((plugin) =>
      Array.isArray(plugin) && plugin[0] === "@reactvision/react-viro"
        ? [
            plugin[0],
            {
              ...plugin[1],
              android: {
                ...plugin[1].android,
                xRMode: ["AR", "QUEST"],
                // Store review checks each declared permission against its use,
                // and the kit uses none of these. Turn one back on before adding
                // co-location, Quest Pro eye gaze or ViroObjectDetector.
                questFeatures: {
                  colocation: false,
                  eyeTracking: false,
                  passthroughCamera: false,
                },
              },
            },
          ]
        : plugin,
    ),
  };
};
