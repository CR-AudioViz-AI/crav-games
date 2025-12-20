'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

// =============================================================================
// CR AUDIOVIZ AI - GAMES HUB
// 100 Games: 10 Categories × 10 Games Each
// Plus External Gaming Resources
// =============================================================================

// Game Categories with 10 games each
const GAME_CATEGORIES = [
  {
    id: 'action',
    name: 'Action/Arcade',
    icon: '🎯',
    color: 'from-red-600 to-orange-500',
    description: 'Fast reflexes, retro-modern gameplay',
    games: [
      { id: 'space-shooter', name: 'Space Shooter', difficulty: 1, icon: '🚀' },
      { id: 'brick-breaker', name: 'Brick Breaker', difficulty: 2, icon: '🧱' },
      { id: 'asteroid-dodge', name: 'Asteroid Dodge', difficulty: 3, icon: '☄️' },
      { id: 'ninja-jump', name: 'Ninja Jump', difficulty: 4, icon: '🥷' },
      { id: 'speed-racer', name: 'Speed Racer', difficulty: 5, icon: '🏎️' },
      { id: 'zombie-wave', name: 'Zombie Wave', difficulty: 6, icon: '🧟' },
      { id: 'boss-rush', name: 'Boss Rush', difficulty: 7, icon: '👹' },
      { id: 'bullet-hell', name: 'Bullet Hell', difficulty: 8, icon: '💥' },
      { id: 'combo-master', name: 'Combo Master', difficulty: 9, icon: '⚡' },
      { id: 'ultimate-arcade', name: 'Ultimate Arcade', difficulty: 10, icon: '🏆' },
    ]
  },
  {
    id: 'strategy',
    name: 'Strategy/Tactical',
    icon: '♟️',
    color: 'from-blue-600 to-indigo-500',
    description: 'Chess-like, tower defense, planning',
    games: [
      { id: 'tower-defense-basic', name: 'Tower Defense', difficulty: 1, icon: '🏰' },
      { id: 'chess-lite', name: 'Chess Lite', difficulty: 2, icon: '♔' },
      { id: 'resource-manager', name: 'Resource Manager', difficulty: 3, icon: '📊' },
      { id: 'battle-tactics', name: 'Battle Tactics', difficulty: 4, icon: '⚔️' },
      { id: 'kingdom-builder', name: 'Kingdom Builder', difficulty: 5, icon: '👑' },
      { id: 'war-commander', name: 'War Commander', difficulty: 6, icon: '🎖️' },
      { id: 'hex-conquest', name: 'Hex Conquest', difficulty: 7, icon: '⬡' },
      { id: 'empire-master', name: 'Empire Master', difficulty: 8, icon: '🌍' },
      { id: 'grand-strategy', name: 'Grand Strategy', difficulty: 9, icon: '📜' },
      { id: 'ultimate-tactics', name: 'Ultimate Tactics', difficulty: 10, icon: '🧠' },
    ]
  },
  {
    id: 'puzzle',
    name: 'Puzzle/Brain',
    icon: '🧩',
    color: 'from-purple-600 to-pink-500',
    description: 'Logic, matching, escape rooms',
    games: [
      { id: 'match-3', name: 'Match 3', difficulty: 1, icon: '💎' },
      { id: 'sliding-puzzle', name: 'Sliding Puzzle', difficulty: 2, icon: '🔢' },
      { id: 'word-search', name: 'Word Search', difficulty: 3, icon: '🔤' },
      { id: 'sudoku', name: 'Sudoku', difficulty: 4, icon: '9️⃣' },
      { id: 'logic-gates', name: 'Logic Gates', difficulty: 5, icon: '🔌' },
      { id: 'escape-room', name: 'Escape Room', difficulty: 6, icon: '🚪' },
      { id: 'pattern-master', name: 'Pattern Master', difficulty: 7, icon: '🎨' },
      { id: 'code-breaker', name: 'Code Breaker', difficulty: 8, icon: '🔐' },
      { id: 'mind-bender', name: 'Mind Bender', difficulty: 9, icon: '🌀' },
      { id: 'genius-puzzle', name: 'Genius Puzzle', difficulty: 10, icon: '💡' },
    ]
  },
  {
    id: 'racing',
    name: 'Racing/Sports',
    icon: '🏁',
    color: 'from-green-600 to-emerald-500',
    description: 'Speed, competition, athletics',
    games: [
      { id: 'simple-race', name: 'Simple Race', difficulty: 1, icon: '🚗' },
      { id: 'bike-sprint', name: 'Bike Sprint', difficulty: 2, icon: '🚴' },
      { id: 'drag-race', name: 'Drag Race', difficulty: 3, icon: '🏎️' },
      { id: 'soccer-kick', name: 'Soccer Kick', difficulty: 4, icon: '⚽' },
      { id: 'basketball-shoot', name: 'Basketball Shoot', difficulty: 5, icon: '🏀' },
      { id: 'golf-master', name: 'Golf Master', difficulty: 6, icon: '⛳' },
      { id: 'circuit-racer', name: 'Circuit Racer', difficulty: 7, icon: '🏆' },
      { id: 'extreme-sports', name: 'Extreme Sports', difficulty: 8, icon: '🎿' },
      { id: 'championship', name: 'Championship', difficulty: 9, icon: '🥇' },
      { id: 'ultimate-racing', name: 'Ultimate Racing', difficulty: 10, icon: '🚀' },
    ]
  },
  {
    id: 'rpg',
    name: 'RPG/Adventure',
    icon: '⚔️',
    color: 'from-amber-600 to-yellow-500',
    description: 'Story, progression, exploration',
    games: [
      { id: 'hero-quest', name: 'Hero Quest', difficulty: 1, icon: '🗡️' },
      { id: 'dungeon-crawl', name: 'Dungeon Crawl', difficulty: 2, icon: '🏰' },
      { id: 'treasure-hunter', name: 'Treasure Hunter', difficulty: 3, icon: '💰' },
      { id: 'dragon-slayer', name: 'Dragon Slayer', difficulty: 4, icon: '🐉' },
      { id: 'magic-quest', name: 'Magic Quest', difficulty: 5, icon: '🪄' },
      { id: 'epic-journey', name: 'Epic Journey', difficulty: 6, icon: '🗺️' },
      { id: 'realm-defender', name: 'Realm Defender', difficulty: 7, icon: '🛡️' },
      { id: 'legend-maker', name: 'Legend Maker', difficulty: 8, icon: '📖' },
      { id: 'mythic-hero', name: 'Mythic Hero', difficulty: 9, icon: '⭐' },
      { id: 'ultimate-rpg', name: 'Ultimate RPG', difficulty: 10, icon: '👑' },
    ]
  },
  {
    id: 'simulation',
    name: 'Simulation/Tycoon',
    icon: '🏗️',
    color: 'from-cyan-600 to-teal-500',
    description: 'Build, manage, grow empires',
    games: [
      { id: 'lemonade-stand', name: 'Lemonade Stand', difficulty: 1, icon: '🍋' },
      { id: 'pet-shop', name: 'Pet Shop', difficulty: 2, icon: '🐕' },
      { id: 'farm-builder', name: 'Farm Builder', difficulty: 3, icon: '🌾' },
      { id: 'restaurant-rush', name: 'Restaurant Rush', difficulty: 4, icon: '🍕' },
      { id: 'city-planner', name: 'City Planner', difficulty: 5, icon: '🏙️' },
      { id: 'airport-manager', name: 'Airport Manager', difficulty: 6, icon: '✈️' },
      { id: 'theme-park', name: 'Theme Park', difficulty: 7, icon: '🎢' },
      { id: 'space-station', name: 'Space Station', difficulty: 8, icon: '🛸' },
      { id: 'mega-corp', name: 'Mega Corp', difficulty: 9, icon: '🏢' },
      { id: 'universe-sim', name: 'Universe Sim', difficulty: 10, icon: '🌌' },
    ]
  },
  {
    id: 'shooter',
    name: 'Shooter/Combat',
    icon: '🎯',
    color: 'from-rose-600 to-red-500',
    description: 'Top-down, arena battles',
    games: [
      { id: 'target-practice', name: 'Target Practice', difficulty: 1, icon: '🎯' },
      { id: 'alien-blast', name: 'Alien Blast', difficulty: 2, icon: '👽' },
      { id: 'tank-battle', name: 'Tank Battle', difficulty: 3, icon: '🛡️' },
      { id: 'sniper-elite', name: 'Sniper Elite', difficulty: 4, icon: '🔭' },
      { id: 'arena-combat', name: 'Arena Combat', difficulty: 5, icon: '🏟️' },
      { id: 'mech-warrior', name: 'Mech Warrior', difficulty: 6, icon: '🤖' },
      { id: 'battle-royale', name: 'Battle Royale', difficulty: 7, icon: '👊' },
      { id: 'war-zone', name: 'War Zone', difficulty: 8, icon: '💣' },
      { id: 'elite-ops', name: 'Elite Ops', difficulty: 9, icon: '🎖️' },
      { id: 'ultimate-shooter', name: 'Ultimate Shooter', difficulty: 10, icon: '⚡' },
    ]
  },
  {
    id: 'cards',
    name: 'Card/Casino',
    icon: '🃏',
    color: 'from-violet-600 to-purple-500',
    description: 'Poker, blackjack, card battles',
    games: [
      { id: 'solitaire', name: 'Solitaire', difficulty: 1, icon: '🂡' },
      { id: 'memory-match', name: 'Memory Match', difficulty: 2, icon: '🧠' },
      { id: 'blackjack', name: 'Blackjack', difficulty: 3, icon: '🎰' },
      { id: 'poker-basic', name: 'Poker Basic', difficulty: 4, icon: '🃏' },
      { id: 'uno-style', name: 'Card Battle', difficulty: 5, icon: '🎴' },
      { id: 'rummy', name: 'Rummy', difficulty: 6, icon: '♠️' },
      { id: 'bridge', name: 'Bridge', difficulty: 7, icon: '♥️' },
      { id: 'tcg-battle', name: 'TCG Battle', difficulty: 8, icon: '⚔️' },
      { id: 'poker-pro', name: 'Poker Pro', difficulty: 9, icon: '💰' },
      { id: 'card-master', name: 'Card Master', difficulty: 10, icon: '👑' },
    ]
  },
  {
    id: 'multiplayer',
    name: 'Multiplayer/Social',
    icon: '👥',
    color: 'from-orange-600 to-amber-500',
    description: 'Co-op, competitive, party games',
    games: [
      { id: 'tic-tac-toe', name: 'Tic Tac Toe', difficulty: 1, icon: '⭕' },
      { id: 'connect-four', name: 'Connect Four', difficulty: 2, icon: '🔴' },
      { id: 'checkers', name: 'Checkers', difficulty: 3, icon: '⬛' },
      { id: 'battleship', name: 'Battleship', difficulty: 4, icon: '🚢' },
      { id: 'trivia-battle', name: 'Trivia Battle', difficulty: 5, icon: '❓' },
      { id: 'word-duel', name: 'Word Duel', difficulty: 6, icon: '📝' },
      { id: 'team-tactics', name: 'Team Tactics', difficulty: 7, icon: '🤝' },
      { id: 'party-games', name: 'Party Games', difficulty: 8, icon: '🎉' },
      { id: 'tournament', name: 'Tournament', difficulty: 9, icon: '🏆' },
      { id: 'ultimate-mp', name: 'Ultimate MP', difficulty: 10, icon: '🌟' },
    ]
  },
  {
    id: 'ai',
    name: 'AI/Creative',
    icon: '🤖',
    color: 'from-fuchsia-600 to-pink-500',
    description: 'AI-powered unique experiences',
    games: [
      { id: 'ai-guess', name: 'AI Guess', difficulty: 1, icon: '🔮' },
      { id: 'draw-ai', name: 'Draw & AI', difficulty: 2, icon: '🎨' },
      { id: 'story-maker', name: 'Story Maker', difficulty: 3, icon: '📚' },
      { id: 'music-creator', name: 'Music Creator', difficulty: 4, icon: '🎵' },
      { id: 'ai-trivia', name: 'AI Trivia', difficulty: 5, icon: '🧠' },
      { id: 'prediction-game', name: 'Prediction Game', difficulty: 6, icon: '📈' },
      { id: 'art-battle', name: 'Art Battle', difficulty: 7, icon: '🖼️' },
      { id: 'ai-adventure', name: 'AI Adventure', difficulty: 8, icon: '🗺️' },
      { id: 'neural-network', name: 'Neural Network', difficulty: 9, icon: '🔬' },
      { id: 'ultimate-ai', name: 'Ultimate AI', difficulty: 10, icon: '⚡' },
    ]
  },
]

// External Gaming Resources (from evaluation chat)
const EXTERNAL_RESOURCES = [
  {
    category: 'Gaming Challenges',
    links: [
      { name: 'LostGamer.io', url: 'https://lostgamer.io', description: 'GeoGuessr for video games - guess locations', icon: '🗺️' },
      { name: 'Neal.fun', url: 'https://neal.fun', description: 'Educational games & experiments', icon: '🎮' },
    ]
  },
  {
    category: 'Classic Games Portal',
    links: [
      { name: 'Emupedia.net', url: 'https://emupedia.net', description: 'Windows 95/98 classics in browser', icon: '💾' },
      { name: 'PlayRetroGames.online', url: 'https://playretrogames.online', description: 'PS1, NES, SNES, Sega classics', icon: '🕹️' },
    ]
  },
  {
    category: 'Browser MMORPG',
    links: [
      { name: 'Hordes.io', url: 'https://hordes.io', description: 'Free 3D browser MMORPG', icon: '⚔️' },
    ]
  },
  {
    category: 'Gaming Resources',
    links: [
      { name: 'Modrinth.com', url: 'https://modrinth.com', description: 'Minecraft mods platform', icon: '🔧' },
      { name: 'GrabCraft.com', url: 'https://grabcraft.com', description: 'Minecraft blueprints & schematics', icon: '🏗️' },
      { name: 'CheapShark.com', url: 'https://cheapshark.com', description: 'PC game price comparison', icon: '💰' },
    ]
  },
  {
    category: 'Game Development',
    links: [
      { name: 'Kenney.nl', url: 'https://kenney.nl', description: '40K+ free game assets (CC0)', icon: '🎨' },
      { name: 'Poly Haven', url: 'https://polyhaven.com', description: 'Free 3D models & textures', icon: '🖼️' },
      { name: 'Freesound.org', url: 'https://freesound.org', description: '500K+ free sound effects', icon: '🔊' },
    ]
  },
]

// Active Game Component - Will hold the currently playing game
interface GameState {
  gameId: string
  score: number
  level: number
  isPlaying: boolean
}

// =============================================================================
// GAME ENGINES - Each category has its own game logic
// =============================================================================

// Simple Space Shooter Game
function SpaceShooterGame({ onScore, onGameOver }: { onScore: (s: number) => void, onGameOver: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationId: number
    let playerX = canvas.width / 2
    const playerY = canvas.height - 50
    let bullets: { x: number; y: number }[] = []
    let enemies: { x: number; y: number; speed: number }[] = []
    let gameScore = 0
    let gameOver = false
    
    // Spawn enemies
    const spawnEnemy = () => {
      if (!gameOver) {
        enemies.push({
          x: Math.random() * (canvas.width - 30),
          y: -30,
          speed: 2 + Math.random() * 2
        })
      }
    }
    
    const enemyInterval = setInterval(spawnEnemy, 1000)
    
    // Handle keyboard
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') playerX = Math.max(20, playerX - 20)
      if (e.key === 'ArrowRight') playerX = Math.min(canvas.width - 20, playerX + 20)
      if (e.key === ' ' || e.key === 'ArrowUp') {
        bullets.push({ x: playerX, y: playerY - 20 })
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    // Game loop
    const gameLoop = () => {
      if (gameOver) return
      
      ctx.fillStyle = '#0a0a1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw stars
      ctx.fillStyle = '#ffffff33'
      for (let i = 0; i < 50; i++) {
        ctx.fillRect(
          (i * 17 + Date.now() / 50) % canvas.width,
          (i * 23 + Date.now() / 100) % canvas.height,
          2, 2
        )
      }
      
      // Draw player
      ctx.fillStyle = '#00ff88'
      ctx.beginPath()
      ctx.moveTo(playerX, playerY - 20)
      ctx.lineTo(playerX - 15, playerY + 10)
      ctx.lineTo(playerX + 15, playerY + 10)
      ctx.closePath()
      ctx.fill()
      
      // Update and draw bullets
      bullets = bullets.filter(b => {
        b.y -= 10
        ctx.fillStyle = '#ffff00'
        ctx.fillRect(b.x - 2, b.y, 4, 10)
        return b.y > 0
      })
      
      // Update and draw enemies
      enemies = enemies.filter(e => {
        e.y += e.speed
        ctx.fillStyle = '#ff4444'
        ctx.fillRect(e.x, e.y, 30, 30)
        
        // Check collision with player
        if (e.y > playerY - 20 && Math.abs(e.x + 15 - playerX) < 25) {
          gameOver = true
          onGameOver()
          return false
        }
        
        // Check collision with bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i]
          if (b.x > e.x && b.x < e.x + 30 && b.y > e.y && b.y < e.y + 30) {
            bullets.splice(i, 1)
            gameScore += 10
            setScore(gameScore)
            onScore(gameScore)
            return false
          }
        }
        
        return e.y < canvas.height
      })
      
      // Draw score
      ctx.fillStyle = '#ffffff'
      ctx.font = '20px monospace'
      ctx.fillText(`Score: ${gameScore}`, 10, 30)
      
      animationId = requestAnimationFrame(gameLoop)
    }
    
    gameLoop()
    
    return () => {
      cancelAnimationFrame(animationId)
      clearInterval(enemyInterval)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onScore, onGameOver])
  
  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={500}
        className="border-2 border-green-500 rounded-lg"
      />
      <p className="text-sm text-gray-400 mt-2">Use ← → to move, SPACE to shoot</p>
    </div>
  )
}

// Match 3 Puzzle Game
function Match3Game({ onScore, onGameOver }: { onScore: (s: number) => void, onGameOver: () => void }) {
  const [grid, setGrid] = useState<number[][]>([])
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null)
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(30)
  
  const colors = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟠']
  
  useEffect(() => {
    // Initialize grid
    const newGrid: number[][] = []
    for (let i = 0; i < 8; i++) {
      const row: number[] = []
      for (let j = 0; j < 8; j++) {
        row.push(Math.floor(Math.random() * 6))
      }
      newGrid.push(row)
    }
    setGrid(newGrid)
  }, [])
  
  const checkMatches = (g: number[][]) => {
    const matches: Set<string> = new Set()
    
    // Check horizontal
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 6; j++) {
        if (g[i][j] === g[i][j + 1] && g[i][j] === g[i][j + 2]) {
          matches.add(`${i},${j}`)
          matches.add(`${i},${j + 1}`)
          matches.add(`${i},${j + 2}`)
        }
      }
    }
    
    // Check vertical
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 8; j++) {
        if (g[i][j] === g[i + 1][j] && g[i][j] === g[i + 2][j]) {
          matches.add(`${i},${j}`)
          matches.add(`${i + 1},${j}`)
          matches.add(`${i + 2},${j}`)
        }
      }
    }
    
    return matches
  }
  
  const handleClick = (row: number, col: number) => {
    if (!selected) {
      setSelected({ row, col })
    } else {
      // Check if adjacent
      const isAdjacent = 
        (Math.abs(selected.row - row) === 1 && selected.col === col) ||
        (Math.abs(selected.col - col) === 1 && selected.row === row)
      
      if (isAdjacent) {
        // Swap
        const newGrid = grid.map(r => [...r])
        const temp = newGrid[row][col]
        newGrid[row][col] = newGrid[selected.row][selected.col]
        newGrid[selected.row][selected.col] = temp
        
        const matches = checkMatches(newGrid)
        if (matches.size > 0) {
          // Remove matches and add score
          matches.forEach(m => {
            const [r, c] = m.split(',').map(Number)
            newGrid[r][c] = Math.floor(Math.random() * 6)
          })
          const newScore = score + matches.size * 10
          setScore(newScore)
          onScore(newScore)
        } else {
          // Swap back
          newGrid[selected.row][selected.col] = newGrid[row][col]
          newGrid[row][col] = temp
        }
        
        setGrid(newGrid)
        setMoves(m => {
          if (m <= 1) {
            onGameOver()
            return 0
          }
          return m - 1
        })
      }
      setSelected(null)
    }
  }
  
  if (grid.length === 0) return <div>Loading...</div>
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-xs mb-4">
        <span className="text-white">Score: {score}</span>
        <span className="text-white">Moves: {moves}</span>
      </div>
      <div className="grid grid-cols-8 gap-1 p-2 bg-gray-800 rounded-lg">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <button
              key={`${i}-${j}`}
              onClick={() => handleClick(i, j)}
              className={`w-8 h-8 text-xl flex items-center justify-center rounded transition-all ${
                selected?.row === i && selected?.col === j
                  ? 'ring-2 ring-white scale-110'
                  : 'hover:scale-105'
              }`}
            >
              {colors[cell]}
            </button>
          ))
        )}
      </div>
      <p className="text-sm text-gray-400 mt-2">Match 3 or more of the same color!</p>
    </div>
  )
}

// Tower Defense Game
function TowerDefenseGame({ onScore, onGameOver }: { onScore: (s: number) => void, onGameOver: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gold, setGold] = useState(100)
  const [lives, setLives] = useState(10)
  const [wave, setWave] = useState(1)
  const [score, setScore] = useState(0)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationId: number
    let towers: { x: number; y: number; range: number; damage: number; cooldown: number }[] = []
    let enemies: { x: number; y: number; health: number; maxHealth: number; speed: number }[] = []
    let projectiles: { x: number; y: number; targetX: number; targetY: number }[] = []
    let currentGold = 100
    let currentLives = 10
    let currentScore = 0
    let gameOver = false
    
    // Path for enemies
    const path = [
      { x: 0, y: 150 },
      { x: 100, y: 150 },
      { x: 100, y: 50 },
      { x: 250, y: 50 },
      { x: 250, y: 250 },
      { x: 350, y: 250 },
      { x: 350, y: 150 },
      { x: 400, y: 150 },
    ]
    
    // Spawn enemies
    let enemyCount = 0
    const spawnEnemy = () => {
      if (gameOver || enemyCount >= 5) return
      enemies.push({
        x: path[0].x,
        y: path[0].y,
        health: 50 + wave * 10,
        maxHealth: 50 + wave * 10,
        speed: 0.5 + wave * 0.1,
      })
      enemyCount++
    }
    
    const enemyInterval = setInterval(spawnEnemy, 2000)
    
    // Place tower on click
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      if (currentGold >= 50) {
        towers.push({ x, y, range: 80, damage: 10, cooldown: 0 })
        currentGold -= 50
        setGold(currentGold)
      }
    }
    
    canvas.addEventListener('click', handleClick)
    
    // Game loop
    const gameLoop = () => {
      if (gameOver) return
      
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw path
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 30
      ctx.beginPath()
      ctx.moveTo(path[0].x, path[0].y)
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y)
      }
      ctx.stroke()
      
      // Draw towers
      towers.forEach(t => {
        ctx.fillStyle = '#4488ff'
        ctx.beginPath()
        ctx.arc(t.x, t.y, 15, 0, Math.PI * 2)
        ctx.fill()
        
        // Range indicator
        ctx.strokeStyle = '#4488ff33'
        ctx.beginPath()
        ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2)
        ctx.stroke()
        
        // Shoot at enemies
        if (t.cooldown <= 0) {
          for (const e of enemies) {
            const dist = Math.sqrt((e.x - t.x) ** 2 + (e.y - t.y) ** 2)
            if (dist < t.range) {
              projectiles.push({ x: t.x, y: t.y, targetX: e.x, targetY: e.y })
              e.health -= t.damage
              t.cooldown = 30
              break
            }
          }
        } else {
          t.cooldown--
        }
      })
      
      // Update projectiles
      projectiles = projectiles.filter(p => {
        const dx = p.targetX - p.x
        const dy = p.targetY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 5) return false
        p.x += (dx / dist) * 10
        p.y += (dy / dist) * 10
        
        ctx.fillStyle = '#ffff00'
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fill()
        
        return true
      })
      
      // Update enemies
      enemies = enemies.filter(e => {
        if (e.health <= 0) {
          currentGold += 10
          currentScore += 10
          setGold(currentGold)
          setScore(currentScore)
          onScore(currentScore)
          return false
        }
        
        // Move along path
        let pathIndex = 0
        for (let i = 0; i < path.length - 1; i++) {
          if (Math.abs(e.x - path[i].x) < 5 && Math.abs(e.y - path[i].y) < 5) {
            pathIndex = i + 1
            break
          }
        }
        
        if (pathIndex < path.length) {
          const target = path[pathIndex]
          const dx = target.x - e.x
          const dy = target.y - e.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 1) {
            e.x += (dx / dist) * e.speed
            e.y += (dy / dist) * e.speed
          }
        }
        
        // Draw enemy
        ctx.fillStyle = '#ff4444'
        ctx.beginPath()
        ctx.arc(e.x, e.y, 12, 0, Math.PI * 2)
        ctx.fill()
        
        // Health bar
        ctx.fillStyle = '#333'
        ctx.fillRect(e.x - 15, e.y - 20, 30, 5)
        ctx.fillStyle = '#00ff00'
        ctx.fillRect(e.x - 15, e.y - 20, 30 * (e.health / e.maxHealth), 5)
        
        // Check if reached end
        if (e.x >= path[path.length - 1].x - 5) {
          currentLives--
          setLives(currentLives)
          if (currentLives <= 0) {
            gameOver = true
            onGameOver()
          }
          return false
        }
        
        return true
      })
      
      // Draw UI
      ctx.fillStyle = '#ffffff'
      ctx.font = '14px monospace'
      ctx.fillText(`Gold: ${currentGold} | Lives: ${currentLives} | Wave: ${wave}`, 10, 20)
      ctx.fillText('Click to place tower (50 gold)', 10, canvas.height - 10)
      
      animationId = requestAnimationFrame(gameLoop)
    }
    
    gameLoop()
    
    return () => {
      cancelAnimationFrame(animationId)
      clearInterval(enemyInterval)
      canvas.removeEventListener('click', handleClick)
    }
  }, [wave, onScore, onGameOver])
  
  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={300}
        className="border-2 border-blue-500 rounded-lg cursor-crosshair"
      />
      <p className="text-sm text-gray-400 mt-2">Click to place towers, defend against enemies!</p>
    </div>
  )
}

// Memory Match Game
function MemoryMatchGame({ onScore, onGameOver }: { onScore: (s: number) => void, onGameOver: () => void }) {
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  
  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']
  
  useEffect(() => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, id) => ({ id, emoji, flipped: false, matched: false }))
    setCards(shuffled)
  }, [])
  
  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return
    if (cards[id].matched || cards[id].flipped) return
    
    const newCards = [...cards]
    newCards[id].flipped = true
    setCards(newCards)
    
    const newFlipped = [...flippedCards, id]
    setFlippedCards(newFlipped)
    
    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      
      if (cards[newFlipped[0]].emoji === cards[newFlipped[1]].emoji) {
        // Match!
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[newFlipped[0]].matched = true
          matchedCards[newFlipped[1]].matched = true
          setCards(matchedCards)
          setFlippedCards([])
          
          const newMatches = matches + 1
          setMatches(newMatches)
          onScore(newMatches * 100)
          
          if (newMatches === 8) {
            onGameOver()
          }
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards]
          resetCards[newFlipped[0]].flipped = false
          resetCards[newFlipped[1]].flipped = false
          setCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-xs mb-4">
        <span className="text-white">Moves: {moves}</span>
        <span className="text-white">Matches: {matches}/8</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-16 h-16 text-2xl rounded-lg transition-all duration-300 ${
              card.flipped || card.matched
                ? 'bg-purple-600'
                : 'bg-gray-700 hover:bg-gray-600'
            } ${card.matched ? 'opacity-50' : ''}`}
          >
            {card.flipped || card.matched ? card.emoji : '❓'}
          </button>
        ))}
      </div>
    </div>
  )
}

// Simple Racing Game
function SimpleRaceGame({ onScore, onGameOver }: { onScore: (s: number) => void, onGameOver: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationId: number
    let playerX = canvas.width / 2
    let obstacles: { x: number; y: number; width: number }[] = []
    let gameScore = 0
    let speed = 5
    let gameOver = false
    
    const spawnObstacle = () => {
      if (!gameOver) {
        const width = 40 + Math.random() * 60
        obstacles.push({
          x: Math.random() * (canvas.width - width),
          y: -50,
          width
        })
      }
    }
    
    const obstacleInterval = setInterval(spawnObstacle, 800)
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') playerX = Math.max(20, playerX - 15)
      if (e.key === 'ArrowRight') playerX = Math.min(canvas.width - 20, playerX + 15)
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    const gameLoop = () => {
      if (gameOver) return
      
      // Draw road
      ctx.fillStyle = '#333'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Road markings
      ctx.strokeStyle = '#ffff00'
      ctx.setLineDash([20, 20])
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, (Date.now() / 20) % 40)
      for (let y = (Date.now() / 20) % 40; y < canvas.height; y += 40) {
        ctx.lineTo(canvas.width / 2, y)
      }
      ctx.stroke()
      ctx.setLineDash([])
      
      // Draw player car
      ctx.fillStyle = '#00aaff'
      ctx.fillRect(playerX - 15, canvas.height - 60, 30, 50)
      ctx.fillStyle = '#0088cc'
      ctx.fillRect(playerX - 10, canvas.height - 55, 20, 15)
      
      // Update obstacles
      obstacles = obstacles.filter(o => {
        o.y += speed
        
        // Draw obstacle
        ctx.fillStyle = '#ff4444'
        ctx.fillRect(o.x, o.y, o.width, 40)
        
        // Collision check
        if (o.y + 40 > canvas.height - 60 && o.y < canvas.height - 10) {
          if (playerX + 15 > o.x && playerX - 15 < o.x + o.width) {
            gameOver = true
            onGameOver()
            return false
          }
        }
        
        // Score for passing
        if (o.y > canvas.height && !gameOver) {
          gameScore += 10
          speed = Math.min(15, 5 + gameScore / 100)
          setScore(gameScore)
          onScore(gameScore)
        }
        
        return o.y < canvas.height + 50
      })
      
      // Draw score
      ctx.fillStyle = '#ffffff'
      ctx.font = '20px monospace'
      ctx.fillText(`Score: ${gameScore}`, 10, 30)
      ctx.fillText(`Speed: ${speed.toFixed(1)}`, 10, 55)
      
      animationId = requestAnimationFrame(gameLoop)
    }
    
    gameLoop()
    
    return () => {
      cancelAnimationFrame(animationId)
      clearInterval(obstacleInterval)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onScore, onGameOver])
  
  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={500}
        className="border-2 border-yellow-500 rounded-lg"
      />
      <p className="text-sm text-gray-400 mt-2">Use ← → to dodge obstacles</p>
    </div>
  )
}

// Blackjack Game
function BlackjackGame({ onScore, onGameOver }: { onScore: (s: number) => void, onGameOver: () => void }) {
  const [deck, setDeck] = useState<string[]>([])
  const [playerHand, setPlayerHand] = useState<string[]>([])
  const [dealerHand, setDealerHand] = useState<string[]>([])
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer' | 'done'>('betting')
  const [chips, setChips] = useState(1000)
  const [bet, setBet] = useState(100)
  const [message, setMessage] = useState('')
  
  const suits = ['♠️', '♥️', '♦️', '♣️']
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  
  const createDeck = () => {
    const newDeck: string[] = []
    for (const suit of suits) {
      for (const value of values) {
        newDeck.push(`${value}${suit}`)
      }
    }
    return newDeck.sort(() => Math.random() - 0.5)
  }
  
  const getCardValue = (card: string): number => {
    const value = card.slice(0, -2)
    if (value === 'A') return 11
    if (['K', 'Q', 'J'].includes(value)) return 10
    return parseInt(value)
  }
  
  const getHandValue = (hand: string[]): number => {
    let value = hand.reduce((sum, card) => sum + getCardValue(card), 0)
    let aces = hand.filter(card => card.startsWith('A')).length
    while (value > 21 && aces > 0) {
      value -= 10
      aces--
    }
    return value
  }
  
  const deal = () => {
    const newDeck = createDeck()
    const pHand = [newDeck.pop()!, newDeck.pop()!]
    const dHand = [newDeck.pop()!, newDeck.pop()!]
    setDeck(newDeck)
    setPlayerHand(pHand)
    setDealerHand(dHand)
    setGameState('playing')
    setMessage('')
    
    if (getHandValue(pHand) === 21) {
      setMessage('Blackjack!')
      setChips(c => c + bet * 1.5)
      setGameState('done')
      onScore(chips + bet * 1.5)
    }
  }
  
  const hit = () => {
    const newDeck = [...deck]
    const newHand = [...playerHand, newDeck.pop()!]
    setDeck(newDeck)
    setPlayerHand(newHand)
    
    if (getHandValue(newHand) > 21) {
      setMessage('Bust!')
      setChips(c => c - bet)
      setGameState('done')
      if (chips - bet <= 0) onGameOver()
    }
  }
  
  const stand = () => {
    setGameState('dealer')
    let dHand = [...dealerHand]
    let newDeck = [...deck]
    
    while (getHandValue(dHand) < 17) {
      dHand.push(newDeck.pop()!)
    }
    
    setDealerHand(dHand)
    setDeck(newDeck)
    
    const playerValue = getHandValue(playerHand)
    const dealerValue = getHandValue(dHand)
    
    if (dealerValue > 21 || playerValue > dealerValue) {
      setMessage('You win!')
      setChips(c => c + bet)
      onScore(chips + bet)
    } else if (dealerValue > playerValue) {
      setMessage('Dealer wins!')
      setChips(c => c - bet)
      if (chips - bet <= 0) onGameOver()
    } else {
      setMessage('Push!')
    }
    
    setGameState('done')
  }
  
  return (
    <div className="flex flex-col items-center p-4 bg-green-800 rounded-xl min-w-[350px]">
      <div className="text-white mb-4">Chips: ${chips} | Bet: ${bet}</div>
      
      {gameState === 'betting' && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {[50, 100, 200, 500].map(amount => (
              <button
                key={amount}
                onClick={() => setBet(amount)}
                className={`px-4 py-2 rounded ${bet === amount ? 'bg-yellow-500' : 'bg-gray-600'}`}
              >
                ${amount}
              </button>
            ))}
          </div>
          <button onClick={deal} className="px-6 py-3 bg-blue-600 rounded-lg font-bold">
            Deal
          </button>
        </div>
      )}
      
      {(gameState === 'playing' || gameState === 'dealer' || gameState === 'done') && (
        <>
          <div className="mb-4">
            <p className="text-white text-sm mb-1">Dealer: {gameState === 'playing' ? '?' : getHandValue(dealerHand)}</p>
            <div className="flex gap-2">
              {dealerHand.map((card, i) => (
                <div key={i} className="w-12 h-16 bg-white rounded flex items-center justify-center text-lg">
                  {i === 1 && gameState === 'playing' ? '🂠' : card}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-white text-sm mb-1">You: {getHandValue(playerHand)}</p>
            <div className="flex gap-2">
              {playerHand.map((card, i) => (
                <div key={i} className="w-12 h-16 bg-white rounded flex items-center justify-center text-lg">
                  {card}
                </div>
              ))}
            </div>
          </div>
          
          {message && <p className="text-2xl font-bold text-yellow-400 mb-4">{message}</p>}
          
          {gameState === 'playing' && (
            <div className="flex gap-4">
              <button onClick={hit} className="px-6 py-2 bg-green-600 rounded-lg">Hit</button>
              <button onClick={stand} className="px-6 py-2 bg-red-600 rounded-lg">Stand</button>
            </div>
          )}
          
          {gameState === 'done' && (
            <button onClick={() => setGameState('betting')} className="px-6 py-2 bg-blue-600 rounded-lg">
              New Hand
            </button>
          )}
        </>
      )}
    </div>
  )
}

// Trivia Game
function TriviaGame({ onScore, onGameOver }: { onScore: (s: number) => void, onGameOver: () => void }) {
  const questions = [
    { q: 'What planet is known as the Red Planet?', answers: ['Mars', 'Venus', 'Jupiter', 'Saturn'], correct: 0 },
    { q: 'What is the largest ocean on Earth?', answers: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correct: 2 },
    { q: 'How many continents are there?', answers: ['5', '6', '7', '8'], correct: 2 },
    { q: 'What is the capital of France?', answers: ['London', 'Berlin', 'Madrid', 'Paris'], correct: 3 },
    { q: 'What is H2O commonly known as?', answers: ['Salt', 'Water', 'Sugar', 'Oil'], correct: 1 },
    { q: 'Who painted the Mona Lisa?', answers: ['Van Gogh', 'Picasso', 'Da Vinci', 'Monet'], correct: 2 },
    { q: 'What is the largest mammal?', answers: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippo'], correct: 1 },
    { q: 'How many legs does a spider have?', answers: ['6', '8', '10', '12'], correct: 1 },
    { q: 'What year did WW2 end?', answers: ['1943', '1944', '1945', '1946'], correct: 2 },
    { q: 'What is the hardest natural substance?', answers: ['Gold', 'Iron', 'Diamond', 'Platinum'], correct: 2 },
  ]
  
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)
  const [gameEnded, setGameEnded] = useState(false)
  
  const handleAnswer = (index: number) => {
    if (showResult) return
    
    if (index === questions[currentQ].correct) {
      setShowResult('correct')
      const newScore = score + 100
      setScore(newScore)
      onScore(newScore)
    } else {
      setShowResult('wrong')
    }
    
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(c => c + 1)
        setShowResult(null)
      } else {
        setGameEnded(true)
        onGameOver()
      }
    }, 1000)
  }
  
  if (gameEnded) {
    return (
      <div className="text-center p-8">
        <h3 className="text-2xl font-bold text-white mb-4">Game Over!</h3>
        <p className="text-xl text-green-400">Final Score: {score}/{questions.length * 100}</p>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center p-4 max-w-md">
      <div className="text-white mb-2">Question {currentQ + 1}/{questions.length}</div>
      <div className="text-xl text-white mb-6 text-center">{questions[currentQ].q}</div>
      
      <div className="grid grid-cols-2 gap-3 w-full">
        {questions[currentQ].answers.map((answer, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className={`p-4 rounded-lg text-white font-medium transition-all ${
              showResult
                ? i === questions[currentQ].correct
                  ? 'bg-green-600'
                  : showResult === 'wrong' && i !== questions[currentQ].correct
                    ? 'bg-red-600'
                    : 'bg-gray-600'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {answer}
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-white">Score: {score}</div>
    </div>
  )
}

// Idle Clicker Game
function IdleClickerGame({ onScore, onGameOver }: { onScore: (s: number) => void, onGameOver: () => void }) {
  const [coins, setCoins] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [autoClickers, setAutoClickers] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickers > 0) {
        setCoins(c => {
          const newCoins = c + autoClickers
          onScore(newCoins)
          return newCoins
        })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoClickers, onScore])
  
  const handleClick = () => {
    setCoins(c => {
      const newCoins = c + clickPower
      onScore(newCoins)
      return newCoins
    })
  }
  
  const buyClickPower = () => {
    const cost = clickPower * 50
    if (coins >= cost) {
      setCoins(c => c - cost)
      setClickPower(p => p + 1)
    }
  }
  
  const buyAutoClicker = () => {
    const cost = (autoClickers + 1) * 100
    if (coins >= cost) {
      setCoins(c => c - cost)
      setAutoClickers(a => a + 1)
    }
  }
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="text-4xl font-bold text-yellow-400 mb-4">💰 {coins.toLocaleString()}</div>
      
      <button
        onClick={handleClick}
        className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-4xl 
                   shadow-lg hover:scale-110 active:scale-95 transition-transform mb-6"
      >
        🪙
      </button>
      
      <div className="text-white mb-4">
        Click Power: {clickPower} | Auto: {autoClickers}/sec
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={buyClickPower}
          disabled={coins < clickPower * 50}
          className="px-4 py-2 bg-blue-600 rounded-lg disabled:opacity-50"
        >
          +1 Power (💰{clickPower * 50})
        </button>
        <button
          onClick={buyAutoClicker}
          disabled={coins < (autoClickers + 1) * 100}
          className="px-4 py-2 bg-green-600 rounded-lg disabled:opacity-50"
        >
          Auto Clicker (💰{(autoClickers + 1) * 100})
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN GAMES HUB PAGE
// =============================================================================

export default function GamesHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentGame, setCurrentGame] = useState<{ categoryId: string; gameId: string } | null>(null)
  const [score, setScore] = useState(0)
  const [showExternal, setShowExternal] = useState(false)
  
  const handleGameOver = () => {
    // Could save score, show leaderboard, etc.
  }
  
  const renderGame = () => {
    if (!currentGame) return null
    
    const gameKey = `${currentGame.categoryId}-${currentGame.gameId}`
    
    // Map games to their components
    const gameComponents: Record<string, JSX.Element> = {
      'action-space-shooter': <SpaceShooterGame onScore={setScore} onGameOver={handleGameOver} />,
      'puzzle-match-3': <Match3Game onScore={setScore} onGameOver={handleGameOver} />,
      'strategy-tower-defense-basic': <TowerDefenseGame onScore={setScore} onGameOver={handleGameOver} />,
      'cards-memory-match': <MemoryMatchGame onScore={setScore} onGameOver={handleGameOver} />,
      'racing-simple-race': <SimpleRaceGame onScore={setScore} onGameOver={handleGameOver} />,
      'cards-blackjack': <BlackjackGame onScore={setScore} onGameOver={handleGameOver} />,
      'multiplayer-trivia-battle': <TriviaGame onScore={setScore} onGameOver={handleGameOver} />,
      'simulation-lemonade-stand': <IdleClickerGame onScore={setScore} onGameOver={handleGameOver} />,
    }
    
    return gameComponents[gameKey] || (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-xl text-white mb-2">Game Coming Soon!</h3>
        <p className="text-gray-400">This game is under development.</p>
        <button
          onClick={() => setCurrentGame(null)}
          className="mt-4 px-6 py-2 bg-blue-600 rounded-lg"
        >
          Back to Games
        </button>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CR Games Hub
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-white">Score: {score.toLocaleString()}</span>
            <button
              onClick={() => setShowExternal(!showExternal)}
              className="px-4 py-2 bg-purple-600 rounded-lg text-white text-sm"
            >
              {showExternal ? 'Our Games' : 'Gaming Resources'}
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Current Game View */}
        {currentGame && (
          <div className="mb-8">
            <button
              onClick={() => setCurrentGame(null)}
              className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
            >
              ← Back to Games
            </button>
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 flex justify-center">
              {renderGame()}
            </div>
          </div>
        )}
        
        {/* External Resources View */}
        {showExternal && !currentGame && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">🌐 Gaming Resources</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXTERNAL_RESOURCES.map((category) => (
                <div key={category.category} className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
                  <h3 className="text-lg font-bold text-purple-400 mb-4">{category.category}</h3>
                  <div className="space-y-3">
                    {category.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-2xl">{link.icon}</span>
                        <div>
                          <div className="text-white font-medium">{link.name}</div>
                          <div className="text-sm text-gray-400">{link.description}</div>
                        </div>
                        <span className="ml-auto text-gray-500">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Games Grid */}
        {!currentGame && !showExternal && (
          <>
            {/* Hero */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-4">
                100+ Games
              </h1>
              <p className="text-xl text-gray-400">10 Categories • All Difficulty Levels • Play Free</p>
            </div>
            
            {/* Category Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full transition-all ${
                  !selectedCategory ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                All Games
              </button>
              {GAME_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedCategory === cat.id ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
            
            {/* Games by Category */}
            {GAME_CATEGORIES
              .filter(cat => !selectedCategory || cat.id === selectedCategory)
              .map((category) => (
                <div key={category.id} className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                      <p className="text-gray-400">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {category.games.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => setCurrentGame({ categoryId: category.id, gameId: game.id })}
                        className={`bg-gradient-to-br ${category.color} p-4 rounded-xl text-left hover:scale-105 transition-transform`}
                      >
                        <div className="text-3xl mb-2">{game.icon}</div>
                        <div className="text-white font-semibold">{game.name}</div>
                        <div className="flex gap-1 mt-2">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < game.difficulty ? 'bg-white' : 'bg-white/30'
                              }`}
                            />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 CR AudioViz AI, LLC • 100 Games • 10 Categories • Endless Fun
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/" className="text-gray-500 hover:text-white">Home</Link>
            <Link href="/apps" className="text-gray-500 hover:text-white">Apps</Link>
            <Link href="/pricing" className="text-gray-500 hover:text-white">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
