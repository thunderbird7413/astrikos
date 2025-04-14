'use client';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import POIMarker from './POIMarker';
import { useRef } from 'react';
const Model = ({ url, onModelClick, onPOIClick, selectedPOI, pois }) => {
  const group = useRef();
  const { scene } = useGLTF(url || '');
  const { camera } = useThree();

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.001;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();

    const poiIntersect = e.intersections.find(i => i.object.userData?.isPOI);
    if (poiIntersect) {
      onPOIClick(poiIntersect.object.userData.poi);
      return;
    }

    if (e.distance > 0) {
      onModelClick(e.point);
    }
  };

  return (
    <group ref={group} onClick={handleClick}>
      <primitive object={scene} />
      {pois.map((poi) => (
        <POIMarker
          key={poi.id}
          position={[poi.position.x, poi.position.y, poi.position.z]}
          isSelected={selectedPOI?.id === poi.id}
          userData={{ poi, isPOI: true }}
          onClick={() => onPOIClick(poi)}
        />
      ))}
    </group>
  );
};

const ModelViewer = ({ modelUrl, pois, onModelClick, onPOIClick, selectedPOI }) => {
  if (!modelUrl) {
    return <p className="text-red-600">Error: Model URL not provided</p>;
  }

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Model
        url={modelUrl}
        onModelClick={onModelClick}
        pois={pois}
        onPOIClick={onPOIClick}
        selectedPOI={selectedPOI}
      />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
};

export default ModelViewer;
