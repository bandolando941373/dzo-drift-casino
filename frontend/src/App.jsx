import React, { useState, useEffect } from 'react';

export default function App() {
  // Game & Economy State
  const [balance, setBalance] = useState(5000); // DrifterChips
  const [pot, setPot] = useState(1500);
  const [gameStatus, setGameStatus] = useState("Your Turn");
  
  // Hand States
  const [dealerHand, setDealerHand] = useState([
    { rank: 'K', suit: '♠', color: 'text-slate-900', hidden: false },
    { rank: '?', suit: '🎴', color: 'text-red-500', hidden: true }
  ]);
  
  const [playerHand, setPlayerHand] = useState([
    { rank: 'A', suit: '♠', color: 'text-slate-900', hidden: false },
    { rank: '10', suit: '♦', color: 'text-red-600', hidden: false }
  ]);

  // Initialize Discord Embedded Activity SDK
  useEffect(() => {
    if (window.Discord && window.Discord.DiscordSDK) {
      const discordSdk = new window.Discord.DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
      discordSdk.ready().then(() => {
        console.log("Discord Embedded Activity initialized successfully");
      }).catch(console.error);
    }
  }, []);

  // Action Handlers
  const handleHit = () => {
    if (balance < 100) return;
    const suits = [
      { suit: '♠', color: 'text-slate-900' },
      { suit: '♥', color: 'text-red-600' },
      { suit: '♣', color: 'text-slate-900' },
      { suit: '♦', color: 'text-red-600' }
    ];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
    
    setPlayerHand(prev => [...prev, { rank: randomRank, suit: randomSuit.suit, color: randomSuit.color, hidden: false }]);
    setBalance(prev => prev - 100);
    setPot(prev => prev + 100);
  };

  const handleFold = () => {
    setGameStatus("Folded");
    setTimeout(() => {
      setPlayerHand([
        { rank: '8', suit: '♣', color: 'text-slate-900', hidden: false },
        { rank: 'J', suit: '♥', color: 'text-red-600', hidden: false }
      ]);
      setPot(500);
      setGameStatus("Your Turn");
    }, 1200);
  };

  return (
    <div className="w-full h-dvh bg-emerald-950 text-white flex flex-col justify-between p-2 sm:p-4 select-none overflow-hidden font-sans">
      
      {/* 1. TOP HEADER: Currency & Match Info */}
      <div className="flex justify-between items-center bg-black/60 border border-emerald-800/60 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md">
        <div className="flex items-center gap-1">
          <span className="text-gray-400">Chips:</span>
          <span className="text-emerald-400 font-bold">${balance.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-400">Pot:</span>
          <span className="text-yellow-400 font-bold">${pot.toLocaleString()}</span>
        </div>
      </div>

      {/* 2. CENTER FELT TABLE */}
      <div className="flex-1 my-2 border-2 border-emerald-600/40 rounded-3xl bg-gradient-to-b from-emerald-900/80 to-emerald-950/90 p-3 flex flex-col justify-between items-center relative min-h-0 shadow-inner">
        
        {/* Dealer Area */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-emerald-300 font-semibold bg-black/30 px-2.5 py-0.5 rounded-full">
            Dealer
          </span>
          <div className="flex gap-1.5 justify-center transform scale-90 sm:scale-100 transition-all">
            {dealerHand.map((card, index) => (
              <div 
                key={index} 
                className={`w-12 h-16 sm:w-16 sm:h-22 rounded-lg flex flex-col items-center justify-center font-bold text-sm sm:text-base shadow-lg border ${
                  card.hidden 
                    ? 'bg-red-700 border-red-400 text-white' 
                    : 'bg-white border-gray-200 ' + card.color
                }`}
              >
                <div>{card.rank}</div>
                <div className="text-base sm:text-lg">{card.suit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Game Status Badge */}
        <div className="my-auto">
          <span className="text-xs sm:text-sm bg-black/70 border border-yellow-500/40 text-yellow-300 px-4 py-1 rounded-full uppercase tracking-widest font-bold shadow-lg">
            {gameStatus}
          </span>
        </div>

        {/* Player Area */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1.5 justify-center transform scale-90 sm:scale-100 transition-all">
            {playerHand.map((card, index) => (
              <div 
                key={index} 
                className={`w-12 h-16 sm:w-16 sm:h-22 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center font-bold text-sm sm:text-base shadow-lg ${card.color}`}
              >
                <div>{card.rank}</div>
                <div className="text-base sm:text-lg">{card.suit}</div>
              </div>
            ))}
          </div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-emerald-300 font-semibold bg-black/30 px-2.5 py-0.5 rounded-full">
            You
          </span>
        </div>

      </div>

      {/* 3. ACTION CONTROLS */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pt-1">
        <button 
          onClick={handleFold}
          className="bg-red-600 hover:bg-red-700 active:scale-95 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md border-b-2 border-red-800 transition-all"
        >
          Fold
        </button>
        <button 
          onClick={() => setPot(p => p + 100)}
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md border-b-2 border-amber-700 transition-all"
        >
          Call
        </button>
        <button 
          onClick={handleHit}
          className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md border-b-2 border-emerald-700 transition-all"
        >
          Hit
        </button>
        <button 
          onClick={() => setPot(p => p + 250)}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md border-b-2 border-blue-800 transition-all"
        >
          Raise
        </button>
      </div>

    </div>
  );
}