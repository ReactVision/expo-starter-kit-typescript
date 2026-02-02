import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OpeningScene from "@/components/ar-scenes/OpeningScene";
import { useSettings } from "@/contexts/SettingsContext";

export default function ARHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { occlusionEnabled } = useSettings();

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        initialScene={{ scene: OpeningScene }}
        style={styles.arNavigator}
        occlusionMode={occlusionEnabled ? "depthBased" : "disabled"}
      />
      <TouchableOpacity
        style={[
          styles.settingsButton,
          {
            top: insets.top + 16,
            right: 16,
          },
        ]}
        onPress={() => router.push("/settings")}
        activeOpacity={0.7}
      >
        <Ionicons name="settings" size={24} color="#000" />
      </TouchableOpacity>
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
});
