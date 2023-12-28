import { Canvas } from "@react-three/fiber";
import { BrowserView, MobileView } from 'react-device-detect';
import { KeyboardControls, SoftShadows } from "@react-three/drei";
import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { Experience } from "./components/Experience";
import { SocketManager } from "./components/SocketManager";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "back", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "fire", keys: ["Space"] },
]

export const App = () => {
  return (
    <>
      <SocketManager>
        <Canvas
          shadows
          camera={{ position: [0, 30, 0], fov: 30, near: 2 }}
          dpr={[1, 1.5]} // optimization to increase performance on retina/4k devices
        >
          <color attach="background" args={["#242424"]} />
          <SoftShadows size={42} />
          {/* <Suspense>
            <Physics debug> */}
          <Experience />
          {/* </Physics>
          </Suspense> */}
        </Canvas>
      </SocketManager>
    </>
  )
}
export default App;