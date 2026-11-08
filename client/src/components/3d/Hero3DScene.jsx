import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { OceanMesh, CruisingYacht, FloatingCompass, OceanParticles } from './OceanScene';
import { Globe3D } from './Globe3D';
import { Compass, Globe, Waves, Sun, Moon, Sunset } from 'lucide-react';

export function Hero3DScene() {
  const [viewMode, setViewMode] = useState('ocean'); // 'ocean' | 'globe'
  const [timeOfDay, setTimeOfDay] = useState('noon'); // 'noon' | 'sunset' | 'night'

  // Lighting config based on time of day
  const lightConfig = {
    noon: {
      ambient: '#ffffff',
      ambientIntensity: 0.6,
      sunColor: '#fffbeb',
      sunIntensity: 1.8,
      sunPos: [10, 15, 10],
      skyBg: 'from-ocean-950 via-ocean-900 to-ocean-950'
    },
    sunset: {
      ambient: '#fdba74',
      ambientIntensity: 0.45,
      sunColor: '#f97316',
      sunIntensity: 2.2,
      sunPos: [15, 6, 8],
      skyBg: 'from-[#1a0c24] via-[#3b122d] to-[#0a142e]'
    },
    night: {
      ambient: '#1e293b',
      ambientIntensity: 0.25,
      sunColor: '#38bdf8',
      sunIntensity: 0.8,
      sunPos: [5, 12, -8],
      skyBg: 'from-[#02050a] via-[#051120] to-[#040914]'
    }
  }[timeOfDay];

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{
          position: viewMode === 'ocean' ? [0, 2.8, 6.5] : [0, 0, 7.2],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Ambient Light */}
          <ambientLight color={lightConfig.ambient} intensity={lightConfig.ambientIntensity} />

          {/* Directional Sun / Moon Light */}
          <directionalLight
            position={lightConfig.sunPos}
            color={lightConfig.sunColor}
            intensity={lightConfig.sunIntensity}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* Subtle Hemisphere Fill Light */}
          <hemisphereLight
            skyColor={lightConfig.sunColor}
            groundColor="#061325"
            intensity={0.4}
          />

          {/* Scene Switch: Ocean vs Globe */}
          {viewMode === 'ocean' ? (
            <group>
              <OceanMesh timeOfDay={timeOfDay} />
              <CruisingYacht />
              <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
                <FloatingCompass />
              </Float>
              <OceanParticles count={150} />
            </group>
          ) : (
            <group position={[0, 0, 0]}>
              <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <Globe3D />
              </Float>
              <OceanParticles count={180} />
            </group>
          )}

          {/* Orbit Controls with soft damping */}
          <OrbitControls
            enableZoom={true}
            minDistance={4}
            maxDistance={12}
            maxPolarAngle={viewMode === 'ocean' ? Math.PI / 2.1 : Math.PI}
            minPolarAngle={viewMode === 'ocean' ? 0.3 : 0}
            dampingFactor={0.05}
            enablePan={false}
          />
        </Suspense>
      </Canvas>

      {/* Floating 3D Controls Bar */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-wrap items-center gap-2 p-1.5 rounded-2xl glass-panel shadow-2xl border border-white/10">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-ocean-900/80 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setViewMode('ocean')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'ocean'
                ? 'bg-turquoise text-ocean-950 shadow-md font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>3D Ocean</span>
          </button>
          <button
            onClick={() => setViewMode('globe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'globe'
                ? 'bg-turquoise text-ocean-950 shadow-md font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Globe</span>
          </button>
        </div>

        {/* Time of Day Lighting Toggle */}
        <div className="flex items-center bg-ocean-900/80 p-1 rounded-xl border border-white/5">
          <button
            title="Coastal Day"
            onClick={() => setTimeOfDay('noon')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              timeOfDay === 'noon' ? 'bg-gold text-ocean-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            title="Golden Sunset"
            onClick={() => setTimeOfDay('sunset')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              timeOfDay === 'sunset' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sunset className="w-3.5 h-3.5" />
          </button>
          <button
            title="Starlit Night"
            onClick={() => setTimeOfDay('night')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              timeOfDay === 'night' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subtle Hint */}
      <div className="absolute bottom-6 left-6 z-10 hidden sm:flex items-center gap-2 text-[11px] text-slate-400/80 backdrop-blur-md px-3 py-1.5 rounded-full bg-ocean-950/60 border border-white/5">
        <Compass className="w-3.5 h-3.5 text-turquoise animate-spin-slow" />
        <span>Drag to rotate • Scroll to zoom</span>
      </div>
    </div>
  );
}

