import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import * as reactSpring from '@react-spring/three';
import * as drei from '@react-three/drei';
import * as fiber from '@react-three/fiber';
import { User, LogOut } from 'lucide-react';
import WifiSelector from '../components/WifiSelector';
import AttackSelector from '../components/AttackSelector';
import StartButton from '../components/StartButton';
import StatusMonitor from '../components/StatusMonitor';
import TestModel from '../components/TestModel';

function HomePage() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [transitionColor, setTransitionColor] = useState('black');

  const handleLogOut = async (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    try {
      const response = await fetch("http://localhost:5001/auth/logout", {
        method: "GET",
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "LogOut failed");
        navigate("/signin");
        return;
      }

      localStorage.removeItem('token');
      alert("Logout successful!");

      setClickPosition({ x, y });
      setTransitionColor('black');
      setIsTransitioning(true);

      setTimeout(() => {
        navigate('/');
      }, 800);

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Shader Background - Fixed */}
      <div className="fixed inset-0 z-0">
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
            bgColor1="#000000"
            bgColor2="#000000"
            brightness={1}
            cAzimuthAngle={180}
            cDistance={2.8}
            cPolarAngle={80}
            cameraZoom={9.1}
            color1="#00002c"
            color2="#675ac9"
            color3="#212121"
            destination="onCanvas"
            embedMode="off"
            envPreset="city"
            format="gif"
            fov={45}
            frameRate={10}
            gizmoHelper="hide"
            grain="off"
            lightType="3d"
            pixelDensity={1}
            positionX={0}
            positionY={0}
            positionZ={0}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.1}
            rotationX={50}
            rotationY={0}
            rotationZ={-60}
            shader="defaults"
            type="waterPlane"
            uAmplitude={0}
            uDensity={1.5}
            uFrequency={0}
            uSpeed={0.3}
            uStrength={1.5}
            uTime={8}
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

      {/* Top Navigation Bar - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-center p-6 bg-gradient-to-b from-black/50 to-transparent">
        <h1 className="text-3xl font-bold tracking-widest text-white font-mono">
          CyberSim
        </h1>
        <div className="absolute right-6 flex items-center gap-4">
          <button className="text-white/80 hover:text-white transition-colors">
            <User className="w-6 h-6" />
          </button>
          <button 
            onClick={handleLogOut}
            disabled={isTransitioning}
            className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Hamburger Menu - Fixed Top Left */}
      <div className="fixed top-6 left-6 z-20">
        <button className="text-white/80 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Content Container - Scrollable */}
      <div className="relative z-10 min-h-screen pt-24 pb-12 px-6">
        <div className="flex flex-col items-center gap-6 max-w-7xl mx-auto">
          {/* Top Row - WiFi and Attack Selectors */}
          <div className="flex flex-wrap justify-center gap-6">
            <WifiSelector />
            <AttackSelector />
          </div>
          
          {/* Middle Row - Start Button */}
          <div className="flex justify-center">
            <StartButton />
          </div>
          
          {/* Bottom Row - Status Monitor */}
          <div className="flex justify-center w-full">
            <StatusMonitor />
          </div>
          
          {/* Test Model */}
          <div className="w-full flex justify-center">
            <TestModel/>
          </div>
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

export default HomePage;