"use client"

import React, { useState, useEffect } from 'react';

const DIFFICULTIES = {
    easy: { size: 10, colors: 4, moves: 20 },
    normal: { size: 14, colors: 6, moves: 35 },
    hard: { size: 18, colors: 8, moves: 40 },
    veryhard: { size: 21, colors: 8, moves: 45 }
  };

const ALL_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-gray-500', 'bg-orange-500', 'bg-teal-500'
];

const ColorFlood = () => {
  const [difficulty, setDifficulty] = useState('normal');
  const [board, setBoard] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [currentColor, setCurrentColor] = useState('');
  const [highScores, setHighScores] = useState({
    easy: Infinity,
    normal: Infinity,
    hard: Infinity
  });
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hint, setHint] = useState(null);
  const [hintCount, setHintCount] = useState(3); // 1ゲームにつき3回までヒント可能

  // タイマー処理
  useEffect(() => {
    let timer;
    if (isPlaying && !gameWon) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, gameWon]);

  // ゲームの初期化
  const initGame = () => {
    const { size, colors } = DIFFICULTIES[difficulty];
    const gameColors = ALL_COLORS.slice(0, colors);
    
    const newBoard = Array(size).fill().map(() => 
      Array(size).fill().map(() => 
        gameColors[Math.floor(Math.random() * colors)]
      )
    );

    setBoard(newBoard);
    setMoves(0);
    setGameWon(false);
    setCurrentColor(newBoard[0][0]);
    setTime(0);
    setIsPlaying(true);
    setHint(null);
    setHintCount(3);
  };

  // 色を変更
  const floodFill = (newColor) => {
    if (newColor === currentColor || gameWon || !isPlaying) return;

    const newBoard = board.map(row => [...row]);
    const oldColor = board[0][0];
    
    const flood = (x, y) => {
      if (x < 0 || x >= board.length || y < 0 || y >= board.length) return;
      if (newBoard[y][x] !== oldColor) return;
      
      newBoard[y][x] = newColor;
      flood(x + 1, y);
      flood(x - 1, y);
      flood(x, y + 1);
      flood(x, y - 1);
    };

    flood(0, 0);
    setBoard(newBoard);
    setCurrentColor(newColor);
    setMoves(moves + 1);
    setHint(null);

    // 勝利判定
    const hasWon = newBoard.every(row => row.every(cell => cell === newColor));
    if (hasWon) {
      setGameWon(true);
      setIsPlaying(false);
      // ハイスコア更新
      if (moves + 1 < highScores[difficulty]) {
        setHighScores(prev => ({
          ...prev,
          [difficulty]: moves + 1
        }));
      }
    }
  };

  // 難易度変更時に新しいゲームを開始
  useEffect(() => {
    initGame();
  }, [difficulty]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const { moves: maxMoves, colors } = DIFFICULTIES[difficulty];
  const gameColors = ALL_COLORS.slice(0, colors);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl text-gray-600 font-bold mb-4">Color Flood</h2>
      
      {/* 難易度選択 */}
      <div className="mb-4 flex gap-2">
        {Object.keys(DIFFICULTIES).map((diff) => (
          <button
            key={diff}
            className={`px-4 py-2 rounded-lg ${
              difficulty === diff 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setDifficulty(diff)}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      {/* ステータス表示 */}
      <div className="mb-4 space-y-2 text-center">
        <div className="flex text-gray-600 gap-4 text-lg">
          <div>Moves: {moves}/{maxMoves}</div>
          <div>Time: {formatTime(time)}</div>
          <div>Hints: {hintCount}</div>
        </div>
        <div className="text-sm">
          Best: {highScores[difficulty] === Infinity ? '-' : highScores[difficulty]} moves
        </div>
        {gameWon && (
          <div className="text-xl text-green-600 font-bold">
            🎉 Congratulations! 🎉
          </div>
        )}
        {moves >= maxMoves && !gameWon && (
          <div className="text-xl text-red-600 font-bold">
            Game Over
          </div>
        )}
      </div>

      {/* カラーパレット */}
      <div className="flex gap-4 mb-4 items-center">
        <div className="flex gap-2">
        {gameColors.map((color, i) => (
            <button
                key={i}
                className={`w-12 h-12 rounded-lg ${color} 
                        transition-transform hover:scale-110
                        ${color === currentColor ? 'ring-4 ring-gray-400' : ''}
                        ${color === hint ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
                onClick={() => floodFill(color)}
            />
        ))}
        </div>
      </div>

      {/* ゲームボード */}
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        {board.map((row, y) => (
            <div key={y} className="flex">
            {row.map((cell, x) => (
                <div
                key={`${x}-${y}`}
                className={`w-10 h-10 ${cell} transition-colors duration-200
                            border border-gray-700/20`}  // グリッド線を追加
                />
            ))}
            </div>
        ))}
    </div>

      {/* リセットボタン */}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg
                   hover:bg-blue-600 transition-colors"
        onClick={initGame}
      >
        New Game
      </button>

      

      {/* ルール説明 */}
      <div className="mt-6 text-gray-600 text-center max-w-md">
        <h3 className="font-bold mb-2">How to Play:</h3>
        <p>左上から色を広げて、すべてのマスを同じ色にしましょう！</p>
        <p>制限手数: {maxMoves}手</p>
        <p>ランダムマップなので、リセマラ推奨</p>
      </div>
    </div>
  );
};

export default ColorFlood;