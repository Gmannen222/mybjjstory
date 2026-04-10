'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { AvatarConfig } from './AvatarSVG'
import { DEFAULT_AVATAR } from './AvatarSVG'

// Belt colors
const BELT_COLORS: Record<string, string> = {
  white: '#f5f5f0',
  blue: '#1a5fa8',
  purple: '#7b2d8e',
  brown: '#6b3a2a',
  black: '#1a1a1a',
}

// Simple low-poly BJJ character
function BJJCharacter({ config }: { config: AvatarConfig }) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)

  // Gentle idle animation
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.15
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.03
  })

  const skin = config.skinTone || '#D4A574'
  const isGi = config.outfit?.startsWith('gi')
  const outfitColor = config.outfit === 'gi_white' ? '#f0ede6' : config.outfit === 'gi_blue' ? '#2a4d7a' : config.outfit === 'gi_black' ? '#2a2a2a' : config.outfit === 'nogi_dark' ? '#1a1a2e' : '#222244'
  const beltColor = BELT_COLORS[config.beltRank || 'white'] || '#f5f5f0'
  const hairColor = config.hairColor || '#2C1810'
  const eyeColor = config.eyeColor || '#4A3728'

  // Body dimensions based on bodyType
  const bodyWidth = config.bodyType === 'heavy' ? 0.55 : config.bodyType === 'athletic' ? 0.48 : config.bodyType === 'slim' ? 0.38 : 0.43
  const bodyDepth = config.bodyType === 'heavy' ? 0.35 : config.bodyType === 'athletic' ? 0.28 : 0.22

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.05 : 1}
    >
      {/* HEAD */}
      <group position={[0, 1.55, 0]}>
        {/* Skull */}
        <mesh>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial color={skin} roughness={0.6} />
        </mesh>

        {/* Hair */}
        {config.hairStyle !== 'bald' && (
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[
              config.hairStyle === 'buzz' ? 0.33 :
              config.hairStyle === 'mohawk' ? 0.28 : 0.34,
              32, 32,
              0, Math.PI * 2,
              0,
              config.hairStyle === 'short' ? Math.PI * 0.55 :
              config.hairStyle === 'buzz' ? Math.PI * 0.5 :
              config.hairStyle === 'mohawk' ? Math.PI * 0.45 :
              Math.PI * 0.6
            ]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
        )}

        {/* Mohawk ridge */}
        {config.hairStyle === 'mohawk' && (
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.06, 0.2, 0.3]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
        )}

        {/* Long hair / ponytail back */}
        {(config.hairStyle === 'long' || config.hairStyle === 'ponytail') && (
          <mesh position={[0, -0.1, -0.18]} rotation={[0.3, 0, 0]}>
            <capsuleGeometry args={[0.12, config.hairStyle === 'long' ? 0.5 : 0.3, 8, 16]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
        )}

        {/* Bun */}
        {config.hairStyle === 'bun' && (
          <mesh position={[0, 0.25, -0.2]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
        )}

        {/* Eyes */}
        <group position={[0, 0.02, 0.26]}>
          {/* Left eye */}
          <group position={[-0.1, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
              <sphereGeometry args={[0.025, 16, 16]} />
              <meshStandardMaterial color={eyeColor} />
            </mesh>
            <mesh position={[0, 0, 0.04]}>
              <sphereGeometry args={[0.012, 16, 16]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
            {/* Highlight */}
            <mesh position={[0.01, 0.015, 0.045]}>
              <sphereGeometry args={[0.006, 8, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
            </mesh>
          </group>
          {/* Right eye */}
          <group position={[0.1, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.03]}>
              <sphereGeometry args={[0.025, 16, 16]} />
              <meshStandardMaterial color={eyeColor} />
            </mesh>
            <mesh position={[0, 0, 0.04]}>
              <sphereGeometry args={[0.012, 16, 16]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
            <mesh position={[0.01, 0.015, 0.045]}>
              <sphereGeometry args={[0.006, 8, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
            </mesh>
          </group>
        </group>

        {/* Nose */}
        <mesh position={[0, -0.06, 0.3]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color={skin} roughness={0.5} />
        </mesh>

        {/* Mouth - smile curve */}
        <mesh position={[0, -0.14, 0.27]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.04, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#c27a6a" />
        </mesh>

        {/* Ears */}
        {[-1, 1].map(side => (
          <mesh key={side} position={[side * 0.3, -0.02, 0]}>
            <sphereGeometry args={[config.earType === 'cauliflower' ? 0.06 : 0.045, 12, 12]} />
            <meshStandardMaterial
              color={config.earType === 'cauliflower' ? '#c9967a' : skin}
              roughness={config.earType === 'cauliflower' ? 0.9 : 0.6}
            />
          </mesh>
        ))}

        {/* Glasses */}
        {config.glasses && config.glasses !== 'none' && (
          <group position={[0, 0.02, 0.3]}>
            {[-1, 1].map(side => (
              <mesh key={side} position={[side * 0.1, 0, 0]} rotation={[0, 0, 0]}>
                <torusGeometry args={[0.05, 0.004, 8, config.glasses === 'round' ? 32 : 4]} />
                <meshStandardMaterial color="#333" metalness={0.8} />
              </mesh>
            ))}
            {/* Bridge */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.06, 0.004, 0.004]} />
              <meshStandardMaterial color="#333" metalness={0.8} />
            </mesh>
          </group>
        )}

        {/* Facial hair */}
        {config.facialHair && config.facialHair !== 'none' && (
          <mesh position={[0, -0.18, 0.2]}>
            <sphereGeometry args={[
              config.facialHair === 'full_beard' ? 0.2 :
              config.facialHair === 'short_beard' ? 0.15 :
              config.facialHair === 'goatee' ? 0.08 : 0.12,
              16, 16, 0, Math.PI * 2, Math.PI * 0.3, Math.PI * 0.5
            ]} />
            <meshStandardMaterial
              color={hairColor}
              roughness={0.9}
              transparent
              opacity={config.facialHair === 'stubble' ? 0.3 : 0.8}
            />
          </mesh>
        )}

        {/* Headband */}
        {config.headband && (
          <mesh position={[0, 0.18, 0]}>
            <torusGeometry args={[0.3, 0.025, 8, 32]} />
            <meshStandardMaterial color={config.academyColor || '#ef4444'} />
          </mesh>
        )}
      </group>

      {/* NECK */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.12, 16]} />
        <meshStandardMaterial color={skin} roughness={0.6} />
      </mesh>

      {/* TORSO */}
      <group position={[0, 0.85, 0]}>
        {/* Main body */}
        <RoundedBox args={[bodyWidth * 2, 0.7, bodyDepth * 2]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color={outfitColor} roughness={isGi ? 0.9 : 0.4} />
        </RoundedBox>

        {/* Gi lapel V-opening */}
        {isGi && (
          <mesh position={[0, 0.25, bodyDepth + 0.01]} rotation={[0, 0, 0]}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([
                  -0.12, 0.1, 0,
                  0.12, 0.1, 0,
                  0, -0.15, 0,
                ]), 3]}
              />
            </bufferGeometry>
            <meshStandardMaterial color={skin} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Gi collar */}
        {isGi && (
          <group position={[0, 0.3, bodyDepth * 0.5]}>
            <mesh position={[-0.08, 0, 0.06]} rotation={[0, 0, 0.15]}>
              <boxGeometry args={[0.08, 0.25, 0.03]} />
              <meshStandardMaterial color={outfitColor} roughness={1} />
            </mesh>
            <mesh position={[0.08, 0, 0.06]} rotation={[0, 0, -0.15]}>
              <boxGeometry args={[0.08, 0.25, 0.03]} />
              <meshStandardMaterial color={outfitColor} roughness={1} />
            </mesh>
          </group>
        )}

        {/* Belt */}
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[bodyWidth + 0.01, bodyWidth + 0.01, 0.06, 16, 1, true]} />
          <meshStandardMaterial color={beltColor} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Belt knot */}
        <mesh position={[0, -0.28, bodyDepth + 0.02]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color={beltColor} roughness={0.3} />
        </mesh>
      </group>

      {/* ARMS */}
      {[-1, 1].map(side => (
        <group key={`arm-${side}`}>
          {/* Upper arm */}
          <mesh position={[side * (bodyWidth + 0.08), 1.02, 0]} rotation={[0, 0, side * 0.15]}>
            <capsuleGeometry args={[0.07, 0.28, 8, 16]} />
            <meshStandardMaterial color={outfitColor} roughness={isGi ? 0.9 : 0.4} />
          </mesh>
          {/* Forearm */}
          <mesh position={[side * (bodyWidth + 0.14), 0.7, 0.04]} rotation={[0.2, 0, side * 0.1]}>
            <capsuleGeometry args={[0.055, 0.24, 8, 16]} />
            <meshStandardMaterial color={isGi ? outfitColor : skin} roughness={0.6} />
          </mesh>
          {/* Hand */}
          <mesh position={[side * (bodyWidth + 0.16), 0.48, 0.06]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color={skin} roughness={0.6} />
          </mesh>
          {/* Finger tape */}
          {config.fingerTape && (
            <mesh position={[side * (bodyWidth + 0.16), 0.45, 0.06]}>
              <torusGeometry args={[0.04, 0.008, 8, 16]} />
              <meshStandardMaterial color="#f5f5f0" />
            </mesh>
          )}
        </group>
      ))}

      {/* LEGS */}
      {[-1, 1].map(side => (
        <group key={`leg-${side}`}>
          {/* Upper leg */}
          <mesh position={[side * 0.15, 0.3, 0]}>
            <capsuleGeometry args={[isGi ? 0.09 : 0.08, 0.3, 8, 16]} />
            <meshStandardMaterial color={isGi ? outfitColor : (config.outfit === 'nogi_dark' ? '#1a1a2e' : '#222244')} roughness={isGi ? 0.9 : 0.4} />
          </mesh>
          {/* Lower leg */}
          <mesh position={[side * 0.15, -0.1, 0]}>
            <capsuleGeometry args={[isGi ? 0.08 : 0.06, 0.28, 8, 16]} />
            <meshStandardMaterial color={isGi ? outfitColor : skin} roughness={0.6} />
          </mesh>
          {/* Knee pads */}
          {config.kneePads && (
            <mesh position={[side * 0.15, 0.1, 0.06]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color="#333" roughness={0.4} />
            </mesh>
          )}
          {/* Foot */}
          <mesh position={[side * 0.15, -0.36, 0.04]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.09, 0.05, 0.14]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function Avatar3D_ThreeJS({ config = DEFAULT_AVATAR, size = 300 }: { config?: AvatarConfig; size?: number }) {
  return (
    <div style={{ width: size, height: size * 1.2 }} className="rounded-xl overflow-hidden">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center bg-surface">
          <div className="text-sm text-muted animate-pulse">Laster 3D...</div>
        </div>
      }>
        <Canvas
          camera={{ position: [0, 1, 3], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#8888ff" />

          <BJJCharacter config={config} />

          <ContactShadows
            position={[0, -0.4, 0]}
            opacity={0.4}
            scale={3}
            blur={2}
            far={2}
          />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            target={[0, 0.9, 0]}
            autoRotate
            autoRotateSpeed={1.5}
          />

          <Environment preset="studio" />
        </Canvas>
      </Suspense>
    </div>
  )
}
