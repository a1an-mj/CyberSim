import React, { useState } from 'react';
import { Wifi, X, Maximize2, Loader2 } from 'lucide-react';

function WifiSelector() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [connectedNetwork, setConnectedNetwork] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [connectionData, setConnectionData] = useState({
    connected: "none",
    range: "0%",
    dataSpeed: "0 B/s"
  });

  const networks = [
    { name: "JioJioButNoNet", strength: 95, speed: "450 Mbps" },
    { name: "AirtelButSlow", strength: 80, speed: "120 Mbps" },
    { name: "NeighbourWiFi", strength: 15, speed: "10 Mbps" },
    { name: "MachaNet", strength: 15, speed: "8 Mbps" }
  ];

  const handleExpand = () => {
    setIsZooming(true);
    setTimeout(() => {
      setIsExpanded(true);
      setIsZooming(false);
    }, 300);
  };

  const handleConnect = (network) => {
    setConnectedNetwork(network.name);
    setConnectionData({
      connected: `"${network.name}"`,
      range: `"${network.strength}%"`,
      dataSpeed: `"${network.speed}"`
    });
    setIsExpanded(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
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
        
        .wifi-enter {
          animation: slideInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .wifi-zoom {
          animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      
      {!isExpanded ? (
        // Compact View
        <div className={`bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 w-80 border border-zinc-700 shadow-2xl transition-all duration-300 ${isZooming ? 'wifi-zoom' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-700 rounded-full p-2 transition-all duration-300 hover:bg-zinc-600">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white font-medium text-lg">Chose Wifi</h2>
            </div>
            <button 
              onClick={handleExpand}
              className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 font-mono text-sm">
            <div className="text-zinc-300 transition-all duration-300 hover:text-white">
              <span className="text-zinc-400">Connected:</span> {connectionData.connected}
            </div>
            <div className="text-zinc-300 transition-all duration-300 hover:text-white">
              <span className="text-zinc-400">Range:</span> {connectionData.range}
            </div>
            <div className="text-zinc-300 transition-all duration-300 hover:text-white">
              <span className="text-zinc-400">Data Speed:</span> {connectionData.dataSpeed}
            </div>
          </div>
        </div>
      ) : (
        // Expanded View
        <div className="wifi-enter bg-gradient-to-b from-zinc-800/70 to-zinc-900/70 backdrop-blur-sm rounded-2xl p-6 w-80 border border-zinc-700 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-700 rounded-full p-2 transition-all duration-300 hover:bg-zinc-600">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white font-medium text-lg">Available networks:</h2>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {networks.map((network, index) => (
              <button
                key={index}
                onClick={() => handleConnect(network)}
                style={{
                  animation: `slideInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards ${index * 0.05}s`,
                  opacity: 0
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800 transition-all duration-300 group hover:scale-105 hover:shadow-lg"
              >
                <span className={`font-mono text-sm transition-all duration-300 ${
                  network.name === connectedNetwork 
                    ? 'text-green-500' 
                    : 'text-white group-hover:text-green-400'
                }`}>
                  {network.name}
                </span>
                <span className={`font-mono text-sm font-semibold transition-all duration-300 ${
                  network.name === connectedNetwork 
                    ? 'text-green-500' 
                    : 'text-white group-hover:text-green-400'
                }`}>
                  {network.strength}%
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 hover:shadow-lg"
            >
              {isRefreshing && <Loader2 className="w-4 h-4 animate-spin" />}
              Refresh
            </button>
            <button className="text-zinc-400 hover:text-white transition-all duration-300 p-2 hover:scale-110 hover:bg-zinc-800 rounded-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WifiSelector;