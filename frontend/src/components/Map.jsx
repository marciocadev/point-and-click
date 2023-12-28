export const Map = () => {
  return (
    <>
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.001}
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
    </>
  )
}