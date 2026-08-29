'use client';

import React, { useState } from 'react';
import { 
  Wallet, 
  Dices, 
  CircleDot, 
  Club, 
  Gamepad2, 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Coins, 
  Users,
  Sparkles,
  Zap,
  RotateCw,
  Trophy,
  History
} from 'lucide-react';

const SLOT_SYMBOLS = ['🏎️', '💎', '🎰', '🔔', '🔥', '⚡', '7️⃣'];

export default function DriveZineCasino() {
  const [isCashierOpen, setIsCashierOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('slots');
  
  // Wallet state
  const [dzoBalance, setDzoBalance] = useState(1000);
  const [chipBalance, setChipBalance] = useState(500);
  const [exchangeAmount, setExchangeAmount] = useState('100');

  // Slot machine animation states
  const [reels, setReels] = useState(['🏎️', '🎰', '🏎️']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState(null);

  // Roulette animation states
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState(null);

  // Interactive Spin Handler for Slots
  const handleSpinSlots = () => {
    if (chipBalance < 10 || isSpinning) return;
    setChipBalance((prev) => prev - 10);
    setIsSpinning(true);
    setWinMessage(null);

    const spinInterval = setInterval(() => {
      setReels([
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
      ]);
    }, 80);

    setTimeout(() => {
      clearInterval(spinInterval);
      const finalReels = [
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
      ];
      setReels(finalReels);
      setIsSpinning(false);

      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        setWinMessage('🎉 TRIPLE JACKPOT! +250 CHIPS');
        setChipBalance((prev) => prev + 250);
      } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
        setWinMessage('✨ MATCH TWO! +25 CHIPS');
        setChipBalance((prev) => prev + 25);
      }
    }, 2000);
  };

  // Interactive Spin Handler for Roulette
  const handleSpinRoulette = () => {
    if (chipBalance < 20 || isWheelSpinning) return;
    setChipBalance((prev) => prev - 20);
    setIsWheelSpinning(true);
    setRouletteResult(null);

    setTimeout(() => {
      const landedNum = Math.floor(Math.random() * 37);
      const color = landedNum === 0 ? 'GREEN' : landedNum % 2 === 0 ? 'BLACK' : 'RED';
      setRouletteResult({ number: landedNum, color });
      setIsWheelSpinning(false);
      
      if (color === 'RED') {
        setChipBalance((prev) => prev + 40);
      }
    }, 3000);
  };

  // Cashier Exchanges
  const handleBuyChips = () => {
    const val = parseInt(exchangeAmount, 10);
    if (!val || val <= 0 || val > dzoBalance) return;
    setDzoBalance((prev) => prev - val);
    setChipBalance((prev) => prev + val);
  };

  const handleCashOut = () => {
    const val = parseInt(exchangeAmount, 10);
    if (!val || val <= 0 || val > chipBalance) return;
    setChipBalance((prev) => prev - val);
    setDzoBalance((prev) => prev + val);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col selection:bg-pink-500 selection:text-white relative overflow-hidden">
      
      {/* Background Neon Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 glass-panel border-b border-gray-800/80 px-4 lg:px-8 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 p-[1px] box-shadow-neon">
            <div className="w-full h-full bg-gray-950 rounded-[11px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-pink-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 uppercase text-shadow-neon">
              DriveZine Casino
            </h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Embedded Real-Time Gaming Engine
            </p>
          </div>
        </div>

        {/* Live Wallet Bar */}
        <div className="flex items-center gap-2 bg-gray-900/90 border border-gray-800 rounded-xl p-1.5 px-3 box-shadow-cyan">
          <div className="flex items-center gap-2 pr-3 border-r border-gray-800">
            <Coins className="w-4 h-4 text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-400 leading-none">DZO</span>
              <span className="text-xs font-bold text-cyan-300 font-mono">{dzoBalance.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-1 pr-2">
            <Zap className="w-4 h-4 text-pink-400 fill-pink-400/20" />
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-400 leading-none">DriftChips</span>
              <span className="text-xs font-bold text-pink-400 font-mono">{chipBalance.toLocaleString()}</span>
            </div>
          </div>
          <button 
            onClick={() => setIsCashierOpen(true)}
            className="ml-2 flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-lg active:scale-95"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Cashier</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6 relative z-10">
        
        {/* GAME SELECTION NAVIGATION */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'slots', label: '3-Themed Slots', icon: Dices },
            { id: 'roulette', label: 'European Roulette', icon: CircleDot },
            { id: 'poker', label: "Hold'em Poker", icon: Club },
            { id: 'blackjack', label: 'Multiplayer Blackjack', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/60 text-pink-300 box-shadow-neon scale-105'
                    : 'bg-gray-900/60 border-gray-800/80 text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400 animate-bounce' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* ACTIVE STAGE PANEL */}
        <section className="relative rounded-3xl glass-panel border border-gray-800/80 box-shadow-neon overflow-hidden min-h-[520px] flex flex-col justify-between p-6 lg:p-8">
          
          {/* 1. SLOTS ENGINE MODULE */}
          {activeTab === 'slots' && (
            <div className="flex flex-col items-center justify-center space-y-8 my-auto">
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-pink-500/10 border border-pink-500/30 text-pink-400">
                  <Sparkles className="w-3 h-3" /> Turbo Reels V2
                </span>
                <h2 className="text-3xl font-black text-white tracking-wide text-shadow-neon">3-THEMED NITRO SLOTS</h2>
              </div>

              {/* Reel Wheels */}
              <div className="flex gap-4 p-6 bg-gray-950/80 border-2 border-pink-500/40 rounded-3xl box-shadow-neon">
                {reels.map((symbol, i) => (
                  <div 
                    key={i} 
                    className={`w-24 h-32 lg:w-32 lg:h-40 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center text-5xl lg:text-6xl shadow-inner transform transition-transform ${
                      isSpinning ? 'animate-slot-spin' : 'hover:scale-105'
                    }`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>

              {/* Status Message */}
              {winMessage && (
                <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 font-extrabold text-sm animate-bounce">
                  {winMessage}
                </div>
              )}

              {/* Spin Trigger Button */}
              <button
                onClick={handleSpinSlots}
                disabled={isSpinning || chipBalance < 10}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-black text-white transition-all duration-200 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl hover:shadow-pink-500/25 active:scale-95 disabled:opacity-50"
              >
                <RotateCw className={`w-5 h-5 mr-2 ${isSpinning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span>{isSpinning ? 'SPINNING...' : 'SPIN REELS ($10 CHIPS)'}</span>
              </button>
            </div>
          )}

          {/* 2. ROULETTE MODULE */}
          {activeTab === 'roulette' && (
            <div className="flex flex-col items-center justify-center space-y-8 my-auto">
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <CircleDot className="w-3 h-3" /> European Single Zero
                </span>
                <h2 className="text-3xl font-black text-white tracking-wide text-shadow-cyan">ROYAL ROULETTE</h2>
              </div>

              {/* Animated Wheel Visual */}
              <div className="relative flex items-center justify-center w-56 h-56 lg:w-64 lg:h-64">
                <div className={`w-full h-full rounded-full border-8 border-cyan-500/40 bg-gradient-to-tr from-gray-950 via-cyan-950 to-gray-950 flex items-center justify-center box-shadow-cyan ${
                  isWheelSpinning ? 'animate-roulette-spin' : ''
                }`}>
                  <div className="w-40 h-40 rounded-full border-4 border-dashed border-cyan-400/30 flex items-center justify-center">
                    <span className="text-4xl font-black text-cyan-400 font-mono">
                      {rouletteResult ? rouletteResult.number : '36'}
                    </span>
                  </div>
                </div>
              </div>

              {rouletteResult && (
                <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-xl text-cyan-300 font-bold text-sm">
                  Landed on <span className="font-black underline">{rouletteResult.number} ({rouletteResult.color})</span>
                </div>
              )}

              <button
                onClick={handleSpinRoulette}
                disabled={isWheelSpinning || chipBalance < 20}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black text-sm tracking-wider uppercase rounded-2xl shadow-lg box-shadow-cyan transition active:scale-95 disabled:opacity-50"
              >
                {isWheelSpinning ? 'WHEEL SPINNING...' : 'PLACE BET ($20 RED)'}
              </button>
            </div>
          )}

          {/* 3. POKER MODULE */}
          {activeTab === 'poker' && (
            <div className="flex flex-col items-center justify-center space-y-6 my-auto text-center">
              <div className="p-4 rounded-3xl bg-purple-500/10 border border-purple-500/30 box-shadow-neon">
                <Club className="w-12 h-12 text-purple-400" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-wide">TEXAS HOLD'EM HIGH STAKES</h2>
              <p className="text-xs text-gray-400 max-w-md">
                Automated deck shuffling engine with server-side state hand evaluations.
              </p>
              
              {/* Poker Cards Mock Visual */}
              <div className="flex gap-3">
                <div className="w-16 h-24 bg-white text-gray-950 rounded-xl flex flex-col justify-between p-2 font-black shadow-2xl border-2 border-purple-500">
                  <span>A♠</span>
                  <span className="text-right">A♠</span>
                </div>
                <div className="w-16 h-24 bg-white text-red-600 rounded-xl flex flex-col justify-between p-2 font-black shadow-2xl border-2 border-purple-500">
                  <span>K♦</span>
                  <span className="text-right">K♦</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. BLACKJACK MODULE */}
          {activeTab === 'blackjack' && (
            <div className="flex flex-col items-center justify-center space-y-6 my-auto text-center">
              <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30">
                <Users className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-wide">MULTIPLAYER BLACKJACK</h2>
              <p className="text-xs text-gray-400 max-w-md">
                Real-time WebSocket lobby supporting synchronous card hits, splits, and dealer stand rules.
              </p>
              <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-black text-xs uppercase rounded-xl transition">
                Create Discord Lobby
              </button>
            </div>
          )}

        </section>
      </main>

      {/* CASHIER MODAL OVERLAY */}
      {isCashierOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl transition-all">
          <div className="relative w-full max-w-md glass-panel border border-pink-500/40 rounded-3xl p-6 box-shadow-neon space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-800/80 pb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-black text-white text-shadow-neon uppercase tracking-wider">DriveZine Cashier</h3>
              </div>
              <button 
                onClick={() => setIsCashierOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wallet Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-gray-950/80 border border-gray-800 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">DZO Balance</span>
                <span className="text-xl font-black text-cyan-400 font-mono">{dzoBalance.toLocaleString()}</span>
              </div>
              <div className="p-3.5 bg-gray-950/80 border border-gray-800 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">DriftChips</span>
                <span className="text-xl font-black text-pink-400 font-mono">{chipBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* Input Controls */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Exchange Amount</label>
              <div className="flex gap-2">
                <input 
                  type="number"
                  value={exchangeAmount}
                  onChange={(e) => setExchangeAmount(e.target.value)}
                  className="flex-1 bg-gray-950 border border-gray-800 focus:border-pink-500 focus:outline-none rounded-xl px-4 py-2.5 text-white font-mono text-sm"
                  placeholder="Enter chips..."
                />
                <button 
                  onClick={() => setExchangeAmount(dzoBalance.toString())}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 rounded-xl border border-gray-700 transition"
                >
                  Max
                </button>
              </div>
            </div>

            {/* Transaction Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={handleBuyChips}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Buy DriftChips</span>
              </button>
              <button 
                onClick={handleCashOut}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 font-bold text-xs rounded-xl transition active:scale-95"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Cash Out to DZO</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-gray-500 font-medium">
              Instant Settlement • 1:1 Exchange Standard
            </p>
          </div>
        </div>
      )}
    </div>
  );
}