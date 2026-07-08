import { Platform, StyleSheet, View } from "react-native";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { Host, Button, Icon } from "@expo/ui";
import {
  buttonBorderShape,
  buttonStyle,
  labelStyle,
} from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OpeningScene from "@/components/ar-scenes/OpeningScene";
import { useSettings } from "@/contexts/SettingsContext";

const SETTINGS_ICON = Icon.select({
  ios: "gearshape.fill",
  android: import("@expo/material-symbols/settings.xml"),
});

export default function ARHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { occlusionEnabled, setOcclusionSupported, setOcclusionEnabled } =
    useSettings();

  const handleNavigatorRef = (
    navigator: InstanceType<typeof ViroARSceneNavigator> | null,
  ) => {
    if (navigator?.arSceneNavigator?.isDepthOcclusionSupported) {
      navigator.arSceneNavigator.isDepthOcclusionSupported().then((result) => {
        console.log("isDepthOcclusionSupported", result);
        setOcclusionSupported(result.supported);
        if (!result.supported) {
          setOcclusionEnabled(false);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        ref={handleNavigatorRef}
        initialScene={{ scene: OpeningScene }}
        style={styles.arNavigator}
        occlusionMode={occlusionEnabled ? "depthBased" : "disabled"}
      />
      <Host
        matchContents
        style={[styles.settingsButton, { top: insets.top + 16, right: 16 }]}
      >
        <Button
          modifiers={
            Platform.OS === "ios"
              ? [
                  buttonStyle("glass"),
                  buttonBorderShape("circle"),
                  labelStyle("iconOnly"),
                ]
              : undefined
          }
          onPress={() => router.push("/settings")}
        >
          <Icon name={SETTINGS_ICON} size={24} />
        </Button>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arNavigator: {
    flex: 1,
  },
  settingsButton: {
    position: "absolute",
  },
  settingsButtonInner: {
    width: 70,
    height: 70,
  },
});
