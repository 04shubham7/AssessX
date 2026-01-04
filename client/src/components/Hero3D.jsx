import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Text, TorusKnot, MeshTransmissionMaterial } from '@react-three/drei';

const FloatingIcons = () => {
    const group = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        group.current.rotation.x = Math.cos(t / 4) / 8;
        group.current.rotation.y = Math.sin(t / 4) / 8;
        group.current.rotation.z = -0.2 - (1 + Math.sin(t / 1.5)) / 20;
    });

    return (
        <group ref={group}>
            {/* Main Shield-like Shape */}
            <mesh position={[0, 0, 0]}>
                <torusKnotGeometry args={[1, 0.3, 128, 16]} />
                <MeshTransmissionMaterial
                    backside
                    backsideThickness={5}
                    thickness={2}
                    roughness={0.2}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    transmission={1}
                    ior={1.5}
                    chromaticAberration={1}
                    anisotropy={20}
                    distortion={0.5}
                    distortionScale={0.5}
                    temporalDistortion={0.2}
                    color="#6366f1"
                    background="#0e0e0e"
                />
            </mesh>

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
};

const Hero3D = () => {
    return (
        <div className="absolute inset-0 z-0 opacity-100">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#8b5cf6" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <FloatingIcons />
                </Float>
            </Canvas>
        </div>
    );
};

export default Hero3D;
