import React, { useState } from 'react';
import { Shield, X, Maximize2 } from 'lucide-react';

function AttackSelector() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [isZooming, setIsZooming] = useState(false);

  const attackGroups = [
    {
      category: "Traditional Network Attacks",
      attacks: [
        { name: "DoS", fullName: "Traditional Network -DoS" },
        { name: "MitM", fullName: "Traditional Network -MitM" }
      ]
    },
    {
      category: "Gradient-based AML",
      attacks: [
        { name: "FGSM", fullName: "Gradient-based AML -FGSM" },
        { name: "BIM", fullName: "Gradient-based AML -BIM" },
        { name: "PGD", fullName: "Gradient-based AML -PGD" }
      ]
    },
    {
      category: "GAN-based Attacks",
      attacks: [
        { name: "IDSGAN-style", fullName: "GAN-based -IDSGAN-style" }
      ]
    },
    {
      category: "Evaluation Attacks",
      attacks: [
        { name: "Transferability testing", fullName: "Evaluation Attack -Transferability testing" }
      ]
    }
  ];

  const handleExpand = () => {
    setIsZooming(true);
    setTimeout(() => {
      setIsExpanded(true);
      setIsZooming(false);
    }, 300);
  };

  const handleSelectAttack = (attack) => {
    setSelectedAttack(attack);
    setIsExpanded(false);
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
        
        .attack-enter {
          animation: slideInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .attack-zoom {
          animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      
      {!isExpanded ? (
        // Compact View
        <div className={`bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 w-80 border border-zinc-700 shadow-2xl transition-all duration-300 ${isZooming ? 'attack-zoom' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-700 rounded-full p-2 transition-all duration-300 hover:bg-zinc-600">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white font-medium text-lg">Chose Attacks</h2>
            </div>
            <button 
              onClick={handleExpand}
              className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="font-mono text-sm text-zinc-300 pl-2">
            {selectedAttack ? selectedAttack.name : 'none'}
          </div>
        </div>
      ) : (
        // Expanded View
        <div className="attack-enter bg-gradient-to-b from-zinc-800/70 to-zinc-900/70 backdrop-blur-sm rounded-2xl p-6 w-fit min-w-80 max-w-md border border-zinc-700 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-700 rounded-full p-2 transition-all duration-300 hover:bg-zinc-600">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white font-medium text-lg">Chose Attacks</h2>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {attackGroups.map((group, groupIndex) => (
              <div 
                key={groupIndex}
                style={{
                  animation: `slideInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards ${groupIndex * 0.05}s`,
                  opacity: 0
                }}
              >
                <div className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2 px-2">
                  {group.category}
                </div>
                <div className="space-y-1">
                  {group.attacks.map((attack, attackIndex) => (
                    <button
                      key={attackIndex}
                      onClick={() => handleSelectAttack(attack)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-300 group hover:scale-105 hover:shadow-lg font-mono text-sm ${
                        selectedAttack?.name === attack.name
                          ? 'bg-zinc-800 text-green-500'
                          : 'hover:bg-zinc-800 text-white group-hover:text-green-400'
                      }`}
                    >
                      {attack.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AttackSelector;