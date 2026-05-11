import React from 'react';
import { ShieldAlert } from 'lucide-react';

function AttackInfoCard({ sattack }) {
  const hasAttack = sattack && sattack.fullName;
  const name = hasAttack ? sattack.fullName : 'No attack selected';
  const description = hasAttack
    ? sattack.description
    : 'Select an attack to view detailed information.';

  return (
    <div className="bg-zinc-800/30 backdrop-blur-sm rounded-2xl border border-zinc-600/60 shadow-2xl p-6 w-[400px] transition-colors duration-500">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-700 rounded-full p-2">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-white font-medium text-lg">Attack Info</h2>
        </div>
      </div>

      <div className="space-y-4">
        {/* Selected attack row */}
        <div className="font-mono text-sm">
          <span className="text-zinc-300">Selected attack : </span>
          <span className="text-orange-400">{name}</span>
        </div>

        {/* Description box */}
        <div className="bg-zinc-900/60 rounded-lg p-5 border border-zinc-700/50">
          <div className="font-mono text-xs text-zinc-400 uppercase tracking-wider mb-3">
            Description
          </div>
          <p className={`text-sm leading-relaxed whitespace-pre-line ${hasAttack ? 'text-zinc-200' : 'text-zinc-500 italic'}`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AttackInfoCard;