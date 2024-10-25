"use client"

import React, { useState, useEffect } from 'react';

const DIFFICULTIES = {
  easy: { rows: 8, cols: 8, mines: 10, label: '初級' },
  normal: { rows: 12, cols: 12, mines: 30, label: '中級' },
  hard: { rows: 16, cols: 16, mines: 40, label: '上級' }
};

const NUMBER_COLORS = {
  1: 'text-blue-600',
  2: 'text-green-600',
  3: 'text-red-600',
  4: 'text-indigo-600',
  5: 'text-amber-600',
  6: 'text-cyan-600',
  7: 'text-violet-600',
  8: 'text-gray-800'
};

const Cell = ({ value, revealed, flagged, gameOver, onClick, onContextMenu }) => {
    const [touchTimeout, setTouchTimeout] = useState(null);
    const [isTouching, setIsTouching] = useState(false);
  
    const getContent = () => {
      if (flagged) return '🚩';
      if (!revealed && !gameOver) return '';
      if (value === -1) return '💣';
      return value || '';
    };
  
    const getStyle = () => {
      const baseStyle = `w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center 
                        font-bold transition-all duration-200 text-xs sm:text-sm md:text-base`;
      
      if (!revealed && !gameOver) {
        return `${baseStyle} bg-gray-300 active:bg-gray-400
                shadow-inner cursor-pointer
                transform active:scale-95`;
      }
  
      if (value === -1) {
        return `${baseStyle} ${gameOver ? 'bg-red-200 animate-pulse' : 'bg-red-100'} 
                border border-red-300`;
      }
  
      return `${baseStyle} bg-gray-100 border border-gray-200 ${NUMBER_COLORS[value] || ''}`;
    };
  
    const handleTouchStart = (e) => {
      e.preventDefault();
      setIsTouching(true);
      
      const timer = setTimeout(() => {
        if (isTouching) {
          onContextMenu(e);
          setIsTouching(false);
        }
      }, 500);
      
      setTouchTimeout(timer);
    };
  
    const handleTouchEnd = (e) => {
      e.preventDefault();
      if (touchTimeout) {
        clearTimeout(touchTimeout);
      }
      
      if (isTouching) {
        onClick();
      }
      
      setIsTouching(false);
      setTouchTimeout(null);
    };
  
    const handleTouchMove = (e) => {
      e.preventDefault();
      setIsTouching(false);
      if (touchTimeout) {
        clearTimeout(touchTimeout);
        setTouchTimeout(null);
      }
    };
  
    return (
      <button
        className={getStyle()}
        onClick={onClick}
        onContextMenu={onContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchCancel={() => {
          setIsTouching(false);
          if (touchTimeout) {
            clearTimeout(touchTimeout);
            setTouchTimeout(null);
          }
        }}
        disabled={gameOver}
      >
        {getContent()}
      </button>
    );
  };

const Minesweeper = () => {
    // 初期値を設定（この部分は正しい）
    const defaultDifficulty = 'easy';
    const { rows, cols, mines } = DIFFICULTIES[defaultDifficulty];
    const initialBoard = Array(rows).fill().map(() => Array(cols).fill(0));
    const initialRevealed = Array(rows).fill().map(() => Array(cols).fill(false));
    const initialFlagged = Array(rows).fill().map(() => Array(cols).fill(false));
  
    // state設定（この部分は正しい）
    const [difficulty, setDifficulty] = useState(defaultDifficulty);
    const [board, setBoard] = useState(initialBoard);
    const [revealed, setRevealed] = useState(initialRevealed);
    const [flagged, setFlagged] = useState(initialFlagged);
    const [gameStatus, setGameStatus] = useState('ready');
    const [mineCount, setMineCount] = useState(mines);
    const [time, setTime] = useState(0);
    const [bestTimes, setBestTimes] = useState({
      easy: Infinity,
      normal: Infinity,
      hard: Infinity
    });

    // createBoard関数（useEffectは外に出す）
    const createBoard = (diff = difficulty) => {
        const { rows, cols, mines } = DIFFICULTIES[diff];
        let newBoard = Array(rows).fill().map(() => Array(cols).fill(0));
        
        // ランダムに地雷を配置
        let minesPlaced = 0;
        while (minesPlaced < mines) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);
            if (newBoard[row][col] !== -1) {
                newBoard[row][col] = -1;
                minesPlaced++;
            }
        }

        // 周囲の地雷数を計算
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (newBoard[row][col] === -1) continue;
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const newRow = row + i;
                        const newCol = col + j;
                        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                            if (newBoard[newRow][newCol] === -1) count++;
                        }
                    }
                }
                newBoard[row][col] = count;
            }
        }

        setBoard(newBoard);
        setRevealed(Array(rows).fill().map(() => Array(cols).fill(false)));
        setFlagged(Array(rows).fill().map(() => Array(cols).fill(false)));
        setMineCount(mines);
        setTime(0);
        setGameStatus('playing');
    };

    // セルを開く関数（追加）
    const revealCell = (row, col) => {
        if (gameStatus !== 'playing' || flagged[row][col] || revealed[row][col]) return;

        const newRevealed = revealed.map(row => [...row]);
        
        const flood = (r, c) => {
            if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;
            if (newRevealed[r][c] || flagged[r][c]) return;

            newRevealed[r][c] = true;

            if (board[r][c] === 0) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        flood(r + i, c + j);
                    }
                }
            }
        };

        flood(row, col);
        setRevealed(newRevealed);

        if (board[row][col] === -1) {
            setGameStatus('lost');
        } else {
            checkWin(newRevealed);
        }
    };

    // 勝利判定関数（追加）
    const checkWin = (newRevealed) => {
        const unrevealedCount = newRevealed.flat().filter(cell => !cell).length;
        if (unrevealedCount === DIFFICULTIES[difficulty].mines) {
            setGameStatus('won');
            if (time < bestTimes[difficulty]) {
                setBestTimes(prev => ({ ...prev, [difficulty]: time }));
            }
        }
    };

    // フラグを立てる関数（追加）
    const handleContextMenu = (e, row, col) => {
        e.preventDefault();
        if (gameStatus !== 'playing' || revealed[row][col]) return;
      
        // 新しいフラグ配列を作成
        const newFlagged = flagged.map(r => [...r]);
        newFlagged[row][col] = !newFlagged[row][col];
        setFlagged(newFlagged);
        
        // 地雷カウントの更新
        const newMineCount = mineCount + (newFlagged[row][col] ? -1 : 1);
        setMineCount(newMineCount);
      };

    // useEffectをcreateBoardの外に移動
    useEffect(() => {
        createBoard(difficulty);
    }, [difficulty]);

    // タイマー用のuseEffect
    useEffect(() => {
        let timer;
        if (gameStatus === 'playing') {
            timer = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameStatus]);

  // 他の関数は同じ

  return (
    <div className="flex flex-col items-center p-2 sm:p-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">マインスイーパー</h2>

      {/* 難易度選択 - モバイル対応 */}
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {Object.entries(DIFFICULTIES).map(([key, { label }]) => (
          <button
            key={key}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 text-sm sm:text-base
                      ${difficulty === key 
                        ? 'bg-blue-500 text-white transform scale-105 shadow-lg' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={() => {
              setDifficulty(key);
              createBoard(key);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ステータス表示 - モバイル対応 */}
      <div className="flex justify-between w-full max-w-xs sm:max-w-sm mb-4 bg-black p-2 rounded-lg">
        <div className="bg-black text-red-500 font-mono text-base sm:text-xl">
          💣 {mineCount}
        </div>
        <button
          onClick={() => createBoard()}
          className={`px-3 sm:px-4 py-1 rounded transition-colors text-lg sm:text-xl
                    ${gameStatus === 'playing' 
                      ? 'bg-blue-500 active:bg-blue-600' 
                      : gameStatus === 'won'
                        ? 'bg-green-500 active:bg-green-600'
                        : 'bg-red-500 active:bg-red-600'} 
                    text-white`}
        >
          {gameStatus === 'playing' ? '😊' : gameStatus === 'won' ? '😎' : '😵'}
        </button>
        <div className="bg-black text-red-500 font-mono text-base sm:text-xl">
          ⏰ {time}
        </div>
      </div>

      {/* ゲームボード - モバイル対応 */}
      {/* ゲームボード */}
        <div 
        className="max-w-full overflow-x-auto"
        onTouchMove={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        >
        <div className="inline-block bg-gray-800 p-2 sm:p-3 rounded-lg shadow-xl">
            {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-0.5">
                {row.map((cell, colIndex) => (
                <Cell
                    key={`${rowIndex}-${colIndex}`}
                    value={cell}
                    revealed={revealed[rowIndex][colIndex]}
                    flagged={flagged[rowIndex][colIndex]}
                    gameOver={gameStatus !== 'playing'}
                    onClick={() => revealCell(rowIndex, colIndex)}
                    onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
                />
                ))}
            </div>
            ))}
        </div>
        </div>

      {/* ゲーム終了メッセージ - モバイル対応 */}
      {gameStatus === 'won' && (
        <div className="mt-4 text-lg sm:text-xl text-green-600 font-bold animate-bounce">
          🎉 クリア！ タイム: {time}秒 🎉
        </div>
      )}
      {gameStatus === 'lost' && (
        <div className="mt-4 text-lg sm:text-xl text-red-600 font-bold animate-bounce">
          💥 ゲームオーバー 💥
        </div>
      )}

      {/* ベストタイム - モバイル対応 */}
      {bestTimes[difficulty] !== Infinity && (
        <div className="mt-2 text-sm sm:text-base text-gray-600">
          ベストタイム: {bestTimes[difficulty]}秒
        </div>
      )}

      {/* モバイル向けの操作説明 */}
        <div className="mt-4 space-y-1">
        <div className="text-xs sm:text-sm text-gray-500 text-center">
            <p>タップでマスを開く</p>
            <p>長押し（0.3秒）で旗を立てる/外す</p>
        </div>
        <div className="text-xs text-gray-400 text-center">
            {flagged.flat().filter(Boolean).length} / {mineCount} 🚩
        </div>
        </div>
    </div>
  );
};

export default Minesweeper;