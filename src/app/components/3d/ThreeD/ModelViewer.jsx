// 'use client';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { OrbitControls, useGLTF } from '@react-three/drei';
// import POIMarker from './POIMarker';
// import { useRef, useState } from 'react';

// // Model component for loading and interacting with the 3D model
// const Model = ({ url, onModelClick, onPOIClick, selectedPOI, pois }) => {
//   const group = useRef();
//   const { scene } = useGLTF(url || '');
//   const { camera } = useThree();

//   const handleClick = (e) => {
//     e.stopPropagation();
//     const poiIntersect = e.intersections.find(i => i.object.userData?.isPOI);
//     if (poiIntersect) {
//       onPOIClick(poiIntersect.object.userData.poi);
//       return;
//     }

//     if (e.distance > 0) {
//       onModelClick(e.point);
//     }
//   };

//   return (
//     <group ref={group} onClick={handleClick}>
//       <primitive object={scene} />
//       {pois.map((poi) => (
//         <POIMarker
//           key={poi._id}
//           position={[poi.position.x, poi.position.y, poi.position.z]}
//           isSelected={selectedPOI?._id === poi._id}
//           userData={{ poi, isPOI: true }}
//           onClick={() => onPOIClick(poi)}
//         />
//       ))}
//     </group>
//   );
// };

// // Wrapper group that handles optional rotation
// const RotatingGroup = ({ children, rotate }) => {
//   const groupRef = useRef();
//   const angle = useRef(0);

//   useFrame(() => {
//     if (rotate && groupRef.current) {
//       angle.current += 0.001;
//       groupRef.current.rotation.y = angle.current;
//     }
//   });

//   return <group ref={groupRef}>{children}</group>;
// };

// // Main ModelViewer component
// const ModelViewer = ({ modelUrl, pois, onModelClick, onPOIClick, selectedPOI }) => {
//   const [rotate, setRotate] = useState(false);

//   if (!modelUrl) {
//     return <p className="text-red-600">Error: Model URL not provided</p>;
//   }

//   return (
//     <div className="relative w-full h-screen">
//       {/* Rotation Toggle Button */}
//       <button
//         onClick={() => setRotate(prev => !prev)}
//         className="absolute z-10 bottom-15 right-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-md"
//       >
//         {rotate ? 'Stop Rotation' : 'Start Rotation'}
//       </button>

//       <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
//         <ambientLight intensity={0.9} />
//         <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
//         <pointLight position={[-10, -10, -10]} />

//         <RotatingGroup rotate={rotate}>
//           <gridHelper args={[20, 20, 0x888888, 0x444444]} position={[0, 0, 0]} />
//           <Model
//             url={modelUrl}
//             onModelClick={onModelClick}
//             pois={pois}
//             onPOIClick={onPOIClick}
//             selectedPOI={selectedPOI}
//           />
//         </RotatingGroup>

//         <OrbitControls enablePan enableZoom enableRotate />
//       </Canvas>
//     </div>
//   );
// };

// export default ModelViewer;


'use client';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import POIMarker from './POIMarker';
import { useRef, useState } from 'react';

const Model = ({ url, onModelClick, onPOIClick, selectedPOI, pois }) => {
  const group = useRef();
  const { scene } = useGLTF(url || '');
  const { camera } = useThree();

  const handleClick = (e) => {
    e.stopPropagation();

    const poiIntersect = e.intersections.find(i => i.object.userData?.isPOI);
    if (poiIntersect) {
      onPOIClick(poiIntersect.object.userData.poi);
      return;
    }

    if (e.point) {
      onModelClick(e.point);
    }
  };

  return (
    <group ref={group} onClick={handleClick}>
      <primitive object={scene} />
      {pois.map((poi) => (
        <POIMarker
          key={poi._id}
          position={[
            poi.position?.x || 0,
            poi.position?.y || 0,
            poi.position?.z || 0,
          ]}
          isSelected={selectedPOI?._id === poi._id}
          userData={{ poi, isPOI: true }}
          onClick={() => onPOIClick(poi)}
        />
      ))}
    </group>
  );
};

const RotatingGroup = ({ children, rotate }) => {
  const groupRef = useRef();
  const angle = useRef(0);

  useFrame(() => {
    if (rotate && groupRef.current) {
      angle.current += 0.001;
      groupRef.current.rotation.y = angle.current;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

const ModelViewer = ({ modelUrl, pois, onModelClick, onPOIClick, selectedPOI }) => {
  const [rotate, setRotate] = useState(false);

  if (!modelUrl) {
    return <p className="text-red-600">Error: Model URL not provided</p>;
  }

  return (
    <div className="relative w-full h-screen">
      <button
        onClick={() => setRotate(prev => !prev)}
        className="absolute z-10 bottom-5 right-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-md"
      >
        {rotate ? 'Stop Rotation' : 'Start Rotation'}
      </button>

      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[0, 10, 0]} intensity={0.5} />

        <OrbitControls enablePan enableZoom enableRotate />

        <RotatingGroup rotate={rotate}>
          <gridHelper args={[20, 20, 0x888888, 0x444444]} position={[0, -0.8, 0]}/>
          <Model
            url={modelUrl}
            onModelClick={onModelClick}
            pois={pois}
            onPOIClick={onPOIClick}
            selectedPOI={selectedPOI}
          />
        </RotatingGroup>
      </Canvas>
    </div>
  );
};

export default ModelViewer;
