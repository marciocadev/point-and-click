import { ContactShadows, Environment, OrbitControls, useCursor } from "@react-three/drei"
import { Character } from "./Character"
import { useAtom } from "jotai"
import { charactersAtom } from "./SocketManager"
import { useSocket } from "./SocketManager"
import { useState } from "react"
import * as THREE from "three";

export const Experience = () => {

  const { sendMessage, lastMessage, readyState } = useSocket()
  const [characters] = useAtom(charactersAtom)
  const [onFloor, setOnFloor] = useState(false)
  useCursor(onFloor)

  return (
    <>
      <Environment preset="sunset" />
      <directionalLight
        position={[25, 18, -25]}
        intensity={0.3}
        castShadow
        shadow-camera-near={0}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.0001}
      />
      <ContactShadows blur={2} />
      <OrbitControls />
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.001}
        onClick={(e) =>
          sendMessage(
            JSON.stringify({
              type: "move",
              data: [e.point.x, 0, e.point.z]
            })
          )}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {
        characters.map((character) => (
          <Character
            key={character.userid}
            color={character.color}
            position={
              new THREE.Vector3(
                character.position[0],
                character.position[1],
                character.position[2]
              )
            } />
        ))
      }
    </>
  )
}