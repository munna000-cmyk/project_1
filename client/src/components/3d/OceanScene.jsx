import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Realistic 3D Animated Ocean Mesh
export function OceanMesh({ timeOfDay = 'noon' }) {
  const meshRef = useRef();
  const geomRef = useRef();

  // Color schemes based on time of day
  const colors = useMemo(() => {
    switch (timeOfDay) {
      case 'sunset':
        return {
          deep: new THREE.Color('#0a1d38'),
          surface: new THREE.Color('#d97706'),
          highlight: new THREE.Color('#fbbf24'),
          roughness: 0.15,
          metalness: 0.8
        };
      case 'night':
        return {
          deep: new THREE.Color('#030811'),
          surface: new THREE.Color('#0c2a4d'),
          highlight: new THREE.Color('#38bdf8'),
          roughness: 0.1,
          metalness: 0.9
        };
      case 'noon':
      default:
        return {
          deep: new THREE.Color('#041d3b'),
          surface: new THREE.Color('#0284c7'),
          highlight: new THREE.Color('#22d3ee'),
          roughness: 0.18,
          metalness: 0.75
        };
    }
  }, [timeOfDay]);

  // Create high-subdivision ocean plane
  const [geometry, initialPositions] = useMemo(() => {
    const geo = new THREE.PlaneGeometry(60, 60, 100, 100);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position.array.slice();
    return [geo, pos];
  }, []);

  // Animate waves with complex undulating harmonics
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 1.2;
    const positions = meshRef.current.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const u = initialPositions[i];
      const w = initialPositions[i + 2];

      // Multi-frequency wave formula
      const wave1 = Math.sin(u * 0.35 + t * 1.1) * Math.cos(w * 0.35 + t * 0.9) * 0.7;
      const wave2 = Math.sin(u * 0.7 - t * 1.5 + w * 0.3) * 0.35;
      const wave3 = Math.cos((u + w) * 0.2 + t * 0.8) * 0.25;

      positions[i + 1] = wave1 + wave2 + wave3;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, -1.2, 0]} receiveShadow>
      <meshStandardMaterial
        color={colors.deep}
        roughness={colors.roughness}
        metalness={colors.metalness}
        wireframe={false}
        flatShading={false}
      />
    </mesh>
  );
}

// 3D Luxury Yacht cruising the water
export function CruisingYacht() {
  const boatRef = useRef();

  useFrame(({ clock }) => {
    if (!boatRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle bobbing and pitch/roll motion
    boatRef.current.position.y = -0.7 + Math.sin(t * 1.6) * 0.12;
    boatRef.current.rotation.z = Math.sin(t * 1.2) * 0.05;
    boatRef.current.rotation.x = Math.cos(t * 1.4) * 0.04;
    boatRef.current.position.x = Math.sin(t * 0.3) * 2 - 1.5;
  });

  return (
    <group ref={boatRef} position={[-2, -0.7, 2]} scale={[0.85, 0.85, 0.85]}>
      {/* Yacht Hull */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.2, 3.2, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.4} roughness={0.2} />
      </mesh>
      {/* Wooden Deck */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.9, 0.15, 3]} />
        <meshStandardMaterial color="#b45309" roughness={0.5} />
      </mesh>
      {/* Cabin & Flybridge */}
      <mesh position={[0, 0.6, -0.3]}>
        <boxGeometry args={[0.7, 0.5, 1.4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>
      {/* Tinted Glass Windshield */}
      <mesh position={[0, 0.65, 0.45]}>
        <boxGeometry args={[0.68, 0.3, 0.3]} />
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.7} roughness={0.1} />
      </mesh>
      {/* Gold Radar Mast */}
      <mesh position={[0, 1.1, -0.4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 3D Floating Navigational Marine Compass
export function FloatingCompass() {
  const compassRef = useRef();

  useFrame(({ clock }) => {
    if (!compassRef.current) return;
    const t = clock.getElapsedTime();
    compassRef.current.rotation.y = t * 0.4;
    compassRef.current.position.y = 1.2 + Math.sin(t * 1.5) * 0.2;
  });

  return (
    <group ref={compassRef} position={[3.2, 1.2, 1]} scale={[0.55, 0.55, 0.55]}>
      {/* Outer Ring */}
      <mesh>
        <torusGeometry args={[1.2, 0.1, 16, 64]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Inner Compass Dial Plate */}
      <mesh>
        <cylinderGeometry args={[1.1, 1.1, 0.05, 32]} />
        <meshStandardMaterial color="#061325" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* North Arrow Needle */}
      <mesh position={[0, 0.06, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 0.8, 4]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} />
      </mesh>
      {/* South Arrow Needle */}
      <mesh position={[0, 0.06, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 0.8, 4]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.3} />
      </mesh>
      {/* Center Pivot Gem */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.1} />
      </mesh>
    </group>
  );
}

// Atmospheric Sea Mist & Starlight Particles
export function OceanParticles({ count = 180 }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color('#38bdf8');
    const c2 = new THREE.Color('#fbbf24');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = Math.random() * 6 - 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const mixed = Math.random() > 0.6 ? c2 : c1;
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime() * 0.15;
    const pos = pointsRef.current.geometry.attributes.position.array;
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] += Math.sin(t + i) * 0.005;
      if (pos[i] > 6) pos[i] = 0;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.07} vertexColors transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

