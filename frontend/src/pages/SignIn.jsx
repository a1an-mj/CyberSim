import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import * as reactSpring from '@react-spring/three';
import * as drei from '@react-three/drei';
import * as fiber from '@react-three/fiber';
import { Mail, Lock } from 'lucide-react';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign in:', { email, password, rememberMe });
    // Add your sign in logic here
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
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
  cAzimuthAngle={180}
  cDistance={11.99}
  cPolarAngle={90}
  cameraZoom={1}
  color1="#9ea0ff"
  color2="#e1ba83"
  color3="#d0bce1"
  destination="onCanvas"
  embedMode="off"
  envPreset="city"
  format="gif"
  fov={45}
  frameRate={10}
  gizmoHelper="hide"
  grain="on"
  lightType="3d"
  pixelDensity={1}
  positionX={1.2}
  positionY={0.5}
  positionZ={-2.5}
  range="disabled"
  rangeEnd={40}
  rangeStart={0}
  reflection={0.1}
  rotationX={90}
  rotationY={180}
  rotationZ={90}
  shader="defaults"
  type="plane"
  uAmplitude={1}
  uDensity={1.3}
  uFrequency={5.5}
  uSpeed={0.4}
  uStrength={4}
  uTime={0}
  wireframe={false}
/>
        </ShaderGradientCanvas>
      </div>

      {/* Header */}
      <div className="absolute top-12 left-0 right-0 z-10 text-center">
        <h1 className="text-6xl md:text-7xl font-bold tracking-[0.5rem] mb-2 font-mono">
          C y b e r S i m
        </h1>
        <p className="text-lg font-mono">
          - Simulating Threats to Strengthen Defenses
        </p>
      </div>

      {/* Sign In Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-2 font-mono text-white">Sign In</h2>
          <p className="text-sm text-white/80 mb-8 font-mono">
            Enter email and password to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="email"
                placeholder="example@exmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent border-2 border-white/50 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-white/80 transition-colors font-mono"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="password"
                placeholder="············"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent border-2 border-white/50 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-white/80 transition-colors font-mono"
                required
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-blue-500"
              />
              <label htmlFor="remember" className="text-white font-mono text-sm">
                remember me
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-300/80 hover:bg-blue-300 text-black font-bold rounded-full transition-colors font-mono text-lg shadow-lg"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Bottom Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-black font-mono">
            Dont have a account?{' '}
            <button 
              onClick={handleSignUp}
              className="underline hover:text-white transition-colors"
            >
              Sign up
            </button>
          </p>
          <button 
            onClick={handleForgotPassword}
            className="block w-full text-black underline hover:text-white transition-colors font-mono"
          >
            Forgot Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;