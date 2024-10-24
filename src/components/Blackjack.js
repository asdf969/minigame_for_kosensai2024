"use client"

import React, { useState } from 'react';

const Blackjack = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [deck, setDeck] = useState([]);
  const [gameStatus, setGameStatus] = useState('ready'); // ready, playing, ended
  const [message, setMessage] = useState('');

  // デッキを初期化
  const initDeck = () => {
    const suits = ['♠', '♣', '♥', '♦'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck = [];
    
    for (let suit of suits) {
      for (let rank of ranks) {
        newDeck.push({ suit, rank });
      }
    }

    return newDeck.sort(() => Math.random() - 0.5);
  };

  // ゲームをリセット
  const resetGame = () => {
    const newDeck = initDeck();
    setDeck(newDeck);
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('ready');
    setMessage('ゲームを開始してください');
  };

  // 手札の合計値を計算
  const calculateHand = (hand) => {
    let total = 0;
    let aces = 0;

    for (let card of hand) {
      if (card.rank === 'A') {
        aces += 1;
      } else if (['K', 'Q', 'J'].includes(card.rank)) {
        total += 10;
      } else {
        total += parseInt(card.rank);
      }
    }

    // エースの処理
    for (let i = 0; i < aces; i++) {
      if (total + 11 <= 21) {
        total += 11;
      } else {
        total += 1;
      }
    }

    return total;
  };

  // ゲーム開始
  const startGame = () => {
    const newDeck = initDeck();
    const pHand = [newDeck[0], newDeck[1]];
    const dHand = [newDeck[2]];
    
    setDeck(newDeck.slice(3));
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setGameStatus('playing');
    setMessage('ヒットかスタンドを選んでください');
  };

  // ヒット（カードを引く）
  const hit = () => {
    if (gameStatus !== 'playing') return;

    const newCard = deck[0];
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    setDeck(deck.slice(1));

    const total = calculateHand(newHand);
    if (total > 21) {
      setGameStatus('ended');
      setMessage('バースト！ディーラーの勝ち！');
    }
  };

  // スタンド（ディーラーのターン）
  const stand = () => {
    if (gameStatus !== 'playing') return;

    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];
    
    while (calculateHand(currentDealerHand) < 17) {
      currentDealerHand.push(currentDeck[0]);
      currentDeck = currentDeck.slice(1);
    }

    setDealerHand(currentDealerHand);
    setDeck(currentDeck);

    const playerTotal = calculateHand(playerHand);
    const dealerTotal = calculateHand(currentDealerHand);

    if (dealerTotal > 21) {
      setMessage('ディーラーバースト！あなたの勝ち！');
    } else if (playerTotal > dealerTotal) {
      setMessage('あなたの勝ち！');
    } else if (playerTotal < dealerTotal) {
      setMessage('ディーラーの勝ち！');
    } else {
      setMessage('引き分け！');
    }

    setGameStatus('ended');
  };

  // Blackjack.jsの該当部分を修正

return (
  <div className="max-w-xl mx-auto p-2 sm:p-4">
    <div className="text-center mb-4 sm:mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">ブラックジャック</h2>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {gameStatus === 'ready' ? (
          <button 
            onClick={startGame}
            className="w-full sm:w-auto bg-green-500 text-white px-4 sm:px-6 py-2 rounded-lg 
                     hover:bg-green-600 transition-colors duration-200 
                     shadow-md hover:shadow-lg mb-2 sm:mb-4"
          >
            ゲーム開始
          </button>
        ) : (
          <>
            <button 
              onClick={hit}
              disabled={gameStatus !== 'playing'}
              className={`w-full sm:w-auto bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg
                         transition-colors duration-200 shadow-md hover:shadow-lg
                         ${gameStatus !== 'playing' && 'opacity-50 cursor-not-allowed'}`}
            >
              ヒット
            </button>
            <button 
              onClick={stand}
              disabled={gameStatus !== 'playing'}
              className={`w-full sm:w-auto bg-red-500 text-white px-4 sm:px-6 py-2 rounded-lg
                         transition-colors duration-200 shadow-md hover:shadow-lg
                         ${gameStatus !== 'playing' && 'opacity-50 cursor-not-allowed'}`}
            >
              スタンド
            </button>
          </>
        )}
        <button 
          onClick={resetGame}
          className="w-full sm:w-auto bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-lg
                   hover:bg-gray-600 transition-colors duration-200
                   shadow-md hover:shadow-lg"
        >
          リセット
        </button>
      </div>
      <div className="text-base sm:text-lg font-semibold text-gray-700 mt-4">
        {message}
      </div>
    </div>

    {/* カード表示部分 */}
    <div className="space-y-4 sm:space-y-8">
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
        <h3 className="font-bold text-gray-700 mb-2">
          ディーラーの手札
          {gameStatus === 'ended' && 
            <span className="text-blue-600 ml-2">
              ({calculateHand(dealerHand)})
            </span>
          }
        </h3>
        <div className="flex flex-wrap gap-2">
          {dealerHand.map((card, index) => (
            <div key={index}
                 className="border-2 border-gray-200 rounded-lg p-2 sm:p-4 
                          min-w-[45px] sm:min-w-[60px]
                          text-center bg-white shadow-sm">
              <span className={card.suit === '♥' || card.suit === '♦' 
                            ? 'text-red-500' 
                            : 'text-gray-800'}>
                {card.suit}{card.rank}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
        <h3 className="font-bold text-gray-700 mb-2">
          あなたの手札 
          <span className="text-blue-600 ml-2">
            ({calculateHand(playerHand)})
          </span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {playerHand.map((card, index) => (
            <div key={index}
                 className="border-2 border-gray-200 rounded-lg p-2 sm:p-4 
                          min-w-[45px] sm:min-w-[60px]
                          text-center bg-white shadow-sm">
              <span className={card.suit === '♥' || card.suit === '♦' 
                            ? 'text-red-500' 
                            : 'text-gray-800'}>
                {card.suit}{card.rank}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

export default Blackjack;