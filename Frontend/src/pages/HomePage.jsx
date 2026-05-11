import React, { useState, useRef, useCallback, useEffect } from 'react';
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

// ── Color themes (as [r,g,b] for easy interpolation) ────────────────────────
const THEMES = {
  normal: { c1: [0,   0,   44],  c2: [103, 90,  201], c3: [33,  33,  33]  },
  attack: { c1: [44,  0,   0],   c2: [201, 58,  58],  c3: [26,  10,  10]  },
};

const lerpColor = (a, b, t) =>
  a.map((v, i) => Math.round(v + (b[i] - v) * t));

const toHex = ([r, g, b]) =>
  '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');

const TRANSITION_MS = 1400;

function HomePage() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [attack, setattack] = useState(null);
  const [clickPosition, setClickPosition]     = useState({ x: 0, y: 0 });
  const [transitionColor, setTransitionColor] = useState('black');
  const [isRunning, setIsRunning] = useState(false);

  // Live-interpolated shader colors
  const [shaderColors, setShaderColors] = useState({
    color1: toHex(THEMES.normal.c1),
    color2: toHex(THEMES.normal.c2),
    color3: toHex(THEMES.normal.c3),
  });

  // Radial spread state
  const [spread, setSpread] = useState({ active: false, x: 0, y: 0, isAttack: false, key: 0 });

  const animRef     = useRef(null);
  const tRef        = useRef(0); // 0 = fully normal, 1 = fully attack
  const testModelRef = useRef(null);

  // ── Smooth color interpolation via rAF ─────────────────────────────────────
  const animateTo = useCallback((targetT) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startT  = tRef.current;
    const startMs = performance.now();

    const tick = (now) => {
      const elapsed  = now - startMs;
      const progress = Math.min(elapsed / TRANSITION_MS, 1);
      // ease-in-out cubic
      const ease = progress < 0.5
        ? 4 * progress ** 3
        : 1 - (-2 * progress + 2) ** 3 / 2;

      const t = startT + (targetT - startT) * ease;
      tRef.current = t;

      setShaderColors({
        color1: toHex(lerpColor(THEMES.normal.c1, THEMES.attack.c1, t)),
        color2: toHex(lerpColor(THEMES.normal.c2, THEMES.attack.c2, t)),
        color3: toHex(lerpColor(THEMES.normal.c3, THEMES.attack.c3, t)),
      });

      if (progress < 1) animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  // ── Called by TestModel ────────────────────────────────────────────────────
  const handleAttackDetected = useCallback((isAttack) => {
    // Find center of the TestModel card
    let ox = window.innerWidth  / 2;
    let oy = window.innerHeight / 2;
    if (testModelRef.current) {
      const rect = testModelRef.current.getBoundingClientRect();
      ox = rect.left + rect.width  / 2;
      oy = rect.top  + rect.height / 2;
    }

    // Trigger the radial ripple (key bump forces re-mount → re-animation)
    setSpread(s => ({ active: true, x: ox, y: oy, isAttack, key: s.key + 1 }));
    animateTo(isAttack ? 1 : 0);
    setTimeout(() => setSpread(s => ({ ...s, active: false })), TRANSITION_MS + 300);
  }, [animateTo]);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogOut = async (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width  / 2;
    const y = rect.top  + rect.height / 2;
    try {
      const response = await fetch('http://localhost:5001/auth/logout', { method: 'GET' });
      const data = await response.json();
      if (!response.ok) { alert(data.message || 'LogOut failed'); navigate('/signin'); return; }
      localStorage.removeItem('token');
      alert('Logout successful!');
      setClickPosition({ x, y });
      setTransitionColor('black');
      setIsTransitioning(true);
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">

      {/* ── Shader Background ─────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0">
        <ShaderGradientCanvas
          importedFiber={{ ...fiber, ...drei, ...reactSpring }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
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
            color1={shaderColors.color1}
            color2={shaderColors.color2}
            color3={shaderColors.color3}
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

      {/* ── Radial spread ripple (originates from TestModel card) ─────────── */}
      {spread.active && (
        <div
          key={spread.key}
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <div
            style={{
              position: 'absolute',
              left: spread.x,
              top:  spread.y,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: spread.isAttack
                ? 'radial-gradient(circle, rgba(200,30,30,0.22) 0%, rgba(140,10,10,0.08) 50%, transparent 70%)'
                : 'radial-gradient(circle, rgba(30,30,200,0.22) 0%, rgba(10,10,140,0.08) 50%, transparent 70%)',
              animation: `radialSpread ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
            }}
          />
        </div>
      )}

      {/* ── Logout page-transition overlay ───────────────────────────────── */}
      {isTransitioning && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
          <div
            className="absolute rounded-full"
            style={{
              left: clickPosition.x,
              top:  clickPosition.y,
              backgroundColor: transitionColor,
              transform: 'translate(-50%, -50%)',
              animation: 'expandCircle 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards',
            }}
          />
        </div>
      )}

      {/* ── Top Nav ──────────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-center p-6 bg-gradient-to-b from-black/50 to-transparent">
        <h1 className="text-3xl font-bold tracking-widest text-white font-mono">CyberSim</h1>
        <div className="absolute right-6 flex items-center gap-4">
          <button className="text-white/80 hover:text-white transition-colors">
            <User className="w-6 h-6" />
          </button>
          <button onClick={handleLogOut} disabled={isTransitioning} className="text-white/80 hover:text-white transition-colors disabled:opacity-50">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* ── Hamburger ────────────────────────────────────────────────────── */}
      <div className="fixed top-6 left-6 z-20">
        <button className="text-white/80 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* ── Page Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 min-h-screen pt-24 pb-12 px-6">
        <div className="flex flex-col items-center gap-6 max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {/* <WifiSelector /> */}
            <AttackSelector sattack={setattack}/>
          </div>
          <div className="flex justify-center">
            <StartButton onRunningChange={setIsRunning}/>
          </div>
          <div className="flex justify-center w-full">
            <StatusMonitor isRunning={isRunning}/>
          </div>
          {/* ref wrapper lets us measure the card's screen position */}
          <div className="w-full flex justify-center" ref={testModelRef}>
            <TestModel onAttackDetected={handleAttackDetected} attack={attack} onRunningChange={setIsRunning}/>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes expandCircle {
          0%   { width: 0;       height: 0;       opacity: 1; }
          100% { width: 300vmax; height: 300vmax; opacity: 1; }
        }
        @keyframes radialSpread {
          0%   { width: 0;       height: 0;       opacity: 1;   }
          70%  {                                  opacity: 0.5; }
          100% { width: 350vmax; height: 350vmax; opacity: 0;   }
        }
      `}</style>
    </div>
  );
}

export default HomePage;