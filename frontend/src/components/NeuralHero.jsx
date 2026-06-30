import { Canvas } from '@react-three/fiber'
import { OrbitControls, Points, PointMaterial, Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useIsMobile } from '../hooks/useIsMobile'

function NeuralCore() {
  const coreRef = useRef()
  const shellRef = useRef()

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15
    }
    if (shellRef.current) {
      shellRef.current.rotation.y -= delta * 0.08
      shellRef.current.rotation.x += delta * 0.05
    }
  })

  return (
    <group>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.3, 2]} />
        <meshStandardMaterial
          color="#ff2b45"
          emissive="#ff2b45"
          emissiveIntensity={2.5}
          roughness={0.3}
          metalness={0.4}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshBasicMaterial color="#ff4259" wireframe transparent opacity={0.5} toneMapped={false} />
      </mesh>

      <pointLight color="#ff2b45" intensity={3} distance={6} />
    </group>
  )
}

function ParticleField() {
  const pointsRef = useRef()

  const positions = useMemo(() => {
    const count = 800
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 2.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = radius * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03
      pointsRef.current.rotation.x += delta * 0.01
    }
  })

  return (
    <group ref={pointsRef}>
      <Points positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#ff6b7d"
          size={0.025}
          sizeAttenuation
          depthWrite={false}
          toneMapped={false}
          opacity={0.7}
        />
      </Points>
    </group>
  )
}

const ORBIT_RADIUS = 3.6
const orbitingFeatures = [
  { label: 'Resume Analysis', angle: 0, y: 1.6 },
  { label: 'AI Interview', angle: Math.PI / 2, y: -1.3 },
  { label: 'Candidate Ranking', angle: Math.PI, y: 1.4 },
  { label: 'Hiring Analytics', angle: (Math.PI * 3) / 2, y: -1.6 },
].map((f) => ({
  label: f.label,
  position: [Math.cos(f.angle) * ORBIT_RADIUS, f.y, Math.sin(f.angle) * ORBIT_RADIUS],
}))

function OrbitingCards() {
  return (
    <>
      {orbitingFeatures.map((feature) => (
        <Html
          key={feature.label}
          position={feature.position}
          center
          occlude={false}
          zIndexRange={[10, 0]}
        >
          <div className="three-d-card">{feature.label}</div>
        </Html>
      ))}
    </>
  )
}

function StaticFallback() {
  return (
    <div className="neural-hero-fallback">
      <div className="neural-hero-fallback-glow" />
      <div className="neural-hero-fallback-cards">
        {orbitingFeatures.map((feature) => (
          <span key={feature.label} className="three-d-card">
            {feature.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function NeuralHero() {
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useIsMobile()

  // Skip the entire WebGL pipeline for reduced-motion or mobile —
  // not just pausing the animation, genuinely not mounting Canvas at all,
  // so there's no render loop running in the background either way.
  if (prefersReducedMotion || isMobile) {
    return <StaticFallback />
  }

  return (
    <div className="neural-hero-canvas">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} color="#ffffff" intensity={0.5} />
        <NeuralCore />
        <ParticleField />
        <OrbitingCards />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} />
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default NeuralHero