import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import * as reactSpring from '@react-spring/three';
import * as drei from '@react-three/drei';
import * as fiber from '@react-three/fiber';

function Welcome() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [transitionColor, setTransitionColor] = useState('black');

  const handleGetStarted = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    setClickPosition({ x, y });
    setTransitionColor('black');
    setIsTransitioning(true);
    
    setTimeout(() => {
      navigate('/signup');
    }, 800);
  };

  const handleSignIn = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    setClickPosition({ x, y });
    setTransitionColor('white');
    setIsTransitioning(true);
    
    setTimeout(() => {
      navigate('/signin');
    }, 800);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center">
      {/* Shader Background */}
      <div className="absolute inset-0 z-0">
        <ShaderGradientCanvas
          importedFiber={{ ...fiber, ...drei, ...reactSpring }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <ShaderGradient
            animate="on"
            axesHelper="off"
            brightness={1.2}
            cAzimuthAngle={106}
            cDistance={6.6}
            cPolarAngle={30}
            cameraZoom={1}
            color1="#9ea0ff"
            color2="#e1ba83"
            color3="#d0bce1"
            destination="onCanvas"
            embedMode="off"
            envPreset="city"
            format="gif"
            fov={90}
            frameRate={10}
            gizmoHelper="hide"
            grain="on"
            lightType="3d"
            pixelDensity={1}
            positionX={-1.7}
            positionY={-0.4}
            positionZ={1.5}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.1}
            rotationX={0}
            rotationY={10}
            rotationZ={50}
            shader="defaults"
            type="plane"
            uAmplitude={1}
            uDensity={1.7}
            uFrequency={5.5}
            uSpeed={0.4}
            uStrength={4}
            uTime={0}
            wireframe={false}
            zoomOut={false}
          />
        </ShaderGradientCanvas>
      </div>

      {/* Transition Overlay */}
      {isTransitioning && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 9999,
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              left: clickPosition.x,
              top: clickPosition.y,
              backgroundColor: transitionColor,
              transform: 'translate(-50%, -50%)',
              animation: 'expandCircle 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-7xl md:text-8xl font-bold tracking-[0.5rem] mb-4 font-mono">
          C y b e r S i m
        </h1>
        <p className="text-xl mb-16 font-mono">
          - Simulating Threats to Strengthen Defenses
        </p>
        {/* Buttons */}
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <button 
            onClick={handleGetStarted}
            disabled={isTransitioning}
            className="px-12 py-4 text-xl bg-white/70 backdrop-blur-md rounded-full shadow-lg hover:bg-white/90 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 font-mono disabled:opacity-50"
          >
            Get started
          </button>
          <span className="text-xl font-medium font-mono">or</span>
          <button 
            onClick={handleSignIn}
            disabled={isTransitioning}
            className="px-12 py-4 text-xl bg-white/70 backdrop-blur-md rounded-full shadow-lg hover:bg-white/90 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 font-mono disabled:opacity-50"
          >
            Sign In
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes expandCircle {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 300vmax;
            height: 300vmax;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Welcome;