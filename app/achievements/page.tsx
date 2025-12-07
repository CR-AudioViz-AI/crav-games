'use client';

import React from 'react';
import { CardDiscoveryProvider, CardCollectionGrid, useGameCardTriggers } from '@/components/hidden-card-components';

function DigitalCardsContent() {
  const { trackStreak } = useGameCardTriggers();

  React.useEffect(() => {
    trackStreak();
  }, [trackStreak]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-black">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.03)_50%)] bg-[length:100%_4px] z-50" />
      
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-4 font-mono">
              🎮 ACHIEVEMENT CARDS
            </h1>
            <p className="text-xl text-purple-300 mb-2 font-mono">
              UNLOCK RARE CARDS BY PLAYING GAMES
            </p>
            <p className="text-gray-500 font-mono text-sm">
              Play • Achieve • Collect
            </p>
          </div>
        </div>
      </div>

      {/* Collection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CardCollectionGrid />
      </div>

      {/* How to Unlock */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-900/80 rounded-xl p-8 border border-purple-500/30 backdrop-blur">
          <h2 className="text-2xl font-bold text-purple-100 mb-6 text-center font-mono">
            HOW TO UNLOCK CARDS
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="font-bold text-purple-200 mb-2 font-mono">PLAY GAMES</h3>
              <p className="text-gray-400 text-sm font-mono">
                Start playing to unlock Player One Series cards.
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-bold text-purple-200 mb-2 font-mono">SCORE HIGH</h3>
              <p className="text-gray-400 text-sm font-mono">
                Rack up points to earn High Score Heroes cards.
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-bold text-purple-200 mb-2 font-mono">DAILY STREAK</h3>
              <p className="text-gray-400 text-sm font-mono">
                Play every day to unlock Daily Grind cards.
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="font-bold text-purple-200 mb-2 font-mono">SECRETS</h3>
              <p className="text-gray-400 text-sm font-mono">
                Find hidden easter eggs for Secret Level cards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Series Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-purple-100 mb-6 text-center font-mono">
          CARD SERIES
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Player One Series', count: 10, desc: 'First steps in gaming', icon: '🎮', color: 'from-cyan-500 to-blue-500' },
            { name: 'High Score Heroes', count: 12, desc: 'Achievement-based rewards', icon: '🏆', color: 'from-yellow-500 to-orange-500' },
            { name: 'Daily Grind', count: 10, desc: 'Streak-based rewards', icon: '📅', color: 'from-purple-500 to-pink-500' },
            { name: 'Genre Guru', count: 15, desc: 'Category mastery', icon: '🎯', color: 'from-green-500 to-emerald-500' },
            { name: 'Time Traveler', count: 8, desc: 'Hours played milestones', icon: '⏱️', color: 'from-blue-500 to-indigo-500' },
            { name: 'Secret Level', count: 5, desc: 'Hidden easter eggs', icon: '🔐', color: 'from-pink-500 to-rose-500' },
          ].map(series => (
            <div 
              key={series.name}
              className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${series.color} flex items-center justify-center text-2xl`}>
                  {series.icon}
                </div>
                <div>
                  <h3 className="font-bold text-purple-200 font-mono">{series.name}</h3>
                  <p className="text-gray-400 text-sm font-mono">{series.desc}</p>
                  <p className="text-purple-500 text-xs font-mono">{series.count} cards</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tips */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-bold text-purple-200 mb-4 font-mono flex items-center gap-2">
            💡 PRO TIPS
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm font-mono">
            <li>• Try the classic cheat code for a legendary surprise</li>
            <li>• Night owls get special rewards between midnight and 3 AM</li>
            <li>• Explore all game categories to unlock Genre Guru cards</li>
            <li>• The faster you complete a game, the more secrets you might find</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function DigitalCardsPage() {
  return (
    <CardDiscoveryProvider>
      <DigitalCardsContent />
    </CardDiscoveryProvider>
  );
}
