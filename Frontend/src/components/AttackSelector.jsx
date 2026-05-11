import React, { useState } from 'react';
import { Shield, X, Maximize2 } from 'lucide-react';

function AttackSelector({ sattack }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [isZooming, setIsZooming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


const attackGroups = [
  {
    category: "Benign",
    attacks: [
      {
        name: "BENIGN",
        fullName: "BENIGN",
        description: `Normal, safe network traffic that occurs during everyday use of devices and servers. There is no hacking or malicious activity involved. This data serves as a baseline so security systems can learn what regular behavior looks like and better spot suspicious activity.`
      }
    ]
  },
  {
    category: "DoS / DDoS",
    attacks: [
      {
        name: "Bot",
        fullName: "Bot",
        description: `A bot attack uses computers or devices secretly infected and controlled by an attacker. These compromised machines can automatically send spam, scan networks, or collectively launch massive cyber attacks. Often, owners are unaware their device is part of a botnet. Bot attacks are commonly used to flood websites and spread harmful activities online.`
      },
      {
        name: "DDoS",
        fullName: "DDoS",
        description: `A Distributed Denial of Service attack overwhelms a website or server with a flood of fake traffic, making it inaccessible to real users. This is done by using many compromised devices simultaneously. DDoS attacks frequently target big companies, gaming servers, and popular online services.`
      },
      {
        name: "DoS GoldenEye",
        fullName: "DoS GoldenEye",
        description: `GoldenEye is a DoS attack that bombards web servers with a huge volume of fake requests to drain their resources. This causes the website to slow down or crash entirely. The requests are crafted specifically to keep the server under constant stress, severely affecting performance and user experience.`
      },
      {
        name: "DoS Hulk",
        fullName: "DoS Hulk",
        description: `DoS Hulk aggressively sends continuous, massive traffic to a server by generating random requests at high speed. This consumes bandwidth, memory, and processing power, eventually causing the website to stop responding to genuine users. It is one of the more powerful denial-of-service methods targeting web applications.`
      },
      {
        name: "DoS Slowhttptest",
        fullName: "DoS Slowhttptest",
        description: `This attack works slowly by holding many connections open for a long time, quietly exhausting the server's ability to accept new ones. Rather than flooding with traffic, it uses minimal bandwidth, which can help it evade basic detection. The end result is the same—legitimate users find the website inaccessible.`
      },
      {
        name: "DoS slowloris",
        fullName: "DoS slowloris",
        description: `Slowloris attacks by sending incomplete HTTP requests and keeping them open as long as possible, causing the server to wait and eventually run out of available connections. Even a small amount of traffic can disable a vulnerable server. It's dangerous because it's simple, effective, and often hard to detect promptly.`
      }
    ]
  },
  {
    category: "Brute Force",
    attacks: [
      {
        name: "FTP-Patator",
        fullName: "FTP-Patator",
        description: `FTP-Patator is a brute force attack that repeatedly tries username and password combinations to break into FTP servers. Attackers aim to guess correct login details and gain unauthorized entry. Weak passwords greatly increase the success rate. Once inside, attackers can steal, change, or delete crucial files.`
      },
      {
        name: "SSH-Patator",
        fullName: "SSH-Patator",
        description: `SSH-Patator targets secure remote login systems (SSH) by repeatedly testing passwords until it finds the right one. Servers with weak or reused passwords are especially at risk. A successful break-in can give attackers full remote control over the system.`
      }
    ]
  },
  {
    category: "Infiltration & Scanning",
    attacks: [
      {
        name: "Heartbleed",
        fullName: "Heartbleed",
        description: `Heartbleed is a critical bug in some versions of OpenSSL that lets attackers secretly read a server's memory. This can expose sensitive data like passwords, encryption keys, and private user information. It became one of the most famous internet security vulnerabilities in history.`
      },
      {
        name: "Infiltration",
        fullName: "Infiltration",
        description: `Infiltration is when attackers sneak into a network without authorization. They typically use malware, backdoors, or already compromised devices to remain hidden. Once inside, they can steal data, spy on activity, or move deeper into the network. These attacks are especially dangerous because they can go unnoticed for a long time.`
      },
      {
        name: "PortScan",
        fullName: "PortScan",
        description: `Port scanning is a method used to discover which services are active on a system by probing its network ports. Attackers use it to find weak spots and vulnerable applications before launching a bigger attack. Security professionals also use port scans to check and strengthen their own defenses.`
      }
    ]
  },
  {
    category: "Web Attacks",
    attacks: [
      {
        name: "Brute Force",
        fullName: "Web Attack – Brute Force",
        description: `This web attack repeatedly guesses usernames and passwords on a website’s login page to gain unauthorized access. Weak passwords or lack of account lockout mechanisms make it much easier. Attackers often target admin panels, online banking, and any login-based system.`
      },
      {
        name: "Sql Injection",
        fullName: "Web Attack – Sql Injection",
        description: `SQL Injection occurs when attackers insert harmful database commands into website input fields. If the site lacks proper security, they can directly manipulate or access the backend database, potentially exposing usernames, passwords, and financial data. It remains one of the most critical threats to web applications.`
      },
      {
        name: "XSS",
        fullName: "Web Attack – XSS",
        description: `Cross-site scripting (XSS) lets attackers inject harmful scripts into web pages. When other users visit the page, the malicious code runs in their browser, allowing the attacker to steal session cookies, track activity, or redirect them to unsafe sites. This happens when websites don't properly check user input.`
      }
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

  const handleSelectAttack = async (attack) => {
  setSelectedAttack(attack);
  setIsExpanded(false);
  sattack(attack);          // ← pass full object, not attack.name
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
              <h2 className="text-white font-medium text-lg">Choose Attack</h2>
            </div>
            <button 
              onClick={handleExpand}
              className="text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="font-mono text-sm text-zinc-300 pl-2">
            {isLoading ? 'Loading...' : selectedAttack ? selectedAttack.name : 'none'}
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
              <h2 className="text-white font-medium text-lg">Choose Attack</h2>
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