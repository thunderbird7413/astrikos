'use client';
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import Button from '../../UI/Button';

const ModelEditor = () => {
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const transformControlsRef = useRef(null);
    const [selectedObject, setSelectedObject] = useState(null);
    const [shapes, setShapes] = useState([]);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize Three.js scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        sceneRef.current = scene;

        // Setup camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Setup renderer
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvasRef.current,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;

        // Setup orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controlsRef.current = controls;

        // Setup transform controls
        const transformControls = new TransformControls(camera, renderer.domElement);
        transformControls.addEventListener('dragging-changed', (event) => {
            controls.enabled = !event.value;
        });
        transformControlsRef.current = transformControls;

        // Create a container for the transform controls
        const transformControlsContainer = new THREE.Object3D();
        transformControlsContainer.add(transformControls);
        scene.add(transformControlsContainer);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Add grid helper
        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            scene.traverse((object) => {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            renderer.dispose();
        };
    }, []);

    const addShape = (type) => {
        if (!sceneRef.current) return;

        let geometry, material;
        switch (type) {
            case 'cube':
                geometry = new THREE.BoxGeometry(1, 1, 1);
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(0.5, 32, 32);
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
                break;
            default:
                return;
        }

        material = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            transparent: true,
            opacity: 0.8
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        sceneRef.current.add(mesh);
        setShapes([...shapes, mesh]);

        // Select the new shape
        setSelectedObject(mesh);
        if (transformControlsRef.current) {
            transformControlsRef.current.attach(mesh);
        }
    };

    const handleObjectClick = (event) => {
        if (!sceneRef.current || !cameraRef.current || !transformControlsRef.current) return;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, cameraRef.current);
        
        const intersects = raycaster.intersectObjects(sceneRef.current.children);
        
        if (intersects.length > 0) {
            const selected = intersects[0].object;
            if (selected !== selectedObject) {
                setSelectedObject(selected);
                transformControlsRef.current.attach(selected);
            }
        } else {
            setSelectedObject(null);
            transformControlsRef.current.detach();
        }
    };

    const exportModel = () => {
        if (!sceneRef.current) return;

        const exporter = new GLTFExporter();
        exporter.parse(sceneRef.current, (gltf) => {
            const blob = new Blob([gltf], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'model.gltf';
            link.click();
            URL.revokeObjectURL(url);
        });
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="p-4 bg-gray-800 flex gap-2">
                <Button onClick={() => addShape('cube')}>Add Cube</Button>
                <Button onClick={() => addShape('sphere')}>Add Sphere</Button>
                <Button onClick={() => addShape('cylinder')}>Add Cylinder</Button>
                <Button onClick={exportModel} variant="secondary">Export Model</Button>
            </div>
            <canvas 
                ref={canvasRef} 
                className="flex-1"
                onClick={handleObjectClick}
            />
        </div>
    );
};

export default ModelEditor; 