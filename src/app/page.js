"use client"

import React, { useState } from 'react';
import MemoryGame from '@/components/MemoryGame';
import Blackjack from '@/components/Blackjack';
import TicTacToe from '@/components/TicTacToe';
import ColorFlood from '@/components/ColorFlood';

export default function Home() {
  const [selectedGame, setSelectedGame] = useState('memory');

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎮 ミニゲーム集
          </h1>
          
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <button
              onClick={() => setSelectedGame('memory')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-200 
                ${selectedGame === 'memory' 
                  ? 'bg-blue-500 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-600 hover:bg-blue-50'}`}
            >
              🎴 神経衰弱
            </button>
            <button
              onClick={() => setSelectedGame('blackjack')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-200
                ${selectedGame === 'blackjack' 
                  ? 'bg-blue-500 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-600 hover:bg-blue-50'}`}
            >
              ♠️ ブラックジャック
            </button>
            <button
              onClick={() => setSelectedGame('tictactoe')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-200
                ${selectedGame === 'tictactoe' 
                  ? 'bg-blue-500 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-600 hover:bg-blue-50'}`}
            >
              ⭕ 三目並べ
            </button>
            <button
              onClick={() => setSelectedGame('colorflood')}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-200
                ${selectedGame === 'colorflood' 
                  ? 'bg-blue-500 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-600 hover:bg-blue-50'}`}
            >
              🎨 Color Flood
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300">
          {selectedGame === 'memory' && <MemoryGame />}
          {selectedGame === 'blackjack' && <Blackjack />}
          {selectedGame === 'tictactoe' && <TicTacToe />}
          {selectedGame === 'colorflood' && <ColorFlood />}
        </div>
      </div>
    </main>
  );
}