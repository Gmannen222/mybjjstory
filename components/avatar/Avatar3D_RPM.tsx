'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * PoC 3: Ready Player Me concept demo
 * Shows what RPM avatars would look like — uses a placeholder 3D model
 * since we can't embed RPM without an API key in a PoC
 */

// Stylized placeholder that represents what an RPM avatar would look like
function RPMPlaceholder() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.2
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.02
  })

  // More realistic proportions (not chibi)
  return (
    <group ref={groupRef}>
      {/* Head — slightly elongated sphere for realistic shape */}
      <group position={[0, 1.62, 0]}>
        <mesh>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial color="#D4A574" roughness={0.5} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.23, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color="#2C1810" roughness={0.8} />
        </mesh>
        {/* Eyes — more detailed */}
        {[-1, 1].map(side => (
          <group key={side} position={[side * 0.075, 0.02, 0.18]}>
            <mesh>
              <sphereGeometry args={[0.028, 16, 16]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <sphereGeometry args={[0.015, 16, 16]} />
              <meshStandardMaterial color="#4A7CB5" />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <sphereGeometry args={[0.008, 16, 16]} />
              <meshStandardMaterial color="#111" />
            </mesh>
          </group>
        ))}
        {/* Nose */}
        <mesh position={[0, -0.04, 0.2]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#c9967a" roughness={0.5} />
        </mesh>
        {/* Mouth */}
        <mesh position={[0, -0.1, 0.18]} rotation={[0.15, 0, 0]}>
          <torusGeometry args={[0.03, 0.005, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#b5736a" />
        </mesh>
        {/* Ears */}
        {[-1, 1].map(side => (
          <mesh key={`ear${side}`} position={[side * 0.21, -0.02, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#D4A574" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Neck */}
      <mesh position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.08, 12]} />
        <meshStandardMaterial color="#D4A574" roughness={0.5} />
      </mesh>

      {/* Torso — gi top */}
      <mesh position={[0, 1.1, 0]}>
        <capsuleGeometry args={[0.22, 0.4, 8, 16]} />
        <meshStandardMaterial color="#f0ede6" roughness={0.85} />
      </mesh>

      {/* Gi collar detail */}
      <mesh position={[0, 1.32, 0.15]}>
        <boxGeometry args={[0.18, 0.06, 0.04]} />
        <meshStandardMaterial color="#e8e4da" roughness={0.9} />
      </mesh>

      {/* Belt */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.04, 16, 1, true]} />
        <meshStandardMaterial color="#1a5fa8" roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.85, 0.22]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#1a5fa8" roughness={0.3} />
      </mesh>

      {/* Arms */}
      {[-1, 1].map(side => (
        <group key={`arm${side}`}>
          <mesh position={[side * 0.28, 1.18, 0]} rotation={[0, 0, side * 0.12]}>
            <capsuleGeometry args={[0.06, 0.22, 8, 12]} />
            <meshStandardMaterial color="#f0ede6" roughness={0.85} />
          </mesh>
          <mesh position={[side * 0.32, 0.92, 0.02]} rotation={[0.15, 0, side * 0.08]}>
            <capsuleGeometry args={[0.045, 0.2, 8, 12]} />
            <meshStandardMaterial color="#D4A574" roughness={0.5} />
          </mesh>
          <mesh position={[side * 0.33, 0.74, 0.04]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial color="#D4A574" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Legs — gi pants */}
      {[-1, 1].map(side => (
        <group key={`leg${side}`}>
          <mesh position={[side * 0.1, 0.55, 0]}>
            <capsuleGeometry args={[0.08, 0.3, 8, 12]} />
            <meshStandardMaterial color="#f0ede6" roughness={0.85} />
          </mesh>
          <mesh position={[side * 0.1, 0.2, 0]}>
            <capsuleGeometry args={[0.065, 0.28, 8, 12]} />
            <meshStandardMaterial color="#f0ede6" roughness={0.85} />
          </mesh>
          {/* Feet */}
          <mesh position={[side * 0.1, 0.02, 0.03]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.07, 0.04, 0.12]} />
            <meshStandardMaterial color="#D4A574" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function Avatar3D_RPM({ size = 300 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size * 1.2 }} className="rounded-xl overflow-hidden relative">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center bg-surface">
          <div className="text-sm text-muted animate-pulse">Laster 3D...</div>
        </div>
      }>
        <Canvas
          camera={{ position: [0, 1.1, 2.8], fov: 30 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#aaaaff" />
          <spotLight position={[0, 4, 2]} intensity={0.5} angle={0.3} penumbra={0.8} />

          <RPMPlaceholder />

          <ContactShadows
            position={[0, -0.02, 0]}
            opacity={0.5}
            scale={2}
            blur={2.5}
            far={1.5}
          />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            target={[0, 1, 0]}
            autoRotate
            autoRotateSpeed={1}
          />

          <Environment preset="city" />
        </Canvas>
      </Suspense>

      {/* RPM badge overlay */}
      <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center">
        <span className="text-[10px] text-white/70">Ready Player Me — realistiske proporsjoner</span>
      </div>
    </div>
  )
}
