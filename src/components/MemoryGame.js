"use client"

import React, { useState, useEffect } from 'react';

const CARD_PAIRS = ['🐱', '🐶', '🐰', '🐼', '🐨', '🦊', '🐯', '🦁'];

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const shuffledCards = [...CARD_PAIRS, ...CARD_PAIRS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol: symbol,
      }));
    
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameOver(false);
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2) return;
    if (solved.includes(id) || flipped.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].symbol === cards[second].symbol) {
        setSolved([...solved, first, second]);
        setFlipped([]);
        
        if (solved.length + 2 === cards.length) {
          setGameOver(true);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">神経衰弱</h2>
        <p className="text-gray-600 mb-4">
          同じ絵柄のカードを見つけよう！
        </p>
        <div className="bg-gray-100 rounded-lg py-2 px-4 inline-block mb-4">
          <span className="text-lg font-semibold text-gray-700">
            Moves: {moves}
          </span>
        </div>
        <button 
          onClick={initGame}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 
                     transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          New Game
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index)}
            className={`aspect-square flex items-center justify-center text-4xl 
                       cursor-pointer transition-all duration-300 rounded-lg shadow-md
                       hover:shadow-lg transform hover:-translate-y-1
                       ${flipped.includes(index) || solved.includes(index)
                         ? 'bg-white border-2 border-blue-200'
                         : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}
          >
            {(flipped.includes(index) || solved.includes(index)) ? card.symbol : ''}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="text-center mt-8 bg-green-100 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            🎉 Congratulations! 🎉
          </h2>
          <p className="text-green-700">
            ゲームクリア！ {moves} 手で完成しました！
          </p>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;