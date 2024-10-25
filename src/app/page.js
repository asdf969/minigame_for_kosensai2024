"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import MemoryGame from '@/components/MemoryGame';
import Blackjack from '@/components/Blackjack';
import TicTacToe from '@/components/TicTacToe';
import ColorFlood from '@/components/ColorFlood';
import Minesweeper from '@/components/Minesweeper';


export default function Home() {
  const [selectedGame, setSelectedGame] = useState('memory');

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
            <Image
              src="/images/image.png"  // 画像のパス
              alt="Game Logo"
              width={200}  // 画像の幅
              height={100}  // 画像の高さ
              priority  // 優先的に読み込む
              className="rounded-lg shadow-md"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            🎮 ミニゲーム集
          </h1>
          <p className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            スマホでもできます QRコードをチェック‼️
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-8">
            <button
              onClick={() => setSelectedGame('memory')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold 
                        transition-all duration-200 
                        ${selectedGame === 'memory' 
                          ? 'bg-blue-500 text-white shadow-lg scale-105' 
                          : 'bg-white text-gray-600 hover:bg-blue-50'}`}
            >
              🎴 神経衰弱
            </button>
            <button
              onClick={() => setSelectedGame('blackjack')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold 
                        transition-all duration-200
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
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold 
                        transition-all duration-200
                        ${selectedGame === 'colorflood' 
                          ? 'bg-blue-500 text-white shadow-lg scale-105' 
                          : 'bg-white text-gray-600 hover:bg-blue-50'}`}
            >
              🎨 Color Flood
            </button>
            <button
              onClick={() => setSelectedGame('Minesweeper')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold 
                        transition-all duration-200
                        ${selectedGame === 'Minesweeper' 
                          ? 'bg-blue-500 text-white shadow-lg scale-105' 
                          : 'bg-white text-gray-600 hover:bg-blue-50'}`}
            >
              💣マインスイーパー
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 transition-all duration-300">
          {selectedGame === 'memory' && <MemoryGame />}
          {selectedGame === 'blackjack' && <Blackjack />}
          {selectedGame === 'tictactoe' && <TicTacToe />}
          {selectedGame === 'colorflood' && <ColorFlood />}
          {selectedGame === 'Minesweeper' && <Minesweeper />}
        </div>
      </div>
    </main>
  );
}