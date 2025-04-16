'use client';
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { TransformControls as RawTransformControls } from 'three/examples/jsm/controls/TransformControls';
import Button from '../UI/Button';

const ModelEditor = () => {
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const transformControlsRef = useRef(null);
    const [selectedObject, setSelectedObject] = useState(null);
    const [shapes, setShapes] = useState([]);
    const gridHelperRef = useRef(null);
    const [transformMode, setTransformMode] = useState('translate');

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvasRef.current,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        rendererRef.current = renderer;

        // Orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controlsRef.current = controls;

        // Transform controls
        const transformControls = new RawTransformControls(camera, renderer.domElement);
        transformControls.setSize(0.8); // Make controls more visible
        transformControls.addEventListener('dragging-changed', (event) => {
            controls.enabled = !event.value;
        });
        transformControls.addEventListener('change', () => {
            renderer.render(scene, camera);
        });
        scene.add(transformControls);
        transformControlsRef.current = transformControls;

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Ground plane
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);
        gridHelperRef.current = ground;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Event listeners
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        const handleKeyDown = (event) => {
            if (event.key === 'Delete' && selectedObject) {
                scene.remove(selectedObject);
                setShapes(shapes.filter(shape => shape !== selectedObject));
                setSelectedObject(null);
                transformControls.detach();
            }
            switch (event.key.toLowerCase()) {
                case 't': setTransformMode('translate'); break;
                case 'r': setTransformMode('rotate'); break;
                case 's': setTransformMode('scale'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        if (transformControlsRef.current) {
            transformControlsRef.current.setMode(transformMode);
        }
    }, [transformMode]);

    const addShape = (type) => {
        const geometry = {
            cube: new THREE.BoxGeometry(1, 1, 1),
            sphere: new THREE.SphereGeometry(0.5, 32, 32),
            cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 32)
        }[type];

        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            transparent: true,
            opacity: 0.8
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(shapes.length * 2, 0.5, 0);
        
        sceneRef.current.add(mesh);
        setShapes(prev => [...prev, mesh]);
        setSelectedObject(mesh);
        transformControlsRef.current.attach(mesh);
    };

    const handleCanvasClick = (event) => {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        
        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

        if (intersects.length > 0 && !intersects[0].object.isTransformControls) {
            const selected = intersects[0].object;
            setSelectedObject(selected);
            transformControlsRef.current.attach(selected);
        }
    };

    const exportModel = () => {
        new GLTFExporter().parse(sceneRef.current, (gltf) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(new Blob([JSON.stringify(gltf)], { type: 'application/octet-stream' }));
            link.download = 'model.gltf';
            link.click();
        });
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="p-4 bg-gray-800 flex gap-2">
                <Button onClick={() => addShape('cube')}>Add Cube</Button>
                <Button onClick={() => addShape('sphere')}>Add Sphere</Button>
                <Button onClick={() => addShape('cylinder')}>Add Cylinder</Button>
                
                <Button onClick={() => setTransformMode('translate')} variant={transformMode === 'translate' ? 'primary' : 'secondary'}>
                    Move (T)
                </Button>
                <Button onClick={() => setTransformMode('rotate')} variant={transformMode === 'rotate' ? 'primary' : 'secondary'}>
                    Rotate (R)
                </Button>
                <Button onClick={() => setTransformMode('scale')} variant={transformMode === 'scale' ? 'primary' : 'secondary'}>
                    Scale (S)
                </Button>
                
                <Button onClick={exportModel} variant="secondary">Export Model</Button>
            </div>
            
            <div className="p-2 text-sm text-gray-600">
                {selectedObject ? `Selected: ${selectedObject.type}` : "Click to select object"}
            </div>

            <canvas 
                ref={canvasRef}
                className="flex-1"
                onClick={handleCanvasClick}
            />
        </div>
    );
};

export default ModelEditor;