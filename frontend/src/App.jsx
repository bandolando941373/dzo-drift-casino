import React, { useState, useEffect } from 'react';
import { DiscordSDK } from '@discord/embedded-app-sdk';
import { io } from 'socket.io-client';
import { 
  Coins, 
  Gamepad2, 
  Wallet, 
  ArrowRightLeft, 
  CircleDollarSign, 
  Trophy, 
  Zap, 
  ChevronRight, 
  ShieldAlert, 
  RotateCw 
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || '';

// Initialize Discord SDK safely
let discordSdk = null;
if (CLIENT_ID) {
  discordSdk = new DiscordSDK(CLIENT_ID);
}

const socket = io(BACKEND_URL, {
  path: '/socket.io',
  autoConnect: false,
  transports: ['websocket', 'polling']
});

export default function App() {
  const [user, setUser] = useState({ id: 'guest-1', username: 'DriftRacer_01', avatar: null });
  const [balances, setBalances] = useState({ dzo: 1000, chips: 500 });
  const [isCashierOpen, setIsCashierOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('slots');
  const [exchangeAmount, setExchangeAmount] = useState(100);
  const [errorMsg, setErrorMsg] = useState('');

  // Slot Machine Local State
  const [slotTheme, setSlotTheme] = useState('classic');
  const [slotBet, setSlotBet] = useState(25);
  const [slotReels, setSlotReels] = useState(['7️⃣', '7️⃣', '7️⃣']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);

  // Roulette Local State
  const [rouletteBet, setRouletteBet] = useState(50);
  const [selectedBetType, setSelectedBetType] = useState('RED');
  const [rouletteResult, setRouletteResult] = useState(null);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);

  useEffect(() => {
    // 1. Initialize SDK
    const initDiscord = async () => {
      if (discordSdk) {
        try {
          await discordSdk.ready();
          const auth = await discordSdk.commands.authenticate();
          if (auth && auth.user) {
            setUser({
              id: auth.user.id,
              username: auth.user.username,
              avatar: auth.user.avatar
            });
          }
        } catch (err) {
          console.warn('Discord SDK running in standalone or fallback mode:', err);
        }
      }
    };

    initDiscord();

    // 2. Connect Sockets
    socket.connect();
    socket.emit('auth:init', { userId: user.id, username: user.username });

    socket.on('balance:update', (newBalances) => {
      setBalances(newBalances);
    });

    socket.on('economy:error', ({ message }) => {
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(''), 4000);
    });

    socket.on('slots:result', ({ reels, payout, balances: updatedBalances, error }) => {
      setIsSpinning(false);
      if (error) {
        setErrorMsg(error);
        return;
      }
      setSlotReels(reels);
      setLastWin(payout);
      if (updatedBalances) setBalances(updatedBalances);
    });

    return () => {
      socket.off('balance:update');
      socket.off('economy:error');
      socket.off('slots:result');
      socket.disconnect();
    };
  }, []);

  const handleExchange = (type) => {
    socket.emit('economy:exchange', { type, amount: exchangeAmount });
  };

  const handleSpinSlots = () => {
    if (balances.chips < slotBet) {
      setErrorMsg('Insufficient DriftChips');
      return;
    }
    setIsSpinning(true);
    setLastWin(0);
    socket.emit('slots:spin', { betAmount: slotBet, theme: slotTheme });
  };

  const handlePlayRoulette = () => {
    if (balances.chips < rouletteBet) {
      setErrorMsg('Insufficient DriftChips');
      return;
    }
    setIsWheelSpinning(true);
    setRouletteResult(null);

    // Simulate Client-side wheel physics spin delay
    setTimeout(() => {
      const landedNumber = Math.floor(Math.random() * 37);
      const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(landedNumber);
      const color = landedNumber === 0 ? 'GREEN' : isRed ? 'RED' : 'BLACK';

      let won = false;
      let payout = 0;

      if (selectedBetType === color) {
        won = true;
        payout = rouletteBet * 2;
      } else if (selectedBetType === 'EVEN' && landedNumber !== 0 && landedNumber % 2 === 0) {
        won = true;
        payout = rouletteBet * 2;
      } else if (selectedBetType === 'ODD' && landedNumber % 2 !== 0) {
        won = true;
        payout = rouletteBet * 2;
      }

      setRouletteResult({ number: landedNumber, color, won, payout });
      setIsWheelSpinning(false);

      // Adjust state balances locally
      setBalances(prev => ({
        ...prev,
        chips: won ? prev.chips + payout - rouletteBet : prev.chips - rouletteBet
      }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-pink-500 to-purple-600 p-2 rounded-xl text-white shadow-lg">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              DRIVEZINE CASINO
            </h1>
            <p className="text-xs text-slate-400">Discord Embedded Real-time Gaming</p>
          </div>
        </div>

        {/* Currency Display & Cashier Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-4 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl">
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400">DZO:</span>
              <span className="font-mono text-sm font-bold text-amber-400">{balances.dzo.toLocaleString()}</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <CircleDollarSign className="w-4 h-4 text-pink-400" />
              <span className="text-xs text-slate-400">Chips:</span>
              <span className="font-mono text-sm font-bold text-pink-400">{balances.chips.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => setIsCashierOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-lg transition-all"
          >
            <Wallet className="w-4 h-4" />
            <span>Cashier</span>
          </button>
        </div>
      </header>

      {/* Error Alert Overlay */}
      {errorMsg && (
        <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 px-4 py-2 text-xs text-center flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Container Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <nav className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
          {[
            { id: 'slots', label: '3-Themed Slots', icon: Gamepad2 },
            { id: 'roulette', label: 'European Roulette', icon: Trophy },
            { id: 'poker', label: "Hold'em Poker", icon: CircleDollarSign },
            { id: 'blackjack', label: 'Multiplayer Blackjack', icon: Coins }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-slate-800 text-pink-400 border border-pink-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-pink-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab Content: Slots */}
        {activeTab === 'slots' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-6 box-shadow-neon">
              <div className="flex gap-4">
                {['classic', 'drift', 'cyber'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSlotTheme(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      slotTheme === t ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {t} Mode
                  </button>
                ))}
              </div>

              {/* Reel Window */}
              <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-8 flex items-center justify-center gap-6 shadow-inner w-full max-w-md">
                {slotReels.map((symbol, idx) => (
                  <div
                    key={idx}
                    className={`w-20 h-24 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-4xl shadow-md ${
                      isSpinning ? 'animate-bounce' : ''
                    }`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 w-full max-w-md">
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400 px-2">Bet Chips:</span>
                  <input
                    type="number"
                    value={slotBet}
                    onChange={(e) => setSlotBet(Math.max(10, parseInt(e.target.value) || 0))}
                    className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right text-xs font-mono font-bold text-pink-400"
                  />
                </div>
                <button
                  onClick={handleSpinSlots}
                  disabled={isSpinning}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 disabled:opacity-50 text-white font-black text-sm px-8 py-3 rounded-xl shadow-lg transition-all"
                >
                  {isSpinning ? 'SPINNING...' : 'SPIN'}
                </button>
              </div>

              {lastWin > 0 && (
                <div className="text-emerald-400 font-extrabold text-lg animate-pulse">
                  YOU WON +{lastWin} DriftChips!
                </div>
              )}
            </div>

            {/* Paytable Sidebar */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
              <h3 className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-2">Paytable & Rules</h3>
              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>3 Matching Symbols:</span>
                  <span className="font-mono text-pink-400 font-bold">10x Payout</span>
                </div>
                <div className="flex justify-between">
                  <span>2 Matching Symbols:</span>
                  <span className="font-mono text-pink-400 font-bold">2x Payout</span>
                </div>
                <div className="flex justify-between">
                  <span>Target RTP:</span>
                  <span className="font-mono text-emerald-400 font-bold">94.5%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Roulette */}
        {activeTab === 'roulette' && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-6">
            <h2 className="font-bold text-lg text-slate-200">European Roulette (Single '0')</h2>

            {/* Simulated Wheel Display */}
            <div className={`w-40 h-40 rounded-full border-4 border-amber-500/40 bg-slate-950 flex items-center justify-center text-center relative ${
              isWheelSpinning ? 'animate-spin' : ''
            }`}>
              <span className="text-3xl font-black font-mono text-amber-400">
                {rouletteResult ? rouletteResult.number : '37'}
              </span>
            </div>

            {/* Bet Type Selection */}
            <div className="flex gap-3">
              {['RED', 'BLACK', 'ODD', 'EVEN'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedBetType(type)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                    selectedBetType === type
                      ? 'bg-pink-600 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={rouletteBet}
                onChange={(e) => setRouletteBet(Math.max(10, parseInt(e.target.value) || 0))}
                className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-center font-mono font-bold text-sm text-pink-400"
              />
              <button
                onClick={handlePlayRoulette}
                disabled={isWheelSpinning}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all"
              >
                {isWheelSpinning ? 'SPINNING...' : 'PLACE BET & SPIN'}
              </button>
            </div>

            {rouletteResult && (
              <div className={`text-sm font-bold ${rouletteResult.won ? 'text-emerald-400' : 'text-rose-400'}`}>
                Landed on {rouletteResult.number} ({rouletteResult.color}). {rouletteResult.won ? `Won +${rouletteResult.payout} Chips!` : 'Better luck next spin!'}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Poker & Blackjack Stubs */}
        {(activeTab === 'poker' || activeTab === 'blackjack') && (
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center gap-4">
            <Trophy className="w-12 h-12 text-slate-600" />
            <h3 className="font-bold text-base text-slate-300">Multiplayer Table Ready</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Connect real Discord room members via Socket.io to launch authoritative 4-player multiplayer hands.
            </p>
          </div>
        )}
      </main>

      {/* Cashier Modal Drawer */}
      {isCashierOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-pink-400" />
                  <h2 className="font-bold text-base text-slate-100">DriveZine Cashier</h2>
                </div>
                <button
                  onClick={() => setIsCashierOpen(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  Close ✕
                </button>
              </div>

              {/* Balance Summary Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">DriveZine Online (DZO):</span>
                  <span className="font-mono text-amber-400 font-bold">{balances.dzo}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">DriftChips:</span>
                  <span className="font-mono text-pink-400 font-bold">{balances.chips}</span>
                </div>
              </div>

              {/* Exchange Input */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium">Exchange Amount</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={exchangeAmount}
                    onChange={(e) => setExchangeAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-sm text-slate-100"
                  />
                  <button
                    onClick={() => setExchangeAmount(balances.dzo)}
                    className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-2 rounded-xl text-slate-300 font-bold"
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Exchange Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => handleExchange('BUY_CHIPS')}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all"
                >
                  Buy DriftChips
                </button>
                <button
                  onClick={() => handleExchange('CASH_OUT')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 rounded-xl border border-slate-700 transition-all"
                >
                  Cash Out to DZO
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center">
              Fixed 1:1 Conversion Ratio • Zero Transaction Fees
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
