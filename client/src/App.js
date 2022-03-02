import React, { useRef, useState, useEffect} from 'react'
import { Canvas, useFrame, Group} from '@react-three/fiber'
import { Billboard, OrbitControls, Text, Sky, Environment, PerspectiveCamera} from '@react-three/drei'
import { io } from 'socket.io-client'

const MIN_HEIGHT = 0;
const SPEED = 4;
const socket = io("http://localhost:3001")
const otherPlayers = {}

socket.on("pl",(e) => {
  otherPlayers = e;
})

socket.on("l",(e) => {
  delete otherPlayers[e];
})

socket.on('kc',(e) => {
  otherPlayers[e[0]]["keys"] = e[1][0]
  otherPlayers[e[0]]["position"] = e[1][1]
})



function Others(props) {
  //Get three.js object reference
  const ref = useRef();
  const [keys, setKeys] = useState([false,false,false,false]);
  const [name, setName] = useState('');
  const [pCount, setPlayers] = useState(0);
  const keyMap = {'w':0,'s':1,'a':2,'d':3}
  //. Only used once
  useEffect(() => {
    socket.on("pl",(e) => {
      otherPlayers = e;
      setPlayers(Object.keys(e).length);
    })

    socket.on("j",(e) => {
      otherPlayers[e[0]] = e[1]
      setPlayers(pCount++);
    })
  }, [])

  useFrame((state, delta) => {
    const normal = (keys[0] + keys[1] + keys[2] + keys[3]) > 1 ? 0.707 : 1
    //posy ref.current.position.y += 0.1 * (keys[0] - (ref.current.position.y > MIN_HEIGHT ? keys[1] : 0)) * normal
    ref.current.position.z += 0.1 * (keys[1] - keys[0]) * normal
    ref.current.position.x += 0.1 * (keys[3] - keys[2]) * normal
  })

  const handleB = (e) => {
    if (e.key in keyMap) {
      const newKeys = [...keys]
      newKeys[keyMap[e.key]] = true;
      setKeys(newKeys);
    }
  }

  const handleUp = (e) => {
    if (e.key in keyMap) {
      const newKeys = [...keys]
      newKeys[keyMap[e.key]] = false;
      setKeys(newKeys);
    }
  }
  return (
    <mesh
      {...props}
      ref = {ref}
      scale = {1}>
      
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={[props.position[0],props.position[1] + 1,props.position[2]]}>
        <Text fontSize={0.5} outlineWidth={'1%'} outlineColor="#000000" outlineOpacity={1}>
            {name}
        </Text>
      </Billboard>
    </mesh>
  )
}

function Player(props) {
  //Get three.js object reference
  const ref = useRef();
  const [keys, setKeys] = useState([false,false,false,false]);
  const [name, setName] = useState('');
  const keyMap = {'w':0,'s':1,'a':2,'d':3}
  //Prompt for your name. Only used once
  useEffect(() => {
    const val = prompt("Name?")
    setName(val != null ? val : "LOSER");
    socket.emit("nameSet",name)
  }, [])

  useFrame((state, delta) => {
    const normal = (keys[0] + keys[1] + keys[2] + keys[3]) > 1 ? 0.707 : 1
    //posy ref.current.position.y += 0.1 * (keys[0] - (ref.current.position.y > MIN_HEIGHT ? keys[1] : 0)) * normal
    ref.current.position.z += delta * SPEED * (keys[1] - keys[0]) * normal
    ref.current.position.x += delta * SPEED * (keys[3] - keys[2]) * normal
  })

  onkeydown = (e) => {
    if (e.key in keyMap) {
      const newKeys = [...keys]
      newKeys[keyMap[e.key]] = true;
      setKeys(newKeys);
      socket.emit("kc",newKeys,ref.current.position)
    }
  }

  onkeyup = (e) => {
    if (e.key in keyMap) {
      const newKeys = [...keys]
      newKeys[keyMap[e.key]] = false;
      setKeys(newKeys);
      socket.emit("kc",newKeys,ref.current.position)
    }
  }
  return (
    <mesh
      {...props}
      ref = {ref}
      scale = {1}>
      
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={[props.position[0],props.position[1] + 1,props.position[2]]}>
        <Text fontSize={0.5} outlineWidth={'1%'} outlineColor="#000000" outlineOpacity={1}>
            {name}
        </Text>
      </Billboard>
      <PerspectiveCamera makeDefault={true} position={[0,15,2]} rotation={[-1.4,0,0]}>
      </PerspectiveCamera>
    </mesh>
  )
}

function World(props) {
  
  return (
    <group>
      <Environment
        background={true} // Whether to affect scene.background
        preset={"apartment"} // Preset string (overrides files and path)
      />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <mesh position={[0,-0.6,0]}>
      <boxGeometry args={[30, 0.2, 30]} />
      <meshStandardMaterial color="gray" />
      </mesh>
    </group>
  )
}

export default function GameView() {
  useEffect(() => {
    const socket = io('http://localhost:3001');
    socket.on("FromAPI", data => {
      console.log("data");
    });

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();
    //
  }, []);
  return (
    <Canvas camera={{ fov: 70, near: 0.1, far: 100, position: [0, 0, 5] }} >
      <World/>
      <Player position={[0,0,0]}/>
    </Canvas>
  ) 
}
