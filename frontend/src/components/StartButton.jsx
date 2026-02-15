import React, { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';

function StartButton() {
  const [status, setStatus] = useState('idle'); // 'idle', 'starting', 'started'

  const handleStart = () => {
    if (status === 'idle') {
      setStatus('starting');
      setTimeout(() => {
        setStatus('started');
      }, 3000);
    }
  };

  const handleReset = () => {
    setStatus('idle');
  };

  return (
    <div className="relative">
      <style jsx>{`
        @keyframes rollToLeft {
          0% {
            transform: translateX(0) rotate(0deg);
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateX(-154px) rotate(-720deg);
            opacity: 0;
          }
        }
        
        @keyframes fadeInLeft {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .roll-left {
          animation: rollToLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .fade-in-left {
          animation: fadeInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.6s;
          opacity: 0;
        }
      `}</style>

      {status === 'idle' && (
        <button
          onClick={handleStart}
          className="group bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-full px-5 py-2.5 border border-zinc-700 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-between gap-3 min-w-[196px]"
        >
          <span className="text-base font-mono text-zinc-200 font-semibold">Start</span>
          <div className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-full p-2.5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
            <Play className="w-4 h-4 text-zinc-900 fill-zinc-900" />
          </div>
        </button>
      )}

      {status === 'starting' && (
        <button
          disabled
          className="bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-full px-5 py-2.5 border border-zinc-700 shadow-2xl flex items-center justify-between gap-3 min-w-[196px] cursor-wait"
        >
          <span className="text-base font-mono text-zinc-200 font-semibold">Starting..</span>
          <div className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-full p-2.5">
            <Loader2 className="w-4 h-4 text-zinc-900 animate-spin" />
          </div>
        </button>
      )}

      {status === 'started' && (
        <button
          onClick={handleReset}
          className="group bg-gradient-to-b from-zinc-800/70 to-zinc-900/70 backdrop-blur-sm rounded-full px-5 py-2.5 border border-zinc-700 shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3 min-w-[196px] relative overflow-hidden"
        >
          {/* Rolling icon that disappears */}
          <div className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-full p-2.5 shadow-lg absolute right-5 roll-left">
            <Play className="w-4 h-4 text-zinc-900 fill-zinc-900" />
          </div>
          
          {/* Final green icon on the left */}
          <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-full p-2.5 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-green-500/50 fade-in-left">
            <Play className="w-4 h-4 text-zinc-900 fill-zinc-900" />
          </div>
          <span className="text-base font-mono text-green-400 font-semibold fade-in-left">Started</span>
        </button>
      )}
    </div>
  );
}

export default StartButton;