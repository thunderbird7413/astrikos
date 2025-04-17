// 'use client';
// import { useState, useRef, useEffect } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
// import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
// import Button from '../UI/Button';

// const ModelEditor = () => {
//     const canvasRef = useRef(null);
//     const sceneRef = useRef(null);
//     const cameraRef = useRef(null);
//     const rendererRef = useRef(null);
//     const controlsRef = useRef(null);
//     const transformControlsRef = useRef(null);
//     const [selectedObject, setSelectedObject] = useState(null);
//     const [shapes, setShapes] = useState([]);

//     useEffect(() => {
//         if (!canvasRef.current) return;

//         // Initialize Three.js scene
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0xf0f0f0);
//         sceneRef.current = scene;

//         // Setup camera
//         const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//         camera.position.set(5, 5, 5);
//         camera.lookAt(0, 0, 0);
//         cameraRef.current = camera;

//         // Setup renderer
//         const renderer = new THREE.WebGLRenderer({ 
//             canvas: canvasRef.current,
//             antialias: true,
//             alpha: true
//         });
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         renderer.setPixelRatio(window.devicePixelRatio);
//         rendererRef.current = renderer;

//         // Setup orbit controls
//         const controls = new OrbitControls(camera, renderer.domElement);
//         controls.enableDamping = true;
//         controls.dampingFactor = 0.05;
//         controlsRef.current = controls;

//         // Setup transform controls
//         const transformControls = new TransformControls(camera, renderer.domElement);
//         transformControls.addEventListener('dragging-changed', (event) => {
//             controls.enabled = !event.value;
//         });
//         transformControlsRef.current = transformControls;

//         // Create a container for the transform controls
//         const transformControlsContainer = new THREE.Object3D();
//         transformControlsContainer.add(transformControls);
//         scene.add(transformControlsContainer);

//         // Add lights
//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//         scene.add(ambientLight);

//         const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//         directionalLight.position.set(5, 5, 5);
//         scene.add(directionalLight);

//         // Add grid helper
//         const gridHelper = new THREE.GridHelper(10, 10);
//         scene.add(gridHelper);

//         // Animation loop
//         const animate = () => {
//             requestAnimationFrame(animate);
//             controls.update();
//             renderer.render(scene, camera);
//         };
//         animate();

//         // Handle window resize
//         const handleResize = () => {
//             camera.aspect = window.innerWidth / window.innerHeight;
//             camera.updateProjectionMatrix();
//             renderer.setSize(window.innerWidth, window.innerHeight);
//         };
//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//             scene.traverse((object) => {
//                 if (object.geometry) {
//                     object.geometry.dispose();
//                 }
//                 if (object.material) {
//                     if (Array.isArray(object.material)) {
//                         object.material.forEach(material => material.dispose());
//                     } else {
//                         object.material.dispose();
//                     }
//                 }
//             });
//             renderer.dispose();
//         };
//     }, []);

//     const addShape = (type) => {
//         if (!sceneRef.current) return;

//         let geometry, material;
//         switch (type) {
//             case 'cube':
//                 geometry = new THREE.BoxGeometry(1, 1, 1);
//                 break;
//             case 'sphere':
//                 geometry = new THREE.SphereGeometry(0.5, 32, 32);
//                 break;
//             case 'cylinder':
//                 geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
//                 break;
//             default:
//                 return;
//         }

//         material = new THREE.MeshPhongMaterial({ 
//             color: new THREE.Color(Math.random(), Math.random(), Math.random()),
//             transparent: true,
//             opacity: 0.8
//         });

//         const mesh = new THREE.Mesh(geometry, material);
//         mesh.position.set(0, 0, 0);
//         sceneRef.current.add(mesh);
//         setShapes([...shapes, mesh]);

//         // Select the new shape
//         setSelectedObject(mesh);
//         if (transformControlsRef.current) {
//             transformControlsRef.current.attach(mesh);
//         }
//     };

//     const handleObjectClick = (event) => {
//         if (!sceneRef.current || !cameraRef.current || !transformControlsRef.current) return;

//         const raycaster = new THREE.Raycaster();
//         const mouse = new THREE.Vector2();
        
//         mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//         mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
//         raycaster.setFromCamera(mouse, cameraRef.current);
        
//         const intersects = raycaster.intersectObjects(sceneRef.current.children);
        
//         if (intersects.length > 0) {
//             const selected = intersects[0].object;
//             if (selected !== selectedObject) {
//                 setSelectedObject(selected);
//                 transformControlsRef.current.attach(selected);
//             }
//         } else {
//             setSelectedObject(null);
//             transformControlsRef.current.detach();
//         }
//     };

//     const exportModel = () => {
//         if (!sceneRef.current) return;

//         const exporter = new GLTFExporter();
//         exporter.parse(sceneRef.current, (gltf) => {
//             const blob = new Blob([gltf], { type: 'application/octet-stream' });
//             const url = URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.download = 'model.gltf';
//             link.click();
//             URL.revokeObjectURL(url);
//         });
//     };

//     return (
//         <div className="h-screen flex flex-col">
//             <div className="p-4 bg-gray-800 flex gap-2">
//                 <Button onClick={() => addShape('cube')}>Add Cube</Button>
//                 <Button onClick={() => addShape('sphere')}>Add Sphere</Button>
//                 <Button onClick={() => addShape('cylinder')}>Add Cylinder</Button>
//                 <Button onClick={exportModel} variant="secondary">Export Model</Button>
//             </div>
//             <canvas 
//                 ref={canvasRef} 
//                 className="flex-1"
//                 onClick={handleObjectClick}
//             />
//         </div>
//     );
// };

// export default ModelEditor; 

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import './ModelCreator.css';

const ModelCreator = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const transformControlsRef = useRef(null);
  const objectsRef = useRef([]);
  const selectedObjectRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  
  const [transformMode, setTransformMode] = useState('translate');
  const [selectedObject, setSelectedObject] = useState(null);
  const [materialType, setMaterialType] = useState('standard');
  const [materialProps, setMaterialProps] = useState({
    color: '#00ff00',
    roughness: 0.5,
    metalness: 0.0
  });
  const [modelName, setModelName] = useState('Untitled Model');
  const [modelDescription, setModelDescription] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Initialize Three.js scene
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(2, 2, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controlsRef.current = controls;

    // Transform controls
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('dragging-changed', (event) => {
      controls.enabled = !event.value;
    });
    scene.add(transformControls);
    transformControlsRef.current = transformControls;

    // Add grid and axes helpers
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Handle mouse click for object selection
    const handleClick = (event) => {
      // Calculate mouse position in normalized device coordinates
      const bounds = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - bounds.left) / mountRef.current.clientWidth) * 2 - 1;
      mouseRef.current.y = -((event.clientY - bounds.top) / mountRef.current.clientHeight) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      // Calculate objects intersecting the picking ray
      const intersects = raycasterRef.current.intersectObjects(objectsRef.current);

      if (intersects.length > 0) {
        selectObject(intersects[0].object);
      } else {
        deselectObject();
      }
    };
    renderer.domElement.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // Update transform controls mode when mode changes
  useEffect(() => {
    if (transformControlsRef.current) {
      transformControlsRef.current.setMode(transformMode);
    }
  }, [transformMode]);

  // Select object function
  const selectObject = (object) => {
    // Skip grid and axes helpers
    if (object.type === 'GridHelper' || object.type === 'AxesHelper') {
      return;
    }

    if (selectedObjectRef.current) {
      // Remove highlight from previously selected object
      if (selectedObjectRef.current.material) {
        selectedObjectRef.current.material.emissive.setHex(0x000000);
      }
    }

    // Highlight new selection
    selectedObjectRef.current = object;
    if (object.material && object.material.emissive) {
      object.material.emissive.setHex(0x555555);
    }

    // Update state for UI
    setSelectedObject({
      id: object.id,
      position: {
        x: object.position.x,
        y: object.position.y,
        z: object.position.z
      },
      rotation: {
        x: object.rotation.x,
        y: object.rotation.y,
        z: object.rotation.z
      },
      scale: {
        x: object.scale.x,
        y: object.scale.y,
        z: object.scale.z
      },
      color: object.material ? '#' + object.material.color.getHexString() : '#ffffff'
    });

    // Attach transform controls
    transformControlsRef.current.attach(object);
  };

  // Deselect object function
  const deselectObject = () => {
    if (selectedObjectRef.current) {
      if (selectedObjectRef.current.material && selectedObjectRef.current.material.emissive) {
        selectedObjectRef.current.material.emissive.setHex(0x000000);
      }
      selectedObjectRef.current = null;
      setSelectedObject(null);
      transformControlsRef.current.detach();
    }
  };

  // Add cube function
  const addCube = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = createMaterial(materialType, materialProps);
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0.5, 0);
    cube.castShadow = true;
    cube.receiveShadow = true;
    sceneRef.current.add(cube);
    objectsRef.current.push(cube);
    selectObject(cube);
  };

  // Add sphere function
  const addSphere = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = createMaterial(materialType, materialProps);
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0.5, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sceneRef.current.add(sphere);
    objectsRef.current.push(sphere);
    selectObject(sphere);
  };

  // Add cylinder function
  const addCylinder = () => {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = createMaterial(materialType, materialProps);
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(0, 0.5, 0);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    sceneRef.current.add(cylinder);
    objectsRef.current.push(cylinder);
    selectObject(cylinder);
  };

  // Create material function
  const createMaterial = (type, props) => {
    let material;
    const materialProps = {
      ...props,
      color: new THREE.Color(props.color)
    };

    switch (type) {
      case 'standard':
        material = new THREE.MeshStandardMaterial(materialProps);
        break;
      case 'phong':
        material = new THREE.MeshPhongMaterial(materialProps);
        break;
      case 'basic':
        material = new THREE.MeshBasicMaterial(materialProps);
        break;
      case 'lambert':
        material = new THREE.MeshLambertMaterial(materialProps);
        break;
      default:
        material = new THREE.MeshStandardMaterial(materialProps);
    }
    return material;
  };

  // Apply material to selected object
  const applyMaterial = () => {
    if (selectedObjectRef.current) {
      const newMaterial = createMaterial(materialType, materialProps);
      selectedObjectRef.current.material = newMaterial;
      
      // Update selected object state to reflect new material
      setSelectedObject(prev => ({
        ...prev,
        color: materialProps.color
      }));
    }
  };

  // Update object position
  const updatePosition = (axis, value) => {
    if (selectedObjectRef.current) {
      selectedObjectRef.current.position[axis] = parseFloat(value);
      setSelectedObject(prev => ({
        ...prev,
        position: {
          ...prev.position,
          [axis]: parseFloat(value)
        }
      }));
    }
  };

  // Update object rotation
  const updateRotation = (axis, value) => {
    if (selectedObjectRef.current) {
      selectedObjectRef.current.rotation[axis] = parseFloat(value);
      setSelectedObject(prev => ({
        ...prev,
        rotation: {
          ...prev.rotation,
          [axis]: parseFloat(value)
        }
      }));
    }
  };

  // Update object scale
  const updateScale = (axis, value) => {
    if (selectedObjectRef.current) {
      selectedObjectRef.current.scale[axis] = parseFloat(value);
      setSelectedObject(prev => ({
        ...prev,
        scale: {
          ...prev.scale,
          [axis]: parseFloat(value)
        }
      }));
    }
  };

  // Delete selected object
  const deleteSelectedObject = () => {
    if (selectedObjectRef.current) {
      sceneRef.current.remove(selectedObjectRef.current);
      objectsRef.current = objectsRef.current.filter(obj => obj !== selectedObjectRef.current);
      deselectObject();
      
      // Show notification
      showNotification('Object deleted successfully', 'success');
    }
  };

  // Export model
  const exportModel = () => {
    const exporter = new GLTFExporter();
    exporter.parse(
      sceneRef.current,
      (gltf) => {
        if (gltf instanceof ArrayBuffer) {
          saveArrayBuffer(gltf, `${modelName}.glb`);
        } else {
          const output = JSON.stringify(gltf, null, 2);
          saveString(output, `${modelName}.gltf`);
        }
        showNotification('Model exported successfully!', 'success');
      },
      (error) => {
        console.error('An error occurred while exporting:', error);
        showNotification('Error exporting model', 'error');
      },
      { binary: true }
    );
  };

  // Save array buffer to file
  const saveArrayBuffer = (buffer, filename) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // Save string to file
  const saveString = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // Save to model library
  const saveToLibrary = async () => {
    // Generate thumbnail
    const thumbnailDataURL = rendererRef.current.domElement.toDataURL('image/png');
    
    // Export model data (GLB format)
    const exporter = new GLTFExporter();
    exporter.parse(
      sceneRef.current,
      async (gltf) => {
        try {
          // Convert gltf to base64 string for storage
          let modelData1;
          if (gltf instanceof ArrayBuffer) {
            const binary = Array.from(new Uint8Array(gltf))
              .map(b => String.fromCharCode(b))
              .join('');
            modelData1 = btoa(binary);
          } else {
            modelData1 = btoa(JSON.stringify(gltf));
          }
          
          // Create model metadata
          const modelData = {
            name: modelName,
            description: modelDescription,
            createdAt: new Date().toISOString(),
            thumbnail: thumbnailDataURL,
            modelData: modelData1,
            format: gltf instanceof ArrayBuffer ? 'glb' : 'gltf'
          };
          
          // Mock API call - replace with your actual API endpoint
          // const response = await fetch('/api/models', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify(modelData)
          // });
          
          // if (!response.ok) {
          //   throw new Error('Failed to save model');
          // }
          
          // const data = await response.json();
          // console.log('Model saved:', data);
          
          // For now, we'll just simulate a successful save
          console.log('Model saved:', modelData);
          showNotification('Model saved to library!', 'success');
        } catch (error) {
          console.error('Error saving model:', error);
          showNotification('Error saving model to library', 'error');
        }
      },
      (error) => {
        console.error('An error occurred while exporting:', error);
        showNotification('Error preparing model for library', 'error');
      },
      { binary: true }
    );
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <div className="model-creator-container ">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <div className="model-info-panel bg-gray-900">
        <h3 style={{color: "white"}}>Model Information</h3>
        <div className="form-group">
          <label>Name:</label>
          <input 
            type="text" 
            value={modelName} 
            onChange={(e) => setModelName(e.target.value)}
            placeholder="Enter model name"
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea 
            value={modelDescription} 
            onChange={(e) => setModelDescription(e.target.value)}
            placeholder="Enter model description"
            rows="3"
          />
        </div>
      </div>
      
      <div className="workspace-container">
        <div className="toolbar">
          <div className="toolbar-section">
            <h4>Add Objects</h4>
            <button onClick={addCube}>Add Cube</button>
            <button onClick={addSphere}>Add Sphere</button>
            <button onClick={addCylinder}>Add Cylinder</button>
          </div>
          
          <div className="toolbar-section">
            <h4>Transform</h4>
            <button 
              className={transformMode === 'translate' ? 'active' : ''} 
              onClick={() => setTransformMode('translate')}
            >
              Move
            </button>
            <button 
              className={transformMode === 'rotate' ? 'active' : ''} 
              onClick={() => setTransformMode('rotate')}
            >
              Rotate
            </button>
            <button 
              className={transformMode === 'scale' ? 'active' : ''} 
              onClick={() => setTransformMode('scale')}
            >
              Scale
            </button>
          </div>
          
          <div className="toolbar-section">
            <h4>Export</h4>
            <button onClick={exportModel}>Export Model</button>
            <button onClick={saveToLibrary}>Save to Library</button>
          </div>
        </div>
        
        <div className="editor-container bg-gray-900">
          <div className="model-canvas" ref={mountRef}></div>
          
          <div className="properties-panel bg-gray-900">
            {selectedObject ? (
              <>
                <h3 style={{color: "white", fontWeight: "bold"}}>Object Properties</h3>
                <div className="property-section">
                  <h4 style={{color: "white", fontWeight: "normal"}}>Position</h4>
                  <div className="form-group">
                    <label>X:</label>
                    <input 
                      type="number" 
                      value={selectedObject.position.x} 
                      onChange={(e) => updatePosition('x', e.target.value)} 
                      step="0.1" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Y:</label>
                    <input 
                      type="number" 
                      value={selectedObject.position.y} 
                      onChange={(e) => updatePosition('y', e.target.value)} 
                      step="0.1" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Z:</label>
                    <input 
                      type="number" 
                      value={selectedObject.position.z} 
                      onChange={(e) => updatePosition('z', e.target.value)} 
                      step="0.1" 
                    />
                  </div>
                </div>
                
                <div className="property-section">
                  <h4 style={{color: "white", fontWeight: "normal"}}>Rotation</h4>
                  <div className="form-group">
                    <label>X:</label>
                    <input 
                      type="number" 
                      value={selectedObject.rotation.x} 
                      onChange={(e) => updateRotation('x', e.target.value)} 
                      step="0.1" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Y:</label>
                    <input 
                      type="number" 
                      value={selectedObject.rotation.y} 
                      onChange={(e) => updateRotation('y', e.target.value)} 
                      step="0.1" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Z:</label>
                    <input 
                      type="number" 
                      value={selectedObject.rotation.z} 
                      onChange={(e) => updateRotation('z', e.target.value)} 
                      step="0.1" 
                    />
                  </div>
                </div>
                
                <div className="property-section">
                  <h4 style={{color: "white", fontWeight: "normal"}}>Scale</h4>
                  <div className="form-group">
                    <label>X:</label>
                    <input 
                      type="number" 
                      value={selectedObject.scale.x} 
                      onChange={(e) => updateScale('x', e.target.value)} 
                      step="0.1" 
                      min="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Y:</label>
                    <input 
                      type="number" 
                      value={selectedObject.scale.y} 
                      onChange={(e) => updateScale('y', e.target.value)} 
                      step="0.1" 
                      min="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Z:</label>
                    <input 
                      type="number" 
                      value={selectedObject.scale.z} 
                      onChange={(e) => updateScale('z', e.target.value)} 
                      step="0.1" 
                      min="0.1"
                    />
                  </div>
                </div>
                
                <div className="property-section">
                  <h4 style={{color: "white", fontWeight: "normal"}}>Material</h4>
                  <div className="form-group bg-gray-900 text-white">
                    <label>Type:</label>
                    <select 
                      value={materialType} 
                      onChange={(e) => setMaterialType(e.target.value)}
                      className="bg-gray-900"
                    >
                      <option value="standard">Standard</option>
                      <option value="phong">Phong</option>
                      <option value="basic">Basic</option>
                      <option value="lambert">Lambert</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Color:</label>
                    <input 
                      type="color" 
                      value={materialProps.color} 
                      onChange={(e) => setMaterialProps(prev => ({ ...prev, color: e.target.value }))} 
                    />
                  </div>
                  {(materialType === 'standard') && (
                    <>
                      <div className="form-group">
                        <label>Roughness: {materialProps.roughness}</label>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01" 
                          value={materialProps.roughness} 
                          onChange={(e) => setMaterialProps(prev => ({ ...prev, roughness: parseFloat(e.target.value) }))} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Metalness: {materialProps.metalness}</label>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01" 
                          value={materialProps.metalness} 
                          onChange={(e) => setMaterialProps(prev => ({ ...prev, metalness: parseFloat(e.target.value) }))} 
                        />
                      </div>
                    </>
                  )}
                  <button onClick={applyMaterial}>Apply Material</button>
                </div>
                
                <div className="action-buttons">
                  <button className="delete-button" onClick={deleteSelectedObject}>Delete Object</button>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <p>No object selected</p>
                <p>Click on an object to select it</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelCreator;