"use client"

import React, { useState } from 'react';

const TicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);

  // 勝者判定
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // 縦
      [0, 4, 8], [2, 4, 6] // 斜め
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a],
          line: [a, b, c]
        };
      }
    }
    return null;
  };

  // マス目をクリックした時の処理
  const handleClick = (i) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.slice();

    // すでに勝者がいる場合やマスが埋まっている場合は何もしない
    if (calculateWinner(squares)?.winner || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory([...newHistory, squares]);
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
    setSquares(squares);
  };

  // ゲームをリセット
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
  };

  // 特定の手に戻る
  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext((step % 2) === 0);
    setSquares(history[step]);
  };

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line || [];
  const isDraw = !winner && squares.every(square => square !== null);
  
  let status;
  if (winner) {
    status = <span className={winner === 'X' ? 'text-blue-600' : 'text-red-600'}>
      Winner: {winner}
    </span>;
  } else if (isDraw) {
    status = "引き分け!";
  } else {
    status = <span>
      Next player: <span className={xIsNext ? 'text-blue-600' : 'text-red-600'}>
        {xIsNext ? 'X' : 'O'}
      </span>
    </span>;
  }

  // マス目のレンダリング用の関数
  const renderSquare = (i) => {
    const isWinningSquare = winningLine.includes(i);
    return (
      <button
        key={i}
        className={`w-20 h-20 text-4xl font-bold rounded-lg
                   ${isWinningSquare ? 'bg-green-200' : squares[i] ? 'bg-blue-50' : 'bg-white'}
                   hover:bg-blue-50 transition-colors duration-200
                   border-2 ${isWinningSquare ? 'border-green-400' : 'border-blue-200'} 
                   focus:outline-none`}
        onClick={() => handleClick(i)}
      >
        <span className={squares[i] === 'X' ? 'text-blue-600' : 'text-red-600'}>
          {squares[i]}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-600 mb-4">三目並べ</h2>
      <p className="text-gray-600 mb-4">
          二人で遊んでね！
      </p>
      
      {/* ステータス表示 */}
      <div className="mb-4 text-xl font-semibold text-gray-700">
        {status}
      </div>

      {/* ゲームボード */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {squares.map((_, i) => renderSquare(i))}
      </div>

      {/* コントロールボタン */}
      <div className="space-x-4 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg
                     hover:bg-blue-600 transition-colors duration-200"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>

      {/* 履歴 */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">History:</h3>
        <div className="flex flex-wrap gap-2">
          {history.map((_, move) => (
            <button
              key={move}
              className={`px-3 py-1 rounded
                         ${stepNumber === move 
                           ? 'bg-blue-500 text-white' 
                           : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => jumpTo(move)}
            >
              {move === 0 ? 'Start' : `Move #${move}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;