import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

// Standard Express CORS handling including Discord embedded proxy frames
app.use(cors({
  origin: [FRONTEND_URL, /\.discordsays\.com$/],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Keep-Alive endpoint to prevent Render free instance sleeping
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic API ping
app.get('/api/ping', (req, res) => {
  res.json({ message: 'DriveZine Casino Engine Online' });
});

const io = new Server(httpServer, {
  cors: {
    origin: [FRONTEND_URL, /\.discordsays\.com$/],
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io'
});

// Server-side State Management
const userBalances = new Map(); // userId -> { dzo: number, chips: number }
const activeRooms = new Map();   // roomId -> Game state

function getUserBalance(userId) {
  if (!userBalances.has(userId)) {
    userBalances.set(userId, { dzo: 1000, chips: 500 });
  }
  return userBalances.get(userId);
}

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  let currentUserId = null;

  // Initialize Player Profile & Sync Balances
  socket.on('auth:init', ({ userId, username }) => {
    currentUserId = userId || socket.id;
    const balances = getUserBalance(currentUserId);
    socket.emit('balance:update', balances);
    console.log(`[Auth] User initialized: ${username} (${currentUserId})`);
  });

  // Cashier Currency Exchange Protocol
  socket.on('economy:exchange', ({ type, amount }) => {
    if (!currentUserId) return;
    const balances = getUserBalance(currentUserId);
    const parsedAmount = Math.floor(Math.abs(Number(amount)));

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      socket.emit('economy:error', { message: 'Invalid exchange amount' });
      return;
    }

    if (type === 'BUY_CHIPS') {
      if (balances.dzo >= parsedAmount) {
        balances.dzo -= parsedAmount;
        balances.chips += parsedAmount;
        userBalances.set(currentUserId, balances);
        socket.emit('balance:update', balances);
      } else {
        socket.emit('economy:error', { message: 'Insufficient DZO balance' });
      }
    } else if (type === 'CASH_OUT') {
      if (balances.chips >= parsedAmount) {
        balances.chips -= parsedAmount;
        balances.dzo += parsedAmount;
        userBalances.set(currentUserId, balances);
        socket.emit('balance:update', balances);
      } else {
        socket.emit('economy:error', { message: 'Insufficient DriftChips balance' });
      }
    }
  });

  // Slot Machine Spin Handler (Server-Authoritative Validation)
  socket.on('slots:spin', ({ betAmount, theme }) => {
    if (!currentUserId) return;
    const balances = getUserBalance(currentUserId);
    const bet = Math.floor(Math.abs(Number(betAmount)));

    if (balances.chips < bet || bet <= 0) {
      socket.emit('slots:result', { error: 'Insufficient DriftChips for bet' });
      return;
    }

    // Deduct bet immediately
    balances.chips -= bet;

    // Slot Symbol Sets
    const symbolSets = {
      classic: ['7️⃣', '🔔', '🍉', '🍇', '🍋', '🍒'],
      drift: ['🏎️', '🛞', '⚡', '🏆', '🏁', '🔥'],
      cyber: ['🤖', '💎', '🔮', '🛰️', '⚡', '👾']
    };

    const symbols = symbolSets[theme] || symbolSets.classic;
    const reelsCount = theme === 'classic' ? 3 : 5;
    
    // Server reel RNG spin
    const resultReels = Array.from({ length: reelsCount }, () => 
      symbols[Math.floor(Math.random() * symbols.length)]
    );

    // Multiplier Calculation
    const uniqueSymbols = new Set(resultReels);
    let winMultiplier = 0;

    if (uniqueSymbols.size === 1) {
      winMultiplier = 10; // Jackpot (All match)
    } else if (uniqueSymbols.size === 2 && reelsCount === 5) {
      winMultiplier = 3;  // 4 of a kind / Full match variant
    } else if (uniqueSymbols.size === 3 && reelsCount === 5) {
      winMultiplier = 1.5; // 3 match
    } else if (uniqueSymbols.size === 2 && reelsCount === 3) {
      winMultiplier = 2;  // 2 match standard
    }

    const payout = Math.floor(bet * winMultiplier);
    balances.chips += payout;
    userBalances.set(currentUserId, balances);

    socket.emit('slots:result', {
      reels: resultReels,
      payout,
      winMultiplier,
      balances
    });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[DriveZine Backend] Server listening on port ${PORT}`);
});