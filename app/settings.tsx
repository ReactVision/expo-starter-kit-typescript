import { Host, List, ListItem, Switch } from "@expo/ui";
import { StatusBar } from "expo-status-bar";
import { useSettings } from "@/contexts/SettingsContext";

export default function Settings() {
  const { occlusionEnabled, setOcclusionEnabled, occlusionSupported } =
    useSettings();

  const occlusionUnsupported = occlusionSupported === false;

  return (
    <>
      <StatusBar style="auto" />
      <Host style={{ flex: 1 }} useViewportSizeMeasurement>
        <List>
          <ListItem
            supportingText={
              occlusionUnsupported
                ? "Depth-based occlusion is not supported on this device"
                : "Enable depth-based occlusion for AR objects"
            }
            trailing={
              <Switch
                value={occlusionEnabled}
                onValueChange={setOcclusionEnabled}
                disabled={occlusionUnsupported}
              />
            }
          >
            Occlusion
          </ListItem>
        </List>
      </Host>
    </>
  );
}
