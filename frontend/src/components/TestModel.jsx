import React, { useState } from 'react';
import { CheckCircle2, X, Maximize2, Loader2 } from 'lucide-react';

function TestModel() {
  const [stage, setStage] = useState('initial'); // 'initial', 'noise', 'results', 'retrained'
  const [isZooming, setIsZooming] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0.45);
  const [isLoading, setIsLoading] = useState(false);
  
  // Store API responses
  const [initialResult, setInitialResult] = useState({ prediction: 0, result: "Benign" });
  const [noiseResult, setNoiseResult] = useState({ prediction: 0, result: "Benign" });
  const [retrainedResult, setRetrainedResult] = useState({ prediction: 0, result: "Benign" });

  // API request function
  const sendPredictionRequest = async (endpoint, features) => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: features
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API request failed:', data);
        alert('Request failed: ' + (data.message || 'Unknown error'));
        setIsLoading(false);
        return null;
      }

      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error making request:', error);
      alert('Error: ' + error.message);
      setIsLoading(false);
      return null;
    }
  };

  const handleInitialTest = async () => {
    // TODO: Replace with your actual features array
    const features = [80,1293792,3,7,26,11607,20,0,8.666666667,10.26320288,5840,0,1658.142857,2137.29708,8991.398927,7.72921768,143754.6667,430865.8067,1292730,2,747,373.5,523.9661249,744,3,1293746,215624.3333,527671.9348,1292730,2,0,0,0,0,72,152,2.318765304,5.410452376,0,5840,1057.545455,1853.437529,3435230.673,0,0,0,1,0,0,0,0,2,1163.3,8.666666667,1658.142857,72,0,0,0,0,0,0,3,26,7,11607,8192,229,2,20,0,0,0,0,0,0,0,0]; // Example features
    
    const result = await sendPredictionRequest('http://localhost:8000/predict', features);
    
    if (result) {
      console.log('Initial test result:', result);
      setInitialResult({
        prediction: result.prediction,
        result: result.result
      });
      handleExpand('noise');
    }
  };

  const handleNoiseTest = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with your actual features array
      const features = [80,1293792,3,7,26,11607,20,0,8.666666667,10.26320288,5840,0,1658.142857,2137.29708,8991.398927,7.72921768,143754.6667,430865.8067,1292730,2,747,373.5,523.9661249,744,3,1293746,215624.3333,527671.9348,1292730,2,0,0,0,0,72,152,2.318765304,5.410452376,0,5840,1057.545455,1853.437529,3435230.673,0,0,0,1,0,0,0,0,2,1163.3,8.666666667,1658.142857,72,0,0,0,0,0,0,3,26,7,11607,8192,229,2,20,0,0,0,0,0,0,0,0]; // Example features
      
      const response = await fetch('http://localhost:8000/attack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: features
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API request failed:', data);
        alert('Request failed: ' + (data.message || 'Unknown error'));
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      console.log('Noise test result:', data);
      setNoiseResult({
        prediction: data.prediction,
        result: data.result
      });
      handleExpand('results');
    } catch (error) {
      console.error('Error making request:', error);
      alert('Error: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleRetrain = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/retrain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API request failed:', data);
        alert('Request failed: ' + (data.message || 'Unknown error'));
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      console.log('Retrain result:', data);
      
      // Store the status message instead of prediction/result
      setRetrainedResult({
        prediction: 0,
        result: data.status || "Model trained"
      });
      
      handleExpand('retrained');
    } catch (error) {
      console.error('Error making request:', error);
      alert('Error: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleExpand = (nextStage) => {
    setIsZooming(true);
    setTimeout(() => {
      setStage(nextStage);
      setIsZooming(false);
    }, 300);
  };

  return (
    <div className="relative">
      <style jsx>{`
        @keyframes slideInScale {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes zoomIn {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .model-enter {
          animation: slideInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .model-zoom {
          animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      
      {stage === 'initial' && (
        // Initial Stage - Just Test button
        <div className={`bg-gradient-to-b from-zinc-700/80 to-zinc-800/80 backdrop-blur-sm rounded-2xl p-6 w-80 border border-zinc-600 shadow-2xl transition-all duration-300 ${isZooming ? 'model-zoom' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-300/90 rounded-full p-2">
                <CheckCircle2 className="w-5 h-5 text-zinc-900" />
              </div>
              <h2 className="text-white font-medium text-lg">Test Model</h2>
            </div>
            <button className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="font-mono text-sm">
              <span className="text-zinc-300">Current dataset : </span>
              <span className="text-orange-400">CICIDS-2021</span>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={handleInitialTest}
                disabled={isLoading}
                className="bg-white text-black px-8 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Testing...' : 'Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'noise' && (
        // Noise Level Stage
        <div className="model-enter bg-gradient-to-b from-zinc-700/80 to-zinc-800/80 backdrop-blur-sm rounded-2xl p-6 w-80 border border-zinc-600 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-300/90 rounded-full p-2">
                <CheckCircle2 className="w-5 h-5 text-zinc-900" />
              </div>
              <h2 className="text-white font-medium text-lg">Test Model</h2>
            </div>
            <button 
              onClick={() => setStage('initial')}
              className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="font-mono text-sm">
              <span className="text-zinc-300">Current dataset : </span>
              <span className="text-orange-400">CICIDS-2021</span>
            </div>

            <div className="bg-zinc-900/60 rounded-lg p-4">
              <div className="font-mono text-xs space-y-1 mb-3">
                <div className="text-zinc-400">Prediction : <span className="text-red-400">{initialResult.prediction}</span></div>
                <div className="text-zinc-400">Result&nbsp;&nbsp;&nbsp;&nbsp; : <span className="text-green-400">"{initialResult.result}"</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-zinc-300">Add noise level:</span>
                <span className="font-mono text-sm text-white">{noiseLevel.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-xs text-zinc-500 font-mono">
                <span>0</span>
                <span>1</span>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={handleNoiseTest}
                disabled={isLoading}
                className="bg-white text-black px-8 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Testing...' : 'Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'results' && (
        // Results Stage - Two result boxes
        <div className="model-enter bg-gradient-to-b from-zinc-700/80 to-zinc-800/80 backdrop-blur-sm rounded-2xl p-6 w-80 border border-zinc-600 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-300/90 rounded-full p-2">
                <CheckCircle2 className="w-5 h-5 text-zinc-900" />
              </div>
              <h2 className="text-white font-medium text-lg">Test Model</h2>
            </div>
            <button 
              onClick={() => setStage('initial')}
              className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="font-mono text-sm">
              <span className="text-zinc-300">Current dataset : </span>
              <span className="text-orange-400">CICIDS-2021</span>
            </div>

            <div className="bg-zinc-900/60 rounded-lg p-4">
              <div className="font-mono text-xs space-y-1">
                <div className="text-zinc-400">Prediction : <span className="text-red-400">{initialResult.prediction}</span></div>
                <div className="text-zinc-400">Result&nbsp;&nbsp;&nbsp;&nbsp; : <span className="text-green-400">"{initialResult.result}"</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-zinc-300">Added noise level:</span>
                <span className="font-mono text-sm text-white">{noiseLevel.toFixed(2)}</span>
              </div>
              <div className="w-full h-2 bg-zinc-700 rounded-lg relative">
                <div 
                  className="h-full bg-white rounded-lg"
                  style={{ width: `${noiseLevel * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-zinc-500 font-mono">
                <span>0</span>
                <span>1</span>
              </div>
            </div>

            <div className="bg-zinc-900/60 rounded-lg p-4">
              <div className="font-mono text-xs space-y-1">
                <div className="text-zinc-400">Prediction : <span className="text-red-400">{noiseResult.prediction}</span></div>
                <div className="text-zinc-400">Result&nbsp;&nbsp;&nbsp;&nbsp; : <span className="text-green-400">"{noiseResult.result}"</span></div>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={handleRetrain}
                disabled={isLoading}
                className="bg-white text-black px-8 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Retraining...' : 'Retrain'}
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'retrained' && (
        // Retrained Model Stage
        <div className="model-enter bg-gradient-to-b from-zinc-700/80 to-zinc-800/80 backdrop-blur-sm rounded-2xl p-6 w-80 border border-zinc-600 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-300/90 rounded-full p-2">
                <CheckCircle2 className="w-5 h-5 text-zinc-900" />
              </div>
              <h2 className="text-white font-medium text-lg">Test Model</h2>
            </div>
            <button 
              onClick={() => setStage('initial')}
              className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="font-mono text-sm">
              <span className="text-zinc-300">Current dataset : </span>
              <span className="text-orange-400">CICIDS-2021</span>
            </div>

            <div className="bg-zinc-900/60 rounded-lg p-4">
              <div className="font-mono text-xs space-y-1">
                <div className="text-zinc-400">Prediction : <span className="text-red-400">{initialResult.prediction}</span></div>
                <div className="text-zinc-400">Result&nbsp;&nbsp;&nbsp;&nbsp; : <span className="text-green-400">"{initialResult.result}"</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-zinc-300">Added noise level:</span>
                <span className="font-mono text-sm text-white">{noiseLevel.toFixed(2)}</span>
              </div>
              <div className="w-full h-2 bg-zinc-700 rounded-lg relative">
                <div 
                  className="h-full bg-white rounded-lg"
                  style={{ width: `${noiseLevel * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-zinc-500 font-mono">
                <span>0</span>
                <span>1</span>
              </div>
            </div>

            <div className="bg-zinc-900/60 rounded-lg p-4">
              <div className="font-mono text-xs space-y-1">
                <div className="text-zinc-400">Prediction : <span className="text-red-400">{noiseResult.prediction}</span></div>
                <div className="text-zinc-400">Result&nbsp;&nbsp;&nbsp;&nbsp; : <span className="text-green-400">"{noiseResult.result}"</span></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-mono text-sm text-white">Retrained model:</div>
              <div className="bg-zinc-900/60 rounded-lg p-4">
                <div className="font-mono text-xs space-y-1">
                  <div className="text-zinc-400">Prediction : <span className="text-red-400">{retrainedResult.prediction}</span></div>
                  <div className="text-zinc-400">Result&nbsp;&nbsp;&nbsp;&nbsp; : <span className="text-green-400">"{retrainedResult.result}"</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestModel;