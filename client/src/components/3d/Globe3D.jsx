import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Convert Lat / Lng to 3D Cartesian coordinates on sphere
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function Globe3D({ isHovered = false }) {
  const globeGroupRef = useRef();
  const earthMeshRef = useRef();
  const pinRef = useRef();
  const [showTooltip, setShowTooltip] = useState(true);

  const radius = 2.4;

  // Exact coordinates of Visakhapatnam, Andhra Pradesh, India
  const vizagCoords = useMemo(() => {
    return latLngToVector3(17.6868, 83.2185, radius);
  }, [radius]);

  // Procedural canvas texture for continents with deep navy oceans and turquoise landmasses
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep ocean background
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#061325');
    oceanGrad.addColorStop(0.5, '#0a1d38');
    oceanGrad.addColorStop(1, '#040d1a');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle longitude & latitude grid lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 128) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Stylized continent outlines (India, Asia, Europe, Africa, Americas)
    ctx.fillStyle = '#0e3a66';
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;

    // Helper to draw continent blob
    const drawLand = (x, y, w, h, radius) => {
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    };

    // Indian Subcontinent (approx center-east)
    const indiaX = (canvas.width * (83.2 + 180)) / 360;
    const indiaY = (canvas.height * (90 - 20)) / 180;
    ctx.fillStyle = '#164e63';
    ctx.beginPath();
    ctx.moveTo(indiaX - 40, indiaY - 50);
    ctx.lineTo(indiaX + 50, indiaY - 40);
    ctx.lineTo(indiaX + 15, indiaY + 70); // Southern tip Kanyakumari
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Asia landmass
    drawLand(indiaX + 60, indiaY - 60, 220, 120);
    // Europe
    drawLand(indiaX - 220, indiaY - 90, 120, 70);
    // Africa
    drawLand(indiaX - 180, indiaY + 40, 110, 130);
    // Southeast Asia / Australia
    drawLand(indiaX + 180, indiaY + 120, 90, 70);
    // Americas
    drawLand(indiaX - 520, indiaY - 80, 140, 100);
    drawLand(indiaX - 460, indiaY + 110, 100, 140);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (globeGroupRef.current) {
      // Gentle continuous rotation
      globeGroupRef.current.rotation.y = t * 0.12;
    }
    if (pinRef.current) {
      const pulse = 1 + Math.sin(t * 4) * 0.25;
      pinRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={globeGroupRef} position={[0, 0, 0]}>
      {/* Earth Sphere */}
      <mesh ref={earthMeshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.4}
          metalness={0.3}
          emissive="#061e38"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Atmospheric Corona Glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.05, 32, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Visakhapatnam 3D Pulsing Pin & Golden Beacon */}
      <group position={vizagCoords}>
        {/* Golden Base Ring */}
        <mesh>
          <ringGeometry args={[0.04, 0.12, 16]} />
          <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} />
        </mesh>

        {/* Pulsing Core Sphere */}
        <mesh ref={pinRef} position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>

        {/* Vertical Light Beacon Beam */}
        <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.04, 0.7, 8]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
        </mesh>

        {/* Interactive 3D HTML Tooltip */}
        <Html
          position={[0, 0.2, 0.4]}
          center
          distanceFactor={6}
          style={{
            pointerEvents: 'auto',
            userSelect: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          <div
            onClick={() => setShowTooltip(!showTooltip)}
            className="cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ocean-950/90 border border-turquoise shadow-lg backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-ping"></span>
              <span className="text-xs font-semibold text-white tracking-wide">
                Visakhapatnam (Vizag)
              </span>
              <span className="text-[10px] text-turquoise font-mono">17.7°N, 83.2°E</span>
            </div>
            {showTooltip && (
              <div className="mt-1 px-2.5 py-1 text-[11px] text-slate-300 rounded-md bg-ocean-900/95 border border-ocean-700 shadow-xl max-w-xs text-center backdrop-blur">
                🌊 The Jewel on the Bay of Bengal Coast
              </div>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}

