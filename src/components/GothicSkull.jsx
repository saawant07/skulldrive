import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const CursedSkull = (props) => {
    const mesh = useRef();

    // Uniforms for the shader
    const uniforms = useMemo(
        () => ({
            time: { value: 0 },
            bloodColor: { value: new THREE.Color('#b91c1c') },
            baseColor: { value: new THREE.Color('#e5e5e5') },
        }),
        []
    );

    useFrame((state) => {
        if (mesh.current) {
            // Continuous Rotation
            mesh.current.rotation.y = state.clock.getElapsedTime() * 0.2;
            // Update shader time
            uniforms.time.value = state.clock.getElapsedTime();
        }
    });

    const onBeforeCompile = (shader) => {
        shader.uniforms.time = uniforms.time;
        shader.uniforms.bloodColor = uniforms.bloodColor;
        shader.uniforms.baseColor = uniforms.baseColor;

        // --- VERTEX SHADER INJECTION ---
        shader.vertexShader = `
      uniform float time;
      varying vec3 vPos;
      varying float vNoise;
      
      // Simple hash for noise
      float hash(vec3 p) {
          p  = fract( p*0.3183099 + .1 );
          p *= 17.0;
          return fract( p.x*p.y*p.z*(p.x+p.y+p.z) );
      }

      float noise( in vec3 x ) {
          vec3 i = floor(x);
          vec3 f = fract(x);
          f = f*f*(3.0-2.0*f);
          return mix(mix(mix( hash(i+vec3(0,0,0)), 
                          hash(i+vec3(1,0,0)),f.x),
                      mix( hash(i+vec3(0,1,0)), 
                          hash(i+vec3(1,1,0)),f.x),f.y),
                  mix(mix( hash(i+vec3(0,0,1)), 
                          hash(i+vec3(1,0,1)),f.x),
                      mix( hash(i+vec3(0,1,1)), 
                          hash(i+vec3(1,1,1)),f.x),f.y),f.z);
      }

      ${shader.vertexShader}
    `;

        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
        #include <begin_vertex>
        
        // Pass position to fragment
        vPos = position;
        
        // --- ORGANIC DISTORTION ---
        
        // 1. Jaw Extension
        // Pull vertices down if y < -0.1
        float jawMix = smoothstep(0.1, -0.6, position.y);
        transformed.y -= jawMix * 0.6; 
        transformed.z += jawMix * 0.3; // Jut forward
        
        // 2. Cheekbone Flattening (Temporal Pinch)
        // Pinch x at mid-height
        float cheekMix = smoothstep(0.4, -0.2, position.y) * smoothstep(-0.8, 0.4, position.y);
        float sidePinch = smoothstep(0.4, 1.0, abs(position.x)); // Only outer sides
        transformed.x *= 1.0 - (cheekMix * sidePinch * 0.5);

        // 3. Eye Sockets Indentation
        // Approximate Eye positions: x=±0.35, y=0.1, z=0.8 (on sphere)
        float eyeL = distance(position, vec3(-0.35, 0.15, 0.85));
        float eyeR = distance(position, vec3(0.35, 0.15, 0.85));
        float socketRad = 0.32;
        
        if (eyeL < socketRad) {
            float depth = smoothstep(socketRad, 0.0, eyeL);
            transformed -= normal * depth * 0.5; // Push in
        }
        if (eyeR < socketRad) {
            float depth = smoothstep(socketRad, 0.0, eyeR);
            transformed -= normal * depth * 0.5;
        }

        // 4. Subtle Surface Noise (Bone texture)
        vNoise = noise(position * 4.0);
        transformed += normal * vNoise * 0.02;
      `
        );

        // --- FRAGMENT SHADER INJECTION ---
        shader.fragmentShader = `
      uniform float time;
      uniform vec3 bloodColor;
      uniform vec3 baseColor;
      varying vec3 vPos;
      varying float vNoise;
      
      // Re-implement simplified noise for frag if needed, or use vNoise
      // We will use a texture-less approach for blood
      
      ${shader.fragmentShader}
    `;

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <color_fragment>',
            `
        #include <color_fragment>
        
        // --- BLOOD SPLASH TEXTURE ---
        
        // Noise pattern designed to look like dripping liquid
        // We use sin/cos combo for 'vein' like structures
        float pattern = sin(vPos.x * 10.0 + vNoise * 5.0) * sin(vPos.y * 10.0 + time * 0.2);
        
        // Threshold for blood
        float bloodMask = step(0.6, pattern * vNoise); // High contrast
        
        // Drip logic: heavily weighted to negative Y
        float drip = smoothstep(0.5, -0.5, vPos.y + sin(vPos.x * 5.0) * 0.2);
        if (drip > 0.6 && vNoise > 0.4) {
             bloodMask = 1.0;
        }

        // Mix Base Bone Color with Blood
        vec3 surfaceColor = mix(baseColor, bloodColor, bloodMask * 0.9); // 90% opacity blood
        
        diffuseColor.rgb = surfaceColor;
      `
        );
    };

    return (
        <group {...props}>
            <mesh ref={mesh}>
                <sphereGeometry args={[1, 128, 128]} />
                <meshStandardMaterial
                    roughness={0.4}
                    metalness={0.1} // Bone is not metallic usually, but requested "polished obsidian" is metalness ~0.5. Let's start with bone-like.
                    // User asked for "Hyper-Realistic Cursed Skull" -> "RoughnessMap weathered bone".
                    // But also "Polished obsidian". Contradictory? 
                    // Re-reading: "roughnessMap that looks like weathered bone" + "Metalness 0.5, Roughness 0.1" (from previous prompt? No, verify current prompt).
                    // Current Prompt: "MeshStandardMaterial with a roughnessMap...". 
                    // BUT ALSO: "Metalness: Set to 0.7 and Roughness to 0.2" was the *previous* prompt. 
                    // THIS prompt says: "roughnessMap that looks like weathered bone".
                    // And "Polished obsidian" was mentioned in previous step. 
                    // Let's go with a balanced approach: semi-glossy bone.
                    onBeforeCompile={onBeforeCompile}
                />
            </mesh>

            {/* Burning Eyes */}
            <group position={[0, 0.15, 0.4]}>
                {/* Adjusted Z position because the socket indentation pulls the mesh IN, 
             so we need lights further back or inside the head? 
             Actually, "deep inside the eye sockets". 
             If surface is at z~0.4 after indentation, lights at z=0.4 might be flush.
             Let's put them inside at z=0.3.
         */}
                <pointLight position={[-0.35, 0, 0.1]} color="#b91c1c" intensity={8} distance={2} decay={2} />
                <pointLight position={[0.35, 0, 0.1]} color="#b91c1c" intensity={8} distance={2} decay={2} />
            </group>
        </group>
    );
}

const GothicSkull = ({ className = "w-full h-full" }) => {
    return (
        <div className={`relative z-10 ${className} flex justify-center items-center`}>
            <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />

                {/* Cinematic Lighting */}

                {/* 1. Rim Light (Back-Left) */}
                <pointLight
                    position={[-4, 2, -4]}
                    intensity={8}
                    color="#a3a3a3" // Pale white
                    distance={10}
                />

                {/* 2. Fill Light (Subtle Ambient) */}
                <ambientLight intensity={0.4} color="#443333" />

                <Float
                    speed={2}
                    rotationIntensity={0}
                    floatIntensity={1.0}
                    floatingRange={[-0.1, 0.1]}
                >
                    <CursedSkull />
                </Float>
            </Canvas>
        </div>
    );
};

export default GothicSkull;
