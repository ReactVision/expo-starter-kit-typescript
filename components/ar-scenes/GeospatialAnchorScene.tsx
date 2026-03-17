import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import {
  ViroARScene,
  ViroText,
  ViroBox,
  ViroNode,
  ViroAmbientLight,
  ViroMaterials,
} from "@reactvision/react-viro";

ViroMaterials.createMaterials({
  greenMaterial: {
    diffuseColor: "#32CD32",
  },
});

interface GeospatialPose {
  latitude: number;
  longitude: number;
  altitude: number;
  heading: number;
  horizontalAccuracy: number;
  verticalAccuracy: number;
}

interface AnchorInfo {
  id: string;
  latitude: number;
  longitude: number;
  altitude: number;
  position: [number, number, number];
}

const ACCURACY_THRESHOLD_M = 25;

const isValidLocation = (p: GeospatialPose | null): p is GeospatialPose =>
  p != null &&
  !(p.latitude === 0 && p.longitude === 0 && p.horizontalAccuracy === 0);

interface GeospatialAnchorSceneProps {
  sceneNavigator?: any;
  arSceneNavigator?: any;
}

const GeospatialAnchorScene = (props: GeospatialAnchorSceneProps = {}) => {
  const navigator = props.arSceneNavigator ?? props.sceneNavigator;
  const [pose, setPose] = useState<GeospatialPose | null>(null);
  const [anchors, setAnchors] = useState<AnchorInfo[]>([]);
  const [isHosting, setIsHosting] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  const poseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goBack = () => {
    navigator?.pop?.();
  };

  const resolveAndPlaceAnchor = useCallback(
    async (anchorId: string) => {
      if (!navigator?.resolveGeospatialAnchor) {
        Alert.alert("Error", "Failed to resolve anchor");
        return;
      }

      const result = await navigator.resolveGeospatialAnchor(anchorId);
      if (!result.success || !result.anchor) {
        console.warn("Resolve failed:", result.error);
        return;
      }

      const newAnchor: AnchorInfo = {
        id: result.anchor.anchorId,
        latitude: result.anchor.latitude,
        longitude: result.anchor.longitude,
        altitude: result.anchor.altitude,
        position: result.anchor.position,
      };

      setAnchors((prev) =>
        prev.some((a) => a.id === newAnchor.id) ? prev : [...prev, newAnchor],
      );
    },
    [navigator],
  );

  const hostAnchor = useCallback(async () => {
    if (!isValidLocation(pose)) {
      Alert.alert("Wait", "No location yet. Wait for GPS to acquire.");
      return;
    }
    if (pose.horizontalAccuracy > ACCURACY_THRESHOLD_M) {
      Alert.alert(
        "Wait",
        "Location accuracy is too low. Move to an open area.",
      );
      return;
    }

    if (!navigator?.hostGeospatialAnchor) return;
    setIsHosting(true);
    setStatus("Hosting...");
    try {
      const result = await navigator.hostGeospatialAnchor(
        pose.latitude,
        pose.longitude,
        pose.altitude,
        "street_level",
      );
      if (!result.success || !result.anchorId) {
        Alert.alert("Failed", result.error || "Could not host anchor");
        setStatus(`Host failed: ${result.error || "Unknown"}`);
        return;
      }
      await resolveAndPlaceAnchor(result.anchorId);
      setStatus(`Hosted! ID: ${result.anchorId}`);
    } catch (error: unknown) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Unknown error",
      );
      setStatus("Error hosting");
    } finally {
      setIsHosting(false);
    }
  }, [pose, navigator, resolveAndPlaceAnchor]);

  const findNearbyAnchors = useCallback(async () => {
    if (!isValidLocation(pose)) return;

    if (!navigator?.rvFindNearbyGeospatialAnchors) return;
    setStatus("Finding nearby...");
    try {
      const result = await navigator.rvFindNearbyGeospatialAnchors(
        pose.latitude,
        pose.longitude,
        500,
        20,
      );
      if (!result.success || !result.anchors) {
        setStatus("No nearby anchors");
        return;
      }
      for (const anchor of result.anchors) {
        const anchorId = anchor.id || anchor.anchorId;
        if (!anchorId) continue;
        await resolveAndPlaceAnchor(anchorId);
      }
      setStatus(`Found ${result.anchors.length} nearby`);
    } catch {
      setStatus("Find nearby failed");
    }
  }, [pose, navigator, resolveAndPlaceAnchor]);

  useEffect(() => {
    (async () => {
      const { status: permStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (permStatus !== "granted") {
        Alert.alert(
          "Location Required",
          "Enable location to use geospatial AR.",
        );
        setStatus("Location permission denied");
      }
    })();
  }, []);

  const startGeospatial = useCallback(() => {
    if (!navigator) return;
    navigator.setGeospatialModeEnabled(true);
    setStatus("Acquiring geospatial pose…");
    poseIntervalRef.current = setInterval(async () => {
      try {
        const result = await navigator.getCameraGeospatialPose();
        if (result.success && result.pose) {
          setPose(result.pose);
          if (isValidLocation(result.pose)) {
            setStatus((s) =>
              s === "Acquiring geospatial pose…" ? "Ready" : s,
            );
          }
        }
      } catch (error) {
        console.warn("Pose poll error:", error);
      }
    }, 1000);
  }, [navigator]);

  useEffect(() => {
    const timer = setTimeout(startGeospatial, 2000);
    return () => {
      clearTimeout(timer);
      if (poseIntervalRef.current) clearInterval(poseIntervalRef.current);
    };
  }, [startGeospatial]);

  const hasLocation = isValidLocation(pose);
  const canHost =
    hasLocation &&
    pose.horizontalAccuracy <= ACCURACY_THRESHOLD_M &&
    !isHosting;

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />

      <ViroText
        text="Back"
        scale={[0.3, 0.3, 0.3]}
        position={[-0.5, 0.3, -0.7]}
        style={styles.textStyle}
        onClick={goBack}
      />

      <ViroText
        text="Host"
        scale={[0.3, 0.3, 0.3]}
        position={[0, 0.3, -0.7]}
        style={[styles.textStyle, !canHost && styles.disabledText]}
        onClick={canHost ? hostAnchor : undefined}
      />

      <ViroText
        text="Find Nearby"
        scale={[0.3, 0.3, 0.3]}
        position={[0.5, 0.3, -0.7]}
        style={[styles.textStyle, !hasLocation && styles.disabledText]}
        onClick={hasLocation ? findNearbyAnchors : undefined}
      />

      <ViroText
        text={status}
        scale={[0.25, 0.25, 0.25]}
        position={[0, 0, -2]}
        style={styles.statusText}
      />

      {pose && (
        <ViroText
          text={`${pose.latitude.toFixed(5)}, ${pose.longitude.toFixed(5)} | ±${pose.horizontalAccuracy.toFixed(1)}m`}
          scale={[0.2, 0.2, 0.2]}
          position={[0, -0.3, -2]}
          style={styles.statusText}
        />
      )}

      {anchors.map((anchor) => (
        <ViroNode key={anchor.id} position={anchor.position}>
          <ViroBox scale={[0.2, 0.2, 0.2]} materials={["greenMaterial"]} />
        </ViroNode>
      ))}
    </ViroARScene>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
  disabledText: {
    color: "#888888",
  },
  statusText: {
    fontFamily: "Arial",
    fontSize: 24,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

export default GeospatialAnchorScene;
