import React, { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Preload the model
useGLTF.preload('/groot.glb');

function GrootModel({ onClick }) {
  const { scene } = useGLTF('/groot.glb');
  const cloned = useMemo(() => scene.clone(), [scene]);
  const groupRef = useRef();
  const eyeMeshesRef = useRef([]);
  const blinkStateRef = useRef({
    isBlinking: false,
    blinkProgress: 0,
    nextBlinkTime: Math.random() * 3 + 2, // Initial random delay
    timer: 0
  });

  // Find eyes in the model
  useEffect(() => {
    const eyes = [];
    cloned.traverse((child) => {
      if (child.isMesh && (child.name.toLowerCase().includes('eye') || child.name.toLowerCase().includes('pupil'))) {
        child.userData.originalScale = child.scale.clone();
        eyes.push(child);
      }
    });
    eyeMeshesRef.current = eyes;
  }, [cloned]);

  useFrame((state, delta) => {
    // Blinking Logic
    const blinkState = blinkStateRef.current;
    blinkState.timer += delta;

    if (!blinkState.isBlinking && blinkState.timer >= blinkState.nextBlinkTime) {
      blinkState.isBlinking = true;
      blinkState.timer = 0;
      blinkState.nextBlinkTime = Math.random() * 3 + 2; // Random delay between blinks (2-5s)
    }

    if (blinkState.isBlinking) {
      blinkState.blinkProgress += delta * 10; // Blink speed

      if (blinkState.blinkProgress >= 1) {
        blinkState.isBlinking = false;
        blinkState.blinkProgress = 0;
      }

      // Blink animation: close eyes (scale Y down) then open
      let eyeScaleY = 1;
      if (blinkState.blinkProgress < 0.2) {
        // Closing (0 to 0.2) - fast close
        eyeScaleY = 1 - (blinkState.blinkProgress / 0.2) * 0.95; // Scale down to 0.05
      } else if (blinkState.blinkProgress < 0.6) {
        // Closed (0.2 to 0.6)
        eyeScaleY = 0.05;
      } else {
        // Opening (0.6 to 1.0) - fast open
        eyeScaleY = 0.05 + ((blinkState.blinkProgress - 0.6) / 0.4) * 0.95; // Scale back up
      }

      // Apply scale to eyes - preserve original scale X and Z
      eyeMeshesRef.current.forEach((eye) => {
        if (eye.scale && eye.userData.originalScale) {
          eye.scale.y = eye.userData.originalScale.y * eyeScaleY;
        }
      });
    } else {
      // Reset eyes to normal when not blinking
      eyeMeshesRef.current.forEach((eye) => {
        if (eye.scale && eye.userData.originalScale) {
          eye.scale.y = THREE.MathUtils.lerp(eye.scale.y, eye.userData.originalScale.y, 0.15);
        }
      });
    }
  });

  return (
    <group ref={groupRef} onClick={onClick}>
      <primitive
        object={cloned}
        scale={11.0}
        position={[0, -5.5, 0]}
        rotation={[0, -1, 0]}
      />
    </group>
  );
}

export default function GrootModelViewer() {
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Initialize audio element once
    if (!audioRef.current) {
      audioRef.current = new Audio('/grootvoice.mp3');
    }
  }, []);

  const handleGrootClick = () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.currentTime = 0;
      void audio.play();
    } catch (e) {
      // Ignore play errors (e.g., autoplay restrictions)
      console.log("Audio play failed", e);
    }
  };

  return (
    <div className="h-full w-full min-h-[500px]">
      <Canvas
        camera={{ position: [0, 2.0, 18], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} />
        <directionalLight position={[-5, 5, -5]} intensity={0.6} />
        <pointLight position={[0, 5, 5]} intensity={0.8} />

        <Suspense fallback={null}>
          <GrootModel onClick={handleGrootClick} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={13.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
