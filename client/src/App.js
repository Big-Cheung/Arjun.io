import React, { useRef, useState} from 'react'
import { Canvas, useFrame} from '@react-three/fiber'
import { Billboard, OrbitControls, Text } from '@react-three/drei'
import { MathUtils } from 'three'


function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame

  useFrame((state, delta) => (ref.current.position.x = MathUtils.lerp(ref.current.position.x, clicked ? 10 : -10, 0.1)))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => {
        click(!clicked);
        }}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={[0, 1.05, 0]}>
        <Text fontSize={1} outlineWidth={'1%'} outlineColor="#000000" outlineOpacity={1}>
            {clicked ? "Big" : "Small"}
        </Text>
      </Billboard>
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ fov: 70, near: 0.1, far: 100, position: [0, 0, 5] }}>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  ) 
}
