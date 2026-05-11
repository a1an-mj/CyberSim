import React, { useState } from 'react';
import { CheckCircle2, X, Maximize2, Loader2 } from 'lucide-react';

function TestModel({ onAttackDetected, attack, onRunningChange }) {
  const [stage, setStage] = useState('initial');
  const [isZooming, setIsZooming] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0.45);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState(null);
  const [attackedFeatures, setAttackedFeatures] = useState(null);

  const [initialResult, setInitialResult] = useState({ prediction: 0, result: "Benign" });
  const [noiseResult, setNoiseResult] = useState({ prediction: 0, result: "Benign" });
  const [retrainedResult, setRetrainedResult] = useState({ prediction: 0, result: "Benign" });
  const [retrainedTestResult, setRetrainedTestResult] = useState({ prediction: 0, result: "Benign" });

  const notifyAttackStatus = (result) => {
    if (onAttackDetected) onAttackDetected(result.toLowerCase() !== 'benign');
  };
  
  const target = attack
  const FEATURES = [80,1293792,3,7,26,11607,20,0,8.666666667,10.26320288,5840,0,1658.142857,2137.29708,8991.398927,7.72921768,143754.6667,430865.8067,1292730,2,747,373.5,523.9661249,744,3,1293746,215624.3333,527671.9348,1292730,2,0,0,0,0,72,152,2.318765304,5.410452376,0,5840,1057.545455,1853.437529,3435230.673,0,0,0,1,0,0,0,0,2,1163.3,8.666666667,1658.142857,72,0,0,0,0,0,0,3,26,7,11607,8192,229,2,20,0,0,0,0,0,0,0,0];

  const sendPredictionRequest = async (endpoint, target) => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target })
      });
      const data = await response.json();
      if (!response.ok) { alert('Request failed: ' + (data.message || 'Unknown error')); setIsLoading(false); return null; }
      setIsLoading(false);
      return data;
    } catch (error) {
      alert('Error: ' + error.message);
      setIsLoading(false);
      return null;
    }
  };

  const handleInitialTest = async () => {
    console.log(attack)
    if (onRunningChange) onRunningChange(true);
    const result = await sendPredictionRequest('http://localhost:8000/predict', attack);
    if (result) {
      setSelectedFeatures(result.features[0]);    // ✅ STORE FEATURES

      setInitialResult({ 
      prediction: result.prediction, 
      result: result.result
  });

  notifyAttackStatus(result.result);
  handleExpand('noise');
}
  };

  const handleNoiseTest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        features: selectedFeatures,   // ✅ dynamic
        target: attack,
        noise: noiseLevel
        })    
      });
      const data = await response.json();
      if (!response.ok) { alert('Request failed: ' + (data.message || 'Unknown error')); setIsLoading(false); return; }
      setIsLoading(false);
      setNoiseResult({ 
        prediction: data.prediction, 
        result: data.result 
      });
      setAttackedFeatures(data.attacked_features);  
      notifyAttackStatus(data.result);


      

      handleExpand('results');
    } catch (error) {
      alert('Error: ' + error.message);
      setIsLoading(false);
    }
  };

const handleRetrain = async () => {
  if (!attackedFeatures) {
    alert("No attacked data available!");
    return;
  }

  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:8000/retrain-single', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        features: attackedFeatures,  // 🔥 KEY
        label: attack               // correct label
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert('Request failed: ' + (data.message || 'Unknown error'));
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setRetrainedResult({ prediction: 0, result: data.status || "Model updated" });

    handleExpand('retrained');

  } catch (error) {
    alert('Error: ' + error.message);
    setIsLoading(false);
  }
};

const handleRetrainedTest = async () => {
  if (!attackedFeatures) {
    alert("No attacked data available");
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/attack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        features: attackedFeatures,  
        target: attack,
        noise: 0                    
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert('Request failed');
      return;
    }

    setRetrainedTestResult({
      prediction: data.prediction,
      result: data.result
    });

    notifyAttackStatus(data.result);
    handleExpand('retrained_tested');

  } catch (error) {
    alert('Error: ' + error.message);
  }
};

  const handleExpand = (nextStage) => {
    setIsZooming(true);
    setTimeout(() => { setStage(nextStage); setIsZooming(false); }, 300);
  };

  // ── Shared sub-components ──────────────────────────────────────────────────

  const CardHeader = ({ showClose = false }) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-cyan-300/90 rounded-full p-2">
          <CheckCircle2 className="w-5 h-5 text-zinc-900" />
        </div>
        <h2 className="text-white font-medium text-lg">Test Model</h2>
      </div>
      {showClose ? (
        <button onClick={() => { setStage('initial'); if (onAttackDetected) onAttackDetected(false); }} className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90">
          <X className="w-5 h-5" />
        </button>
      ) : (
        <button className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110">
          <Maximize2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  const DatasetLabel = () => (
    <div className="font-mono text-sm">
      <span className="text-zinc-300">Current dataset : </span>
      <span className="text-orange-400">CICIDS-2021</span>
    </div>
  );

  const ResultBox = ({ prediction, result }) => (
    <div className="bg-zinc-900/60 rounded-lg p-4 border border-zinc-700/50">
      <div className="font-mono text-xs space-y-1">
        <div className="text-zinc-400">Prediction : <span className="text-red-400">{prediction}</span></div>
        <div className="text-zinc-400">Result&nbsp;&nbsp;&nbsp;&nbsp; : <span className="text-green-400">"{result}"</span></div>
      </div>
    </div>
  );

  const NoiseBar = () => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-mono text-sm text-zinc-300">Added noise level:</span>
        <span className="font-mono text-sm text-white">{noiseLevel.toFixed(2)}</span>
      </div>
      <div className="w-full h-2 bg-zinc-700 rounded-lg relative">
        <div className="h-full bg-white rounded-lg" style={{ width: `${noiseLevel * 100}%` }} />
      </div>
      <div className="flex justify-between text-xs text-zinc-500 font-mono"><span>0</span><span>1</span></div>
    </div>
  );

  const ActionButton = ({ onClick, disabled, loadingLabel, label }) => (
    <div className="flex justify-center">
      <button onClick={onClick} disabled={disabled}
        className="bg-white text-black px-8 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
        {disabled && <Loader2 className="w-4 h-4 animate-spin" />}
        {disabled ? loadingLabel : label}
      </button>
    </div>
  );

  const isAttack = (result) => result.toLowerCase() !== 'benign';

  const cardBg = (stage === 'noise' && isAttack(initialResult.result)) ||
                 (stage === 'results' && isAttack(noiseResult.result)) ||
                 (stage === 'retrained' && isAttack(noiseResult.result)) ||
                 (stage === 'retrained_tested' && isAttack(retrainedTestResult.result))
    ? 'bg-red-900/20'
    : 'bg-zinc-800/30';

  const cardClass = `relative overflow-hidden ${cardBg} backdrop-blur-sm rounded-2xl p-5 w-72 border border-zinc-600/60 shadow-2xl transition-colors duration-500`;

  return (
    <div className="relative">
      <style>{`
        @keyframes slideInScale {
          0% { opacity: 0; transform: scale(0.9) translateY(-10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes zoomIn {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .model-enter { animation: slideInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .model-zoom  { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        /* Range slider thumb styling to match the zinc palette */
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.15);
          transition: transform 0.15s ease;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        input[type='range']::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.15);
        }
      `}</style>

      {/* ── initial ── */}
      {stage === 'initial' && (
        <div className={`${cardClass} transition-all duration-300 ${isZooming ? 'model-zoom' : ''}`}>
          <CardHeader />
          <div className="space-y-4">
            <DatasetLabel />
            <ActionButton onClick={handleInitialTest} disabled={isLoading} loadingLabel="Testing..." label="Test" />
          </div>
        </div>
      )}

      {/* ── noise ── */}
      {stage === 'noise' && (
        <div className={`model-enter ${cardClass}`}>
          <CardHeader showClose />
          <div className="space-y-4">
            <DatasetLabel />
            <ResultBox prediction={initialResult.prediction} result={initialResult.result} />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-zinc-300">Add noise level:</span>
                <span className="font-mono text-sm text-white">{noiseLevel.toFixed(2)}</span>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-white" />
              <div className="flex justify-between text-xs text-zinc-500 font-mono"><span>0</span><span>1</span></div>
            </div>
            <ActionButton onClick={handleNoiseTest} disabled={isLoading} loadingLabel="Testing..." label="Test" />
          </div>
        </div>
      )}

      {/* ── results ── */}
      {stage === 'results' && (
        <div className={`model-enter ${cardClass}`}>
          <CardHeader showClose />
          <div className="space-y-4">
            <DatasetLabel />
            <ResultBox prediction={initialResult.prediction} result={initialResult.result} />
            <NoiseBar />
            <ResultBox prediction={noiseResult.prediction} result={noiseResult.result} />
            <ActionButton onClick={handleRetrain} disabled={isLoading} loadingLabel="Retraining..." label="Retrain" />
          </div>
        </div>
      )}

      {/* ── retrained ── */}
      {stage === 'retrained' && (
        <div className={`model-enter ${cardClass}`}>
          <CardHeader showClose />
          <div className="space-y-4">
            <DatasetLabel />
            <ResultBox prediction={initialResult.prediction} result={initialResult.result} />
            <NoiseBar />
            <ResultBox prediction={noiseResult.prediction} result={noiseResult.result} />
            <div className="space-y-2">
              <div className="font-mono text-sm text-white">Retrained model:</div>
              <ResultBox prediction={retrainedResult.prediction} result={retrainedResult.result} />
            </div>
            <ActionButton onClick={handleRetrainedTest} disabled={isLoading} loadingLabel="Testing..." label="Test" />
          </div>
        </div>
      )}

      {/* ── retrained_tested ── */}
      {stage === 'retrained_tested' && (
        <div className={`model-enter ${cardClass}`}>
          <CardHeader showClose />
          <div className="space-y-4">
            <DatasetLabel />
            <ResultBox prediction={initialResult.prediction} result={initialResult.result} />
            <NoiseBar />
            <ResultBox prediction={noiseResult.prediction} result={noiseResult.result} />
            <div className="space-y-2">
              <div className="font-mono text-sm text-white">Retrained model:</div>
              <ResultBox prediction={retrainedResult.prediction} result={retrainedResult.result} />
            </div>
            <div className="space-y-2">
              <div className="font-mono text-sm text-white">Retrained model test:</div>
              <ResultBox prediction={retrainedTestResult.prediction} result={retrainedTestResult.result} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestModel;