'use client';
import { useRef } from 'react';

const POIMarker = ({ position, onClick, isSelected, userData }) => {
  const markerRef = useRef();

  return (
    <mesh
      position={position}
      onClick={onClick}
      ref={markerRef}
      userData={userData}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial 
        color={isSelected ? '#ec4899' : '#ef4444'} 
        emissive={isSelected ? '#ec4899' : '#ef4444'}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

export default POIMarker;