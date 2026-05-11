import React, { useState } from 'react';
import { Star, X, Maximize2 } from 'lucide-react';

function StatusMonitor({ isRunning = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [status, setStatus] = useState('not running'); // 'not running' or 'running'

  const logs = [
    {
      timestamp: '2026-02-15 16:12:03',
      alert: 'ALERT: DoS Attack Detected',
      sourceIP: '192.168.1.45',
      destinationIP: '192.168.1.10',
      protocol: 'TCP',
      destinationPort: '80',
      packetRate: '15820 packets/sec',
      status: 'BLOCKED'
    },
    {
      timestamp: '2026-02-15 16:11:45',
      alert: 'ALERT: MitM Attack Detected',
      sourceIP: '192.168.1.67',
      destinationIP: '192.168.1.10',
      protocol: 'TCP',
      destinationPort: '443',
      packetRate: '8920 packets/sec',
      status: 'BLOCKED'
    },
    {
      timestamp: '2026-02-15 16:10:22',
      alert: 'ALERT: Port Scan Detected',
      sourceIP: '192.168.1.89',
      destinationIP: '192.168.1.10',
      protocol: 'TCP',
      destinationPort: 'Multiple',
      packetRate: '3450 packets/sec',
      status: 'MONITORING'
    },
    {
      timestamp: '2026-02-15 16:09:15',
      alert: 'ALERT: SQL Injection Attempt',
      sourceIP: '192.168.1.112',
      destinationIP: '192.168.1.10',
      protocol: 'HTTP',
      destinationPort: '80',
      packetRate: '2100 packets/sec',
      status: 'BLOCKED'
    },
    {
      timestamp: '2026-02-15 16:08:40',
      alert: 'ALERT: Brute Force Attack',
      sourceIP: '192.168.1.134',
      destinationIP: '192.168.1.10',
      protocol: 'SSH',
      destinationPort: '22',
      packetRate: '5600 packets/sec',
      status: 'BLOCKED'
    },
    {
      timestamp: '2026-02-15 16:07:30',
      alert: 'ALERT: XSS Attack Detected',
      sourceIP: '192.168.1.156',
      destinationIP: '192.168.1.10',
      protocol: 'HTTPS',
      destinationPort: '443',
      packetRate: '1800 packets/sec',
      status: 'MONITORING'
    }
  ];

  const handleExpand = () => {
    setIsZooming(true);
    setTimeout(() => {
      setIsExpanded(true);
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
        
        .status-enter {
          animation: slideInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .status-zoom {
          animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #27272a;
          border-radius: 5px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #52525b;
          border-radius: 5px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #71717a;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #52525b #27272a;
        }
      `}</style>
      
      {!isExpanded ? (
        // Compact View
        <div className={`bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 w-80 border border-zinc-700 shadow-2xl transition-all duration-300 ${isZooming ? 'status-zoom' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-700 rounded-full p-2 transition-all duration-300 hover:bg-zinc-600">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white font-medium text-lg">Current Status</h2>
            </div>
            <button 
              onClick={handleExpand}
              className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="font-mono text-sm">
            <div className="text-zinc-300">
              <span className="text-zinc-400">Status:</span> <span className={isRunning ? 'text-green-400' : 'text-zinc-500'}>
  {isRunning ? 'running' : 'not running'}
</span>
            </div>
          </div>
        </div>
      ) : (
        // Expanded View
        <div className="status-enter bg-gradient-to-b from-zinc-800/70 to-zinc-900/70 backdrop-blur-sm rounded-2xl p-5 w-fit border border-zinc-600 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-700 rounded-full p-2 transition-all duration-300 hover:bg-zinc-600">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white font-medium text-lg">Current Status</h2>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Status Line */}
            <div className="font-mono text-sm">
              <span className="text-zinc-400">Status:</span> <span className={isRunning ? 'text-green-400' : 'text-zinc-500'}>
  {isRunning ? 'running' : 'not running'}
</span>
            </div>

            {/* Logs Section */}
            <div className="space-y-2">
              <div className="text-zinc-400 font-mono text-sm">logs:</div>
              <div className="bg-zinc-900/60 rounded-lg p-3 h-[140px] overflow-y-auto scrollbar-thin" style={{ overflowY: 'scroll' }}>
                {logs.map((log, index) => (
                  <div 
                    key={index}
                    style={{
                      animation: `slideInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards ${index * 0.1}s`,
                      opacity: 0
                    }}
                    className="font-mono text-xs leading-relaxed mb-2 last:mb-0"
                  >
                    <div className="text-zinc-400">
                      [{log.timestamp}] <span className="text-red-400">{log.alert}</span>
                    </div>
                    <div className="text-zinc-400 ml-4">Source IP: {log.sourceIP}</div>
                    <div className="text-zinc-400 ml-4">Destination IP: {log.destinationIP}</div>
                    <div className="text-zinc-400 ml-4">Protocol: {log.protocol}</div>
                    <div className="text-zinc-400 ml-4">Destination Port: {log.destinationPort}</div>
                    <div className="text-zinc-400 ml-4">Packet Rate: {log.packetRate}</div>
                    <div className="text-zinc-400 ml-4">Status: {log.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusMonitor;