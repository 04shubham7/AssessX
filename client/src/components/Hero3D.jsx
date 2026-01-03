import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';

const AnimatedShape = () => {
    const mesh = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        mesh.current.rotation.x = time * 0.2;
        mesh.current.rotation.y = time * 0.4;
    });

    return (
        <Sphere args={[1, 100, 200]} scale={2} ref={mesh}>
            <MeshDistortMaterial
                color="#6366f1"
                attach="material"
                distort={0.5}
                speed={2}
                roughness={0}
                metalness={0.5}
            />
        </Sphere>
    );
};

const Hero3D = () => {
    return (
        <div className="absolute inset-0 z-[-1] opacity-50 dark:opacity-30">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
                    <AnimatedShape />
                </Float>
            </Canvas>
        </div>
    );
};

export default Hero3D;
