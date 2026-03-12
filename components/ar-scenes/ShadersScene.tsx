import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroSphere,
  ViroNode,
  ViroAmbientLight,
  ViroMaterials,
  ViroSpotLight,
} from "@reactvision/react-viro";
import { Viro3DPoint } from "@reactvision/react-viro/dist/components/Types/ViroUtils";

// Define Materials with Shader Modifiers
ViroMaterials.createMaterials({
  // 1. Normal - no shader
  normalMaterial: {
    lightingModel: "Constant",
  },

  // 2. Black - pure black
  blackMaterial: {
    lightingModel: "Constant",
    shaderModifiers: {
      surface: `
        _surface.diffuse_color = vec4(0.0, 0.0, 0.0, 1.0);
      `,
    },
  },

  // 3. Black + Red Rim (Animated)
  blackRedRim: {
    lightingModel: "Constant",
    shaderModifiers: {
      surface: `
        uniform highp float time;

        // Calculate edge based on normal
        highp float edge = abs(dot(_surface.normal, normalize(_surface.view)));
        edge = 1.0 - edge; // Invert so edges are 1.0
        edge = pow(edge, 3.0); // Sharp falloff

        // Animate the rim intensity with pulsing effect
        highp float pulse = sin(time * 0.002) * 0.3 + 0.7; // Pulse between 0.4 and 1.0

        // Animate the rim width
        highp float animatedEdge = pow(edge, 3.0 - pulse * 1.5); // Width varies

        // Black base with animated red rim
        _surface.diffuse_color = vec4(animatedEdge * pulse, 0.0, 0.0, 1.0);
      `,
    },
  },

  // 4. Normal + Red Rim (Animated)
  normalRedRim: {
    lightingModel: "Constant",
    diffuseColor: "#cccccc",
    shaderModifiers: {
      surface: `
        uniform highp float time;

        // Preserve original texture
        highp vec3 baseColor = _surface.diffuse_color.rgb;

        // Calculate edge
        highp float edge = abs(dot(_surface.normal, normalize(_surface.view)));
        edge = 1.0 - edge;

        // Animate rim with pulsing and traveling wave
        highp float pulse = sin(time * 0.002) * 0.4 + 0.6; // Pulse intensity

        // Add traveling wave effect along the normal
        highp float wave = sin(time * 0.001 + _surface.normal.y * 5.0) * 0.3 + 0.7;

        highp float animatedEdge = pow(edge, 3.0 - pulse * 1.0); // Animated width

        // Add animated red rim to original color with wave
        _surface.diffuse_color.rgb = baseColor + vec3(animatedEdge * pulse * wave * 2.5, 0.0, 0.0);
      `,
    },
  },

  // 5. Crystal Shell - Terastal Pokemon effect with visible polygons
  crystalShell: {
    lightingModel: "Blinn",
    shininess: 300.0,
    blendMode: "Alpha",
    transparencyMode: "RGBZero",
    cullMode: "None",
    shaderModifiers: {
      geometry: `
        // VERY strong quantization for triangle-level detail
        highp vec3 quantizedNormal = floor(_geometry.normal * 8.0) / 8.0;
        quantizedNormal = normalize(quantizedNormal);

        // Variable shell thickness - almost touching the model
        highp float facetVariation = dot(quantizedNormal, vec3(1.0, 0.5, 0.7));
        facetVariation = fract(facetVariation * 10.0);

        // Extremely thin shell - practically glued to the model
        highp float shellThickness = 0.005 + facetVariation * 0.008;

        // Expand using quantized normal
        _geometry.position.xyz += quantizedNormal * shellThickness;
      `,
      surface: `
        uniform highp float time;

        // EXTREME quantization for triangle-level visibility
        highp vec3 quantizedNormal = floor(_surface.normal * 10.0) / 10.0;
        quantizedNormal = normalize(quantizedNormal);

        // Each triangle gets a unique ID based on its normal
        highp float triangleId = dot(quantizedNormal, vec3(12.9898, 78.233, 45.164));

        // COLOR WAVE EFFECT - wave sweeps through the model
        highp float waveY = sin(time * 0.0008) * 1.5;
        highp float waveX = cos(time * 0.001) * 1.2;
        highp float waveZ = sin(time * 0.0009 + 1.5) * 1.0;

        highp float distY = _surface.position.y - waveY;
        highp float distX = _surface.position.x - waveX;
        highp float distZ = _surface.position.z - waveZ;

        highp float waveInfluence = smoothstep(0.8, 0.0, abs(distY * 0.5));
        waveInfluence += smoothstep(0.6, 0.0, abs(distX * 0.6)) * 0.5;
        waveInfluence += smoothstep(0.5, 0.0, abs(distZ * 0.7)) * 0.3;
        waveInfluence = clamp(waveInfluence, 0.0, 1.0);

        highp float hue = (_surface.position.y * 0.3 + _surface.position.x * 0.2 + time * 0.0002);
        hue = fract(hue);

        // HSV to RGB for vibrant colors
        highp vec3 waveColor;
        highp float h = hue * 6.0;
        highp float x = 1.0 - abs(mod(h, 2.0) - 1.0);

        if (h < 1.0) waveColor = vec3(1.0, x, 0.0);
        else if (h < 2.0) waveColor = vec3(x, 1.0, 0.0);
        else if (h < 3.0) waveColor = vec3(0.0, 1.0, x);
        else if (h < 4.0) waveColor = vec3(0.0, x, 1.0);
        else if (h < 5.0) waveColor = vec3(x, 0.0, 1.0);
        else waveColor = vec3(1.0, 0.0, x);

        // Fresnel for edge reflections
        highp vec3 viewDir = normalize(_surface.view);
        highp float fresnel = abs(dot(quantizedNormal, viewDir));
        fresnel = 1.0 - fresnel;
        fresnel = pow(fresnel, 2.5);

        // Triangle edge detection
        highp float edge1 = abs(fract(dot(quantizedNormal, vec3(7.7, 5.3, 3.1))) - 0.5) * 2.0;
        highp float edge2 = abs(fract(dot(quantizedNormal, vec3(3.3, 9.1, 6.7))) - 0.5) * 2.0;
        highp float edge3 = abs(fract(dot(quantizedNormal, vec3(5.9, 2.7, 8.3))) - 0.5) * 2.0;

        highp float triangleEdge = max(max(edge1, edge2), edge3);
        triangleEdge = pow(triangleEdge, 2.5);

        // Sparkle effect enhanced by wave
        highp float sparkle = fract(sin(triangleId * 5.234 + time * 0.0005) * 43758.5453);
        sparkle = step(0.95, sparkle) * waveInfluence * 2.0;

        highp vec3 crystalBase = vec3(0.95, 0.97, 1.0);
        highp vec3 finalColor = vec3(0.0);

        finalColor += waveColor * waveInfluence * 2.0;
        highp vec3 baseTriangleColor = waveColor * 0.6;
        finalColor += baseTriangleColor;
        finalColor += waveColor * triangleEdge * 0.8;
        finalColor += waveColor * fresnel * 0.6;
        finalColor += waveColor * sparkle * 2.5;

        _surface.diffuse_color.rgb = finalColor;
        _surface.diffuse_color.a = 0.65 + fresnel * 0.3 + triangleEdge * 0.15 + waveInfluence * 0.25;
      `,
      fragment: `
        _output_color.rgb = _surface.diffuse_color.rgb;
        _output_color.a = _surface.diffuse_color.a;
      `,
    },
  },

  // 6. Ocean Water Effect
  oceanWater: {
    lightingModel: "Blinn",
    shininess: 150.0,
    blendMode: "Alpha",
    transparencyMode: "RGBZero",
    cullMode: "None",
    shaderModifiers: {
      geometry: `
        uniform highp float time;

        // Create flowing water waves on the geometry
        highp float wave1 = sin(_geometry.position.x * 2.0 + time * 0.002) * 0.08;
        highp float wave2 = cos(_geometry.position.z * 2.5 + time * 0.0025) * 0.06;
        highp float wave3 = sin((_geometry.position.x + _geometry.position.z) * 1.5 + time * 0.0018) * 0.05;

        _geometry.position.y += wave1 + wave2 + wave3;
      `,
      surface: `
        uniform highp float time;

        highp vec3 deepBlue = vec3(0.0, 0.15, 0.45);
        highp vec3 oceanCyan = vec3(0.0, 0.5, 0.75);
        highp vec3 lightCyan = vec3(0.1, 0.7, 0.9);

        highp vec3 viewDir = normalize(_surface.view);
        highp float fresnel = abs(dot(_surface.normal, viewDir));
        fresnel = 1.0 - fresnel;
        fresnel = pow(fresnel, 2.5);

        highp float flowX = sin(_surface.position.x * 3.0 + time * 0.003) * 0.5 + 0.5;
        highp float flowZ = cos(_surface.position.z * 3.5 + time * 0.0025) * 0.5 + 0.5;
        highp float flowPattern = (flowX + flowZ) * 0.5;

        highp float caustic1 = sin(_surface.position.x * 8.0 + time * 0.004);
        highp float caustic2 = sin(_surface.position.z * 6.0 - time * 0.0035);
        highp float caustics = (caustic1 * caustic2) * 0.5 + 0.5;
        caustics = pow(caustics, 4.0);

        highp vec3 waterColor = mix(deepBlue, oceanCyan, flowPattern * 0.8);
        waterColor += lightCyan * caustics * 0.3;
        waterColor += lightCyan * fresnel * 0.4;

        _surface.diffuse_color.rgb = waterColor;
        _surface.diffuse_color.a = 0.6 + fresnel * 0.25;
      `,
      fragment: `
        _output_color.rgb = _surface.diffuse_color.rgb;
        _output_color.a = _surface.diffuse_color.a;
      `,
    },
  },

  // 7. Crystal Bubble with Animated Rainbow Reflections
  crystalGlass: {
    lightingModel: "Blinn",
    shininess: 200.0,
    blendMode: "Alpha",
    transparencyMode: "RGBZero",
    shaderModifiers: {
      surface: `
        uniform highp float time;

        // Calculate Fresnel effect (edges are more reflective)
        highp vec3 viewDir = normalize(_surface.view);
        highp float fresnel = abs(dot(_surface.normal, viewDir));
        fresnel = 1.0 - fresnel;
        fresnel = pow(fresnel, 3.0);

        // Animated bubble shimmer effect
        highp float shimmer = sin(time * 0.003 + _surface.position.y * 3.0) * 0.3 + 0.7;

        // Create animated rainbow/prismatic effect
        highp vec3 normal = _surface.normal;
        highp float hue = dot(normal, viewDir) * 0.3 + time * 0.00015;

        // Add flowing wave pattern for bubble-like movement
        highp float wave1 = sin(time * 0.0008 + _surface.position.x * 2.0) * 0.5;
        highp float wave2 = cos(time * 0.001 + _surface.position.z * 2.5) * 0.5;
        hue += wave1 + wave2;
        hue = fract(hue);

        // Convert hue to RGB
        highp vec3 rainbow;
        highp float h = hue * 6.0;
        highp float x = 1.0 - abs(mod(h, 2.0) - 1.0);

        if (h < 1.0) rainbow = vec3(1.0, x, 0.0);
        else if (h < 2.0) rainbow = vec3(x, 1.0, 0.0);
        else if (h < 3.0) rainbow = vec3(0.0, 1.0, x);
        else if (h < 4.0) rainbow = vec3(0.0, x, 1.0);
        else if (h < 5.0) rainbow = vec3(x, 0.0, 1.0);
        else rainbow = vec3(1.0, 0.0, x);

        // Bubble-like transparent base with shimmer
        highp vec3 crystalBase = vec3(0.95, 0.97, 1.0);

        // Animated rainbow at edges with shimmer
        highp vec3 finalColor = mix(crystalBase * 0.3, rainbow * 1.3 * shimmer, fresnel);

        // Pulsing edge highlights
        highp float pulse = sin(time * 0.002) * 0.2 + 0.8;
        finalColor += vec3(1.0) * fresnel * 0.8 * pulse;

        // Add subtle sparkles that move across surface
        highp float sparklePattern = sin(_surface.position.x * 20.0 + time * 0.005) *
                                     cos(_surface.position.y * 15.0 + time * 0.004);
        highp float sparkle = step(0.98, sparklePattern);
        finalColor += vec3(1.0) * sparkle * fresnel * 0.6;

        _surface.diffuse_color.rgb = finalColor;

        // Animated transparency for breathing bubble effect
        highp float breathe = sin(time * 0.0015) * 0.1 + 0.9;
        _surface.diffuse_color.a = (0.3 + fresnel * 0.5) * breathe;
      `,
    },
  },
});

const SPHERE_RADIUS = 0.25;
const SPACING = 0.7;
const SPHERES = [
  {
    position: [-SPACING * 3, 0, -2] as Viro3DPoint,
    material: "normalMaterial",
    label: "Normal",
  },
  {
    position: [-SPACING * 2, 0, -2] as Viro3DPoint,
    material: "blackMaterial",
    label: "Black",
  },
  {
    position: [-SPACING * 1, 0, -2] as Viro3DPoint,
    material: "blackRedRim",
    label: "Black+RedRim",
  },
  {
    position: [0, 0, -2] as Viro3DPoint,
    material: "normalRedRim",
    label: "Normal+RedRim",
  },
  {
    position: [SPACING * 1, 0, -2] as Viro3DPoint,
    material: "crystalShell",
    label: "CrystalShell",
  },
  {
    position: [SPACING * 2, 0, -2] as Viro3DPoint,
    material: "oceanWater",
    label: "Ocean",
  },
  {
    position: [SPACING * 3, 0, -2] as Viro3DPoint,
    material: "crystalGlass",
    label: "CrystalGlass",
  },
];

interface ShadersSceneProps {
  sceneNavigator?: any;
}

const ShadersScene = (props: ShadersSceneProps = {}) => {
  const { sceneNavigator } = props;

  // Update shader time uniforms for animation
  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() % 1000000;
      ViroMaterials.updateShaderUniform("blackRedRim", "time", "float", time);
      ViroMaterials.updateShaderUniform("normalRedRim", "time", "float", time);
      ViroMaterials.updateShaderUniform("crystalShell", "time", "float", time);
      ViroMaterials.updateShaderUniform("oceanWater", "time", "float", time);
      ViroMaterials.updateShaderUniform("crystalGlass", "time", "float", time);
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const goBack = () => {
    sceneNavigator.pop();
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={300} />
      <ViroSpotLight
        innerAngle={5}
        outerAngle={90}
        direction={[0, -1, -0.2]}
        position={[0, 3, 0]}
        color="#ffffff"
        castsShadow={true}
      />

      <ViroText
        text="Back"
        scale={[0.3, 0.3, 0.3]}
        position={[-0.2, 0.3, -0.7]}
        style={styles.textStyle}
        onClick={goBack}
      />

      <ViroText
        text="Shaders"
        scale={[0.4, 0.4, 0.4]}
        position={[0, 0.8, -2]}
        style={styles.textStyle}
      />

      {SPHERES.map((sphere) => (
        <ViroNode key={sphere.material}>
          <ViroSphere
            position={sphere.position}
            radius={SPHERE_RADIUS}
            widthSegmentCount={20}
            heightSegmentCount={20}
            materials={[sphere.material]}
          />
          <ViroText
            text={sphere.label}
            scale={[0.5, 0.5, 0.5]}
            position={[
              sphere.position[0],
              sphere.position[1] + SPHERE_RADIUS + 0.2,
              sphere.position[2],
            ]}
            style={styles.labelStyle}
          />
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
  labelStyle: {
    fontFamily: "Arial",
    fontSize: 16,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

export default ShadersScene;
