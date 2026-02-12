import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import * as reactSpring from '@react-spring/three';
import * as drei from '@react-three/drei';
import * as fiber from '@react-three/fiber';
import { Mail, Lock, User } from 'lucide-react';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up:', formData);
    // Add your sign up logic here
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black">
        <div className="w-full max-w-md">
          {/* Form Card */}
          <div>
            <h2 className="text-3xl font-bold mb-2 font-mono text-white">Sign Up</h2>
            <p className="text-sm text-white/80 mb-6 font-mono">
              Create your account to get started
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Input */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/80 border-2 border-gray-700 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-gray-600 transition-colors font-mono"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="example@exmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/80 border-2 border-gray-700 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-gray-600 transition-colors font-mono"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/80 border-2 border-gray-700 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-gray-600 transition-colors font-mono"
                  required
                />
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/80 border-2 border-gray-700 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-gray-600 transition-colors font-mono"
                  required
                />
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full py-3 bg-white hover:bg-white/90 text-black font-bold rounded-full transition-colors font-mono text-lg shadow-lg mt-6"
              >
                Sign Up
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-white font-mono">
                Already have an account?{' '}
                <button 
                  onClick={handleSignIn}
                  className="underline hover:text-white/70 transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Thick black border extending to screen edges */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black">
        {/* White background container with shader and text, positioned with padding from edges */}
        <div className="absolute inset-0 p-12">
          <div className="relative w-full h-full bg-white rounded-[3rem] overflow-hidden">
            {/* Shader Background inside the white area */}
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

            {/* Centered text on top of shader */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl md:text-7xl font-bold tracking-[0.5rem] mb-2 font-mono text-black">
                  C y b e r S i m
                </h1>
                <p className="text-lg font-mono text-black">
                  - Simulating Threats to Strengthen Defenses
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;