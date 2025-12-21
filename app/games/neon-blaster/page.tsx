'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Star, Zap, Shield, Heart, Volume2, VolumeX } from 'lucide-react'

// =============================================================================
// NEON BLASTER - Professional Twin-Stick Shooter
// CR AudioViz AI Games - Game #1
// Features: 10 Levels, Wave System, Upgrades, Achievements, Particles, Screen Shake
// =============================================================================

// ==================== TYPES ====================
interface Vector2D {
  x: number
  y: number
}

interface Bullet extends Vector2D {
  vx: number
  vy: number
  damage: number
  color: string
  size: number
  piercing: boolean
}

interface Enemy extends Vector2D {
  vx: number
  vy: number
  health: number
  maxHealth: number
  type: 'drone' | 'fighter' | 'tank' | 'boss' | 'swarm' | 'sniper'
  color: string
  size: number
  speed: number
  points: number
  lastShot?: number
  angle?: number
}

interface Particle extends Vector2D {
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
  type: 'explosion' | 'trail' | 'spark' | 'powerup' | 'hit'
}

interface PowerUp extends Vector2D {
  type: 'health' | 'shield' | 'rapidfire' | 'damage' | 'multishot' | 'piercing'
  duration: number
  color: string
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  target: number
}

interface GameState {
  score: number
  highScore: number
  level: number
  wave: number
  wavesPerLevel: number
  health: number
  maxHealth: number
  shield: number
  maxShield: number
  combo: number
  maxCombo: number
  kills: number
  totalKills: number
  accuracy: number
  shotsFired: number
  shotsHit: number
  powerups: { [key: string]: number }
  upgrades: {
    damage: number
    fireRate: number
    bulletSpeed: number
    moveSpeed: number
  }
}

// ==================== CONSTANTS ====================
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const PLAYER_SIZE = 20
const BULLET_SPEED = 12
const BASE_FIRE_RATE = 150
const BASE_DAMAGE = 1
const ENEMY_SPAWN_RATE = 2000
const WAVES_PER_LEVEL = 5
const ENEMIES_PER_WAVE_BASE = 5

const ENEMY_CONFIGS = {
  drone: { health: 1, speed: 2, size: 15, points: 10, color: '#00ff88' },
  fighter: { health: 2, speed: 3, size: 18, points: 25, color: '#ff8800' },
  tank: { health: 5, speed: 1, size: 25, points: 50, color: '#ff0088' },
  boss: { health: 20, speed: 0.5, size: 40, points: 200, color: '#ff0000' },
  swarm: { health: 1, speed: 4, size: 10, points: 5, color: '#88ff00' },
  sniper: { health: 2, speed: 1.5, size: 16, points: 35, color: '#00ffff' },
}

const POWERUP_CONFIGS = {
  health: { color: '#ff4444', duration: 0 },
  shield: { color: '#4444ff', duration: 10000 },
  rapidfire: { color: '#ffff00', duration: 8000 },
  damage: { color: '#ff00ff', duration: 10000 },
  multishot: { color: '#00ffff', duration: 8000 },
  piercing: { color: '#ff8800', duration: 6000 },
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_blood', name: 'First Blood', description: 'Kill your first enemy', icon: '🎯', unlocked: false, progress: 0, target: 1 },
  { id: 'combo_10', name: 'Combo Master', description: 'Reach a 10x combo', icon: '🔥', unlocked: false, progress: 0, target: 10 },
  { id: 'combo_50', name: 'Unstoppable', description: 'Reach a 50x combo', icon: '💥', unlocked: false, progress: 0, target: 50 },
  { id: 'kills_100', name: 'Century', description: 'Kill 100 enemies', icon: '💯', unlocked: false, progress: 0, target: 100 },
  { id: 'kills_500', name: 'Exterminator', description: 'Kill 500 enemies', icon: '☠️', unlocked: false, progress: 0, target: 500 },
  { id: 'level_5', name: 'Halfway There', description: 'Reach level 5', icon: '⭐', unlocked: false, progress: 0, target: 5 },
  { id: 'level_10', name: 'Neon Master', description: 'Complete level 10', icon: '👑', unlocked: false, progress: 0, target: 10 },
  { id: 'no_damage', name: 'Untouchable', description: 'Complete a wave without taking damage', icon: '🛡️', unlocked: false, progress: 0, target: 1 },
  { id: 'boss_killer', name: 'Boss Slayer', description: 'Defeat a boss enemy', icon: '🏆', unlocked: false, progress: 0, target: 1 },
  { id: 'powerup_collector', name: 'Collector', description: 'Collect 25 powerups', icon: '💎', unlocked: false, progress: 0, target: 25 },
]

// ==================== SOUND EFFECTS (Web Audio API) ====================
class SoundEngine {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true

  init() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume: number = 0.1) {
    if (!this.enabled || !this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = type
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  shoot() { this.playTone(800, 0.05, 'square', 0.05) }
  hit() { this.playTone(200, 0.1, 'sawtooth', 0.08) }
  explosion() { this.playTone(100, 0.2, 'sawtooth', 0.1) }
  powerup() { this.playTone(600, 0.1, 'sine', 0.1); setTimeout(() => this.playTone(800, 0.1, 'sine', 0.1), 100) }
  levelUp() { this.playTone(400, 0.1, 'sine', 0.1); setTimeout(() => this.playTone(600, 0.1, 'sine', 0.1), 100); setTimeout(() => this.playTone(800, 0.15, 'sine', 0.1), 200) }
  damage() { this.playTone(150, 0.15, 'sawtooth', 0.1) }
  gameOver() { this.playTone(300, 0.2, 'sawtooth', 0.1); setTimeout(() => this.playTone(200, 0.2, 'sawtooth', 0.1), 200); setTimeout(() => this.playTone(100, 0.3, 'sawtooth', 0.1), 400) }
  achievement() { this.playTone(523, 0.1, 'sine', 0.1); setTimeout(() => this.playTone(659, 0.1, 'sine', 0.1), 100); setTimeout(() => this.playTone(784, 0.15, 'sine', 0.1), 200) }
}

const soundEngine = new SoundEngine()

// ==================== MAIN COMPONENT ====================
export default function NeonBlasterGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: 0,
    level: 1,
    wave: 1,
    wavesPerLevel: WAVES_PER_LEVEL,
    health: 100,
    maxHealth: 100,
    shield: 0,
    maxShield: 50,
    combo: 0,
    maxCombo: 0,
    kills: 0,
    totalKills: 0,
    accuracy: 0,
    shotsFired: 0,
    shotsHit: 0,
    powerups: {},
    upgrades: { damage: 0, fireRate: 0, bulletSpeed: 0, moveSpeed: 0 }
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [showUpgrades, setShowUpgrades] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [screenShake, setScreenShake] = useState({ x: 0, y: 0 })
  const [waveComplete, setWaveComplete] = useState(false)
  const [damageTakenThisWave, setDamageTakenThisWave] = useState(false)

  // Game references
  const gameRef = useRef({
    player: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 80 },
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    particles: [] as Particle[],
    powerups: [] as PowerUp[],
    keys: new Set<string>(),
    mouse: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
    lastShot: 0,
    enemiesKilledThisWave: 0,
    enemiesInWave: 0,
    waveSpawned: false,
  })

  // Initialize sound
  useEffect(() => {
    soundEngine.init()
    soundEngine.setEnabled(soundEnabled)
  }, [soundEnabled])

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('neonBlaster_highScore')
    if (saved) {
      setGameState(prev => ({ ...prev, highScore: parseInt(saved) }))
    }
    const savedAchievements = localStorage.getItem('neonBlaster_achievements')
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    }
  }, [])

  // Screen shake effect
  const triggerScreenShake = useCallback((intensity: number) => {
    const shake = () => {
      setScreenShake({
        x: (Math.random() - 0.5) * intensity,
        y: (Math.random() - 0.5) * intensity
      })
    }
    shake()
    setTimeout(() => shake(), 50)
    setTimeout(() => shake(), 100)
    setTimeout(() => setScreenShake({ x: 0, y: 0 }), 150)
  }, [])

  // Check achievements
  const checkAchievements = useCallback((state: GameState) => {
    setAchievements(prev => {
      const updated = [...prev]
      let changed = false

      updated.forEach((ach, index) => {
        if (ach.unlocked) return

        let progress = 0
        switch (ach.id) {
          case 'first_blood': progress = Math.min(state.totalKills, 1); break
          case 'combo_10': progress = Math.min(state.maxCombo, 10); break
          case 'combo_50': progress = Math.min(state.maxCombo, 50); break
          case 'kills_100': progress = Math.min(state.totalKills, 100); break
          case 'kills_500': progress = Math.min(state.totalKills, 500); break
          case 'level_5': progress = Math.min(state.level, 5); break
          case 'level_10': progress = Math.min(state.level, 10); break
          case 'boss_killer': progress = updated[index].progress; break
          case 'powerup_collector': progress = Object.values(state.powerups).reduce((a, b) => a + b, 0); break
        }

        if (progress !== updated[index].progress) {
          updated[index] = { ...ach, progress }
          changed = true
        }

        if (progress >= ach.target && !ach.unlocked) {
          updated[index] = { ...ach, unlocked: true, progress }
          setNewAchievement(updated[index])
          soundEngine.achievement()
          setTimeout(() => setNewAchievement(null), 3000)
          changed = true
        }
      })

      if (changed) {
        localStorage.setItem('neonBlaster_achievements', JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  // Create particles
  const createParticles = useCallback((x: number, y: number, color: string, count: number, type: Particle['type']) => {
    const game = gameRef.current
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const speed = type === 'explosion' ? 3 + Math.random() * 4 : 1 + Math.random() * 2
      game.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: type === 'explosion' ? 40 : 20,
        maxLife: type === 'explosion' ? 40 : 20,
        color,
        size: type === 'explosion' ? 3 + Math.random() * 3 : 2,
        type
      })
    }
  }, [])

  // Spawn enemy
  const spawnEnemy = useCallback((level: number, wave: number) => {
    const game = gameRef.current
    const difficulty = level + wave * 0.5
    
    // Determine enemy type based on level and wave
    let type: Enemy['type'] = 'drone'
    const roll = Math.random() * 100
    
    if (wave === WAVES_PER_LEVEL && roll < 30) {
      type = 'boss'
    } else if (difficulty > 8 && roll < 20) {
      type = 'sniper'
    } else if (difficulty > 5 && roll < 35) {
      type = 'tank'
    } else if (difficulty > 3 && roll < 50) {
      type = 'fighter'
    } else if (roll < 40) {
      type = 'swarm'
    }

    const config = ENEMY_CONFIGS[type]
    const healthMultiplier = 1 + (level - 1) * 0.2
    const speedMultiplier = 1 + (level - 1) * 0.1
    
    // Spawn from edges
    const side = Math.floor(Math.random() * 4)
    let x = 0, y = 0, vx = 0, vy = 0
    
    switch (side) {
      case 0: // Top
        x = Math.random() * CANVAS_WIDTH
        y = -config.size
        vy = config.speed * speedMultiplier
        break
      case 1: // Right
        x = CANVAS_WIDTH + config.size
        y = Math.random() * CANVAS_HEIGHT
        vx = -config.speed * speedMultiplier
        break
      case 2: // Bottom
        x = Math.random() * CANVAS_WIDTH
        y = CANVAS_HEIGHT + config.size
        vy = -config.speed * speedMultiplier
        break
      case 3: // Left
        x = -config.size
        y = Math.random() * CANVAS_HEIGHT
        vx = config.speed * speedMultiplier
        break
    }

    game.enemies.push({
      x, y, vx, vy,
      health: Math.ceil(config.health * healthMultiplier),
      maxHealth: Math.ceil(config.health * healthMultiplier),
      type,
      color: config.color,
      size: config.size,
      speed: config.speed * speedMultiplier,
      points: Math.ceil(config.points * (1 + (level - 1) * 0.1)),
      lastShot: 0,
      angle: 0
    })
  }, [])

  // Spawn power-up
  const spawnPowerUp = useCallback((x: number, y: number) => {
    if (Math.random() > 0.15) return // 15% chance
    
    const types: PowerUp['type'][] = ['health', 'shield', 'rapidfire', 'damage', 'multishot', 'piercing']
    const type = types[Math.floor(Math.random() * types.length)]
    const config = POWERUP_CONFIGS[type]
    
    gameRef.current.powerups.push({
      x, y, type,
      duration: config.duration,
      color: config.color
    })
  }, [])

  // Start game
  const startGame = useCallback(() => {
    const game = gameRef.current
    game.player = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 80 }
    game.bullets = []
    game.enemies = []
    game.particles = []
    game.powerups = []
    game.enemiesKilledThisWave = 0
    game.enemiesInWave = 0
    game.waveSpawned = false
    
    setGameState({
      score: 0,
      highScore: gameState.highScore,
      level: 1,
      wave: 1,
      wavesPerLevel: WAVES_PER_LEVEL,
      health: 100,
      maxHealth: 100,
      shield: 0,
      maxShield: 50,
      combo: 0,
      maxCombo: 0,
      kills: 0,
      totalKills: 0,
      accuracy: 0,
      shotsFired: 0,
      shotsHit: 0,
      powerups: {},
      upgrades: { damage: 0, fireRate: 0, bulletSpeed: 0, moveSpeed: 0 }
    })
    setIsPlaying(true)
    setIsPaused(false)
    setGameOver(false)
    setShowUpgrades(false)
    setDamageTakenThisWave(false)
  }, [gameState.highScore])

  // Main game loop
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const game = gameRef.current
    let animationId: number
    let lastTime = performance.now()
    let comboTimer = 0

    // Input handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      game.keys.add(e.key.toLowerCase())
      if (['w', 'a', 's', 'd', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
      if (e.key.toLowerCase() === 'p') {
        setIsPaused(p => !p)
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => game.keys.delete(e.key.toLowerCase())
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      game.mouse.x = e.clientX - rect.left
      game.mouse.y = e.clientY - rect.top
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    canvas.addEventListener('mousemove', handleMouseMove)

    // Spawn wave enemies
    const spawnWave = () => {
      if (game.waveSpawned) return
      game.waveSpawned = true
      
      const enemyCount = ENEMIES_PER_WAVE_BASE + (gameState.level - 1) * 2 + (gameState.wave - 1)
      game.enemiesInWave = enemyCount
      game.enemiesKilledThisWave = 0
      
      let spawned = 0
      const spawnInterval = setInterval(() => {
        if (spawned >= enemyCount) {
          clearInterval(spawnInterval)
          return
        }
        spawnEnemy(gameState.level, gameState.wave)
        spawned++
      }, 500)
    }

    spawnWave()

    // Game loop
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      // Clear with glow effect
      ctx.fillStyle = 'rgba(5, 5, 15, 0.3)'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw grid background
      ctx.strokeStyle = 'rgba(0, 100, 150, 0.1)'
      ctx.lineWidth = 1
      for (let x = 0; x < CANVAS_WIDTH; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, CANVAS_HEIGHT)
        ctx.stroke()
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(CANVAS_WIDTH, y)
        ctx.stroke()
      }

      // Player movement
      const moveSpeed = 5 + gameState.upgrades.moveSpeed * 0.5 + (gameState.powerups['speed'] ? 2 : 0)
      if (game.keys.has('w') || game.keys.has('arrowup')) game.player.y = Math.max(PLAYER_SIZE, game.player.y - moveSpeed)
      if (game.keys.has('s') || game.keys.has('arrowdown')) game.player.y = Math.min(CANVAS_HEIGHT - PLAYER_SIZE, game.player.y + moveSpeed)
      if (game.keys.has('a') || game.keys.has('arrowleft')) game.player.x = Math.max(PLAYER_SIZE, game.player.x - moveSpeed)
      if (game.keys.has('d') || game.keys.has('arrowright')) game.player.x = Math.min(CANVAS_WIDTH - PLAYER_SIZE, game.player.x + moveSpeed)

      // Shooting
      const fireRate = BASE_FIRE_RATE - gameState.upgrades.fireRate * 10 - (gameState.powerups['rapidfire'] ? 50 : 0)
      if (game.keys.has(' ') && currentTime - game.lastShot > fireRate) {
        game.lastShot = currentTime
        
        // Calculate aim direction
        const angle = Math.atan2(game.mouse.y - game.player.y, game.mouse.x - game.player.x)
        const bulletSpeed = BULLET_SPEED + gameState.upgrades.bulletSpeed
        const damage = BASE_DAMAGE + gameState.upgrades.damage + (gameState.powerups['damage'] ? 2 : 0)
        const piercing = !!gameState.powerups['piercing']
        
        const shots = gameState.powerups['multishot'] ? 3 : 1
        const spreadAngle = 0.15
        
        for (let i = 0; i < shots; i++) {
          const shotAngle = shots === 1 ? angle : angle + (i - 1) * spreadAngle
          game.bullets.push({
            x: game.player.x,
            y: game.player.y,
            vx: Math.cos(shotAngle) * bulletSpeed,
            vy: Math.sin(shotAngle) * bulletSpeed,
            damage,
            color: piercing ? '#ff8800' : '#00ffff',
            size: 4,
            piercing
          })
        }
        
        soundEngine.shoot()
        setGameState(prev => ({ ...prev, shotsFired: prev.shotsFired + shots }))
        createParticles(game.player.x, game.player.y, '#00ffff', 3, 'spark')
      }

      // Update bullets
      game.bullets = game.bullets.filter(bullet => {
        bullet.x += bullet.vx
        bullet.y += bullet.vy
        
        // Draw bullet with glow
        ctx.save()
        ctx.shadowBlur = 10
        ctx.shadowColor = bullet.color
        ctx.fillStyle = bullet.color
        ctx.beginPath()
        ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        
        // Trail
        createParticles(bullet.x, bullet.y, bullet.color, 1, 'trail')
        
        return bullet.x > 0 && bullet.x < CANVAS_WIDTH && bullet.y > 0 && bullet.y < CANVAS_HEIGHT
      })

      // Update enemies
      let killedThisFrame = 0
      game.enemies = game.enemies.filter(enemy => {
        // Move toward player
        const dx = game.player.x - enemy.x
        const dy = game.player.y - enemy.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (enemy.type === 'sniper') {
          // Snipers strafe
          enemy.angle = (enemy.angle || 0) + 0.02
          enemy.x += Math.cos(enemy.angle) * enemy.speed
          enemy.y += Math.sin(enemy.angle) * enemy.speed * 0.5
        } else if (enemy.type === 'swarm') {
          // Swarm moves erratically
          enemy.x += (dx / dist) * enemy.speed + (Math.random() - 0.5) * 2
          enemy.y += (dy / dist) * enemy.speed + (Math.random() - 0.5) * 2
        } else {
          enemy.x += (dx / dist) * enemy.speed
          enemy.y += (dy / dist) * enemy.speed
        }

        // Check bullet collisions
        game.bullets = game.bullets.filter(bullet => {
          const bdx = bullet.x - enemy.x
          const bdy = bullet.y - enemy.y
          const bdist = Math.sqrt(bdx * bdx + bdy * bdy)
          
          if (bdist < enemy.size + bullet.size) {
            enemy.health -= bullet.damage
            soundEngine.hit()
            createParticles(bullet.x, bullet.y, enemy.color, 5, 'hit')
            
            setGameState(prev => ({ ...prev, shotsHit: prev.shotsHit + 1 }))
            
            if (enemy.health <= 0) {
              killedThisFrame++
              game.enemiesKilledThisWave++
              soundEngine.explosion()
              createParticles(enemy.x, enemy.y, enemy.color, 20, 'explosion')
              triggerScreenShake(enemy.type === 'boss' ? 15 : 5)
              spawnPowerUp(enemy.x, enemy.y)
              
              setGameState(prev => {
                const newCombo = prev.combo + 1
                const newMaxCombo = Math.max(newCombo, prev.maxCombo)
                const newKills = prev.kills + 1
                const newTotalKills = prev.totalKills + 1
                const newScore = prev.score + enemy.points * (1 + Math.floor(newCombo / 5))
                
                // Update high score
                if (newScore > prev.highScore) {
                  localStorage.setItem('neonBlaster_highScore', newScore.toString())
                }
                
                // Check boss achievement
                if (enemy.type === 'boss') {
                  setAchievements(a => {
                    const updated = [...a]
                    const bossAch = updated.find(x => x.id === 'boss_killer')
                    if (bossAch && !bossAch.unlocked) {
                      bossAch.progress = 1
                      bossAch.unlocked = true
                      setNewAchievement(bossAch)
                      soundEngine.achievement()
                      setTimeout(() => setNewAchievement(null), 3000)
                      localStorage.setItem('neonBlaster_achievements', JSON.stringify(updated))
                    }
                    return updated
                  })
                }
                
                return {
                  ...prev,
                  score: newScore,
                  highScore: Math.max(newScore, prev.highScore),
                  combo: newCombo,
                  maxCombo: newMaxCombo,
                  kills: newKills,
                  totalKills: newTotalKills,
                  accuracy: prev.shotsFired > 0 ? Math.round((prev.shotsHit / prev.shotsFired) * 100) : 0
                }
              })
            }
            
            return bullet.piercing
          }
          return true
        })

        // Check player collision
        if (dist < PLAYER_SIZE + enemy.size) {
          const damage = enemy.type === 'boss' ? 30 : enemy.type === 'tank' ? 20 : 10
          
          setGameState(prev => {
            let newHealth = prev.health
            let newShield = prev.shield
            
            if (newShield > 0) {
              newShield = Math.max(0, newShield - damage)
            } else {
              newHealth = Math.max(0, newHealth - damage)
            }
            
            if (newHealth <= 0) {
              setGameOver(true)
              soundEngine.gameOver()
              triggerScreenShake(20)
            } else {
              soundEngine.damage()
              triggerScreenShake(10)
            }
            
            setDamageTakenThisWave(true)
            
            return { ...prev, health: newHealth, shield: newShield, combo: 0 }
          })
          
          createParticles(game.player.x, game.player.y, '#ff0000', 15, 'explosion')
          return false
        }

        // Draw enemy
        ctx.save()
        ctx.shadowBlur = 15
        ctx.shadowColor = enemy.color
        
        // Health bar
        if (enemy.type === 'boss' || enemy.type === 'tank') {
          ctx.fillStyle = '#333'
          ctx.fillRect(enemy.x - enemy.size, enemy.y - enemy.size - 10, enemy.size * 2, 5)
          ctx.fillStyle = enemy.color
          ctx.fillRect(enemy.x - enemy.size, enemy.y - enemy.size - 10, (enemy.health / enemy.maxHealth) * enemy.size * 2, 5)
        }
        
        // Enemy body
        ctx.fillStyle = enemy.color
        ctx.beginPath()
        if (enemy.type === 'boss') {
          // Hexagon for boss
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i - Math.PI / 2
            const px = enemy.x + Math.cos(a) * enemy.size
            const py = enemy.y + Math.sin(a) * enemy.size
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.closePath()
        } else if (enemy.type === 'tank') {
          // Square for tank
          ctx.rect(enemy.x - enemy.size, enemy.y - enemy.size, enemy.size * 2, enemy.size * 2)
        } else {
          // Circle for others
          ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2)
        }
        ctx.fill()
        ctx.restore()
        
        return enemy.health > 0
      })

      // Combo timer
      if (killedThisFrame > 0) {
        comboTimer = 2000
      } else {
        comboTimer -= deltaTime
        if (comboTimer <= 0) {
          setGameState(prev => ({ ...prev, combo: 0 }))
        }
      }

      // Update power-ups
      game.powerups = game.powerups.filter(powerup => {
        // Draw powerup
        ctx.save()
        ctx.shadowBlur = 20
        ctx.shadowColor = powerup.color
        ctx.fillStyle = powerup.color
        ctx.beginPath()
        ctx.arc(powerup.x, powerup.y, 12 + Math.sin(currentTime * 0.005) * 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const icons: { [key: string]: string } = { health: '♥', shield: '◆', rapidfire: '↯', damage: '★', multishot: '◎', piercing: '→' }
        ctx.fillText(icons[powerup.type] || '?', powerup.x, powerup.y)
        ctx.restore()
        
        // Check collection
        const pdx = powerup.x - game.player.x
        const pdy = powerup.y - game.player.y
        const pdist = Math.sqrt(pdx * pdx + pdy * pdy)
        
        if (pdist < PLAYER_SIZE + 15) {
          soundEngine.powerup()
          createParticles(powerup.x, powerup.y, powerup.color, 15, 'powerup')
          
          setGameState(prev => {
            const newPowerups = { ...prev.powerups }
            newPowerups[powerup.type] = (newPowerups[powerup.type] || 0) + 1
            
            let newHealth = prev.health
            let newShield = prev.shield
            
            if (powerup.type === 'health') {
              newHealth = Math.min(prev.maxHealth, newHealth + 25)
            } else if (powerup.type === 'shield') {
              newShield = Math.min(prev.maxShield, newShield + 25)
            }
            
            // Set temporary powerups
            if (powerup.duration > 0) {
              setTimeout(() => {
                setGameState(p => {
                  const updated = { ...p.powerups }
                  delete updated[powerup.type]
                  return { ...p, powerups: updated }
                })
              }, powerup.duration)
            }
            
            return { ...prev, health: newHealth, shield: newShield, powerups: powerup.duration > 0 ? { ...prev.powerups, [powerup.type]: 1 } : prev.powerups }
          })
          
          return false
        }
        
        return true
      })

      // Update particles
      game.particles = game.particles.filter(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.98
        particle.vy *= 0.98
        particle.life--
        
        const alpha = particle.life / particle.maxLife
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        
        return particle.life > 0
      })

      // Draw player
      ctx.save()
      ctx.translate(screenShake.x, screenShake.y)
      
      // Player glow
      const gradient = ctx.createRadialGradient(game.player.x, game.player.y, 0, game.player.x, game.player.y, PLAYER_SIZE * 2)
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)')
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(game.player.x, game.player.y, PLAYER_SIZE * 2, 0, Math.PI * 2)
      ctx.fill()
      
      // Shield visual
      if (gameState.shield > 0) {
        ctx.strokeStyle = `rgba(100, 100, 255, ${0.5 + Math.sin(currentTime * 0.01) * 0.2})`
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(game.player.x, game.player.y, PLAYER_SIZE + 8, 0, Math.PI * 2)
        ctx.stroke()
      }
      
      // Player body
      ctx.shadowBlur = 20
      ctx.shadowColor = '#00ffff'
      ctx.fillStyle = '#00ffff'
      ctx.beginPath()
      ctx.arc(game.player.x, game.player.y, PLAYER_SIZE, 0, Math.PI * 2)
      ctx.fill()
      
      // Player direction indicator
      const aimAngle = Math.atan2(game.mouse.y - game.player.y, game.mouse.x - game.player.x)
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(
        game.player.x + Math.cos(aimAngle) * PLAYER_SIZE * 0.6,
        game.player.y + Math.sin(aimAngle) * PLAYER_SIZE * 0.6,
        5, 0, Math.PI * 2
      )
      ctx.fill()
      ctx.restore()

      // Check wave completion
      if (game.enemiesKilledThisWave >= game.enemiesInWave && game.enemies.length === 0 && !waveComplete) {
        setWaveComplete(true)
        
        // Check untouchable achievement
        if (!damageTakenThisWave) {
          setAchievements(a => {
            const updated = [...a]
            const ach = updated.find(x => x.id === 'no_damage')
            if (ach && !ach.unlocked) {
              ach.progress = 1
              ach.unlocked = true
              setNewAchievement(ach)
              soundEngine.achievement()
              setTimeout(() => setNewAchievement(null), 3000)
              localStorage.setItem('neonBlaster_achievements', JSON.stringify(updated))
            }
            return updated
          })
        }
        
        setTimeout(() => {
          setWaveComplete(false)
          setDamageTakenThisWave(false)
          
          setGameState(prev => {
            const nextWave = prev.wave + 1
            if (nextWave > WAVES_PER_LEVEL) {
              // Level complete - show upgrades
              soundEngine.levelUp()
              setShowUpgrades(true)
              return { ...prev, wave: 1, level: prev.level + 1 }
            }
            game.waveSpawned = false
            return { ...prev, wave: nextWave }
          })
        }, 2000)
      }

      // Check achievements periodically
      checkAchievements(gameState)

      // HUD
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(`SCORE: ${gameState.score.toLocaleString()}`, 10, 25)
      ctx.fillText(`LEVEL: ${gameState.level}`, 10, 50)
      ctx.fillText(`WAVE: ${gameState.wave}/${WAVES_PER_LEVEL}`, 10, 75)
      
      if (gameState.combo > 1) {
        ctx.fillStyle = '#ffff00'
        ctx.font = 'bold 24px Arial'
        ctx.fillText(`${gameState.combo}x COMBO!`, CANVAS_WIDTH / 2 - 60, 50)
      }
      
      ctx.textAlign = 'right'
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px Arial'
      ctx.fillText(`HIGH SCORE: ${gameState.highScore.toLocaleString()}`, CANVAS_WIDTH - 10, 25)
      ctx.fillText(`KILLS: ${gameState.kills}`, CANVAS_WIDTH - 10, 45)
      ctx.fillText(`ACCURACY: ${gameState.accuracy}%`, CANVAS_WIDTH - 10, 65)

      // Health bar
      ctx.fillStyle = '#333'
      ctx.fillRect(10, CANVAS_HEIGHT - 30, 200, 20)
      ctx.fillStyle = gameState.health > 30 ? '#00ff00' : '#ff0000'
      ctx.fillRect(10, CANVAS_HEIGHT - 30, (gameState.health / gameState.maxHealth) * 200, 20)
      ctx.strokeStyle = '#fff'
      ctx.strokeRect(10, CANVAS_HEIGHT - 30, 200, 20)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`${gameState.health}/${gameState.maxHealth}`, 110, CANVAS_HEIGHT - 16)

      // Shield bar
      if (gameState.maxShield > 0) {
        ctx.fillStyle = '#333'
        ctx.fillRect(220, CANVAS_HEIGHT - 30, 100, 20)
        ctx.fillStyle = '#4444ff'
        ctx.fillRect(220, CANVAS_HEIGHT - 30, (gameState.shield / gameState.maxShield) * 100, 20)
        ctx.strokeStyle = '#fff'
        ctx.strokeRect(220, CANVAS_HEIGHT - 30, 100, 20)
        ctx.fillStyle = '#fff'
        ctx.fillText(`${gameState.shield}`, 270, CANVAS_HEIGHT - 16)
      }

      // Active powerups
      let powerupX = CANVAS_WIDTH - 40
      Object.keys(gameState.powerups).forEach(key => {
        if (gameState.powerups[key]) {
          ctx.fillStyle = POWERUP_CONFIGS[key as keyof typeof POWERUP_CONFIGS]?.color || '#fff'
          ctx.beginPath()
          ctx.arc(powerupX, CANVAS_HEIGHT - 20, 12, 0, Math.PI * 2)
          ctx.fill()
          powerupX -= 30
        }
      })

      // Wave complete message
      if (waveComplete) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(0, CANVAS_HEIGHT / 2 - 50, CANVAS_WIDTH, 100)
        ctx.fillStyle = '#00ff00'
        ctx.font = 'bold 36px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('WAVE COMPLETE!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10)
      }

      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isPlaying, isPaused, gameOver, gameState, screenShake, waveComplete, damageTakenThisWave, createParticles, spawnEnemy, spawnPowerUp, triggerScreenShake, checkAchievements])

  // Apply upgrade
  const applyUpgrade = (type: keyof GameState['upgrades']) => {
    setGameState(prev => ({
      ...prev,
      upgrades: { ...prev.upgrades, [type]: prev.upgrades[type] + 1 }
    }))
    setShowUpgrades(false)
    gameRef.current.waveSpawned = false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <header className="border-b border-blue-500/30 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Games</span>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            NEON BLASTER
          </h1>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Game Canvas */}
          <div className="flex-shrink-0">
            <div className="relative rounded-lg overflow-hidden border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="bg-gray-900 cursor-crosshair"
                style={{ transform: `translate(${screenShake.x}px, ${screenShake.y}px)` }}
              />

              {/* Start Screen */}
              {!isPlaying && !gameOver && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                  <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    NEON BLASTER
                  </h2>
                  <p className="text-gray-400 mb-8 text-center max-w-md">
                    Twin-stick shooter with 10 levels of increasing difficulty.
                    <br />Use WASD to move, SPACE to shoot, aim with mouse.
                  </p>
                  <button
                    onClick={startGame}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold text-xl hover:from-cyan-400 hover:to-purple-400 transition flex items-center gap-2"
                  >
                    <Play className="w-6 h-6" />
                    START GAME
                  </button>
                  {gameState.highScore > 0 && (
                    <p className="mt-4 text-yellow-400">
                      <Trophy className="inline w-5 h-5 mr-2" />
                      High Score: {gameState.highScore.toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Pause Screen */}
              {isPaused && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                  <h2 className="text-4xl font-bold mb-8">PAUSED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-4 bg-cyan-500 rounded-lg font-bold text-xl hover:bg-cyan-400 transition flex items-center gap-2"
                  >
                    <Play className="w-6 h-6" />
                    RESUME
                  </button>
                </div>
              )}

              {/* Upgrade Screen */}
              {showUpgrades && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center">
                  <h2 className="text-3xl font-bold mb-2 text-green-400">LEVEL {gameState.level} COMPLETE!</h2>
                  <p className="text-gray-400 mb-6">Choose an upgrade:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => applyUpgrade('damage')}
                      className="px-6 py-4 bg-red-600 hover:bg-red-500 rounded-lg font-bold transition flex flex-col items-center"
                    >
                      <Zap className="w-8 h-8 mb-2" />
                      <span>+1 DAMAGE</span>
                      <span className="text-xs text-red-200">Level {gameState.upgrades.damage + 1}</span>
                    </button>
                    <button
                      onClick={() => applyUpgrade('fireRate')}
                      className="px-6 py-4 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-bold transition flex flex-col items-center"
                    >
                      <Star className="w-8 h-8 mb-2" />
                      <span>+FIRE RATE</span>
                      <span className="text-xs text-yellow-200">Level {gameState.upgrades.fireRate + 1}</span>
                    </button>
                    <button
                      onClick={() => applyUpgrade('bulletSpeed')}
                      className="px-6 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition flex flex-col items-center"
                    >
                      <Zap className="w-8 h-8 mb-2" />
                      <span>+BULLET SPEED</span>
                      <span className="text-xs text-blue-200">Level {gameState.upgrades.bulletSpeed + 1}</span>
                    </button>
                    <button
                      onClick={() => applyUpgrade('moveSpeed')}
                      className="px-6 py-4 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition flex flex-col items-center"
                    >
                      <Shield className="w-8 h-8 mb-2" />
                      <span>+MOVE SPEED</span>
                      <span className="text-xs text-green-200">Level {gameState.upgrades.moveSpeed + 1}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Game Over Screen */}
              {gameOver && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center">
                  <h2 className="text-5xl font-bold mb-4 text-red-500">GAME OVER</h2>
                  <div className="text-center mb-8">
                    <p className="text-2xl mb-2">Score: <span className="text-cyan-400">{gameState.score.toLocaleString()}</span></p>
                    <p className="text-lg text-gray-400">Level {gameState.level} • Wave {gameState.wave}</p>
                    <p className="text-lg text-gray-400">Kills: {gameState.totalKills} • Accuracy: {gameState.accuracy}%</p>
                    <p className="text-lg text-yellow-400">Max Combo: {gameState.maxCombo}x</p>
                    {gameState.score >= gameState.highScore && gameState.score > 0 && (
                      <p className="text-2xl text-yellow-400 mt-4 animate-pulse">🎉 NEW HIGH SCORE! 🎉</p>
                    )}
                  </div>
                  <button
                    onClick={startGame}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold text-xl hover:from-cyan-400 hover:to-purple-400 transition flex items-center gap-2"
                  >
                    <RotateCcw className="w-6 h-6" />
                    PLAY AGAIN
                  </button>
                </div>
              )}

              {/* Achievement Popup */}
              {newAchievement && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-3 rounded-lg shadow-2xl animate-bounce">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{newAchievement.icon}</span>
                    <div>
                      <p className="font-bold text-lg">Achievement Unlocked!</p>
                      <p className="text-yellow-200">{newAchievement.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="mt-4 text-center text-gray-400 text-sm">
              <span className="mr-4">WASD / Arrows: Move</span>
              <span className="mr-4">SPACE: Shoot</span>
              <span className="mr-4">MOUSE: Aim</span>
              <span>P: Pause</span>
            </div>
          </div>

          {/* Side Panel */}
          <div className="flex-1 space-y-6">
            {/* Stats */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">High Score</p>
                  <p className="text-2xl font-bold text-yellow-400">{gameState.highScore.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Current Score</p>
                  <p className="text-2xl font-bold text-cyan-400">{gameState.score.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Kills</p>
                  <p className="text-xl font-bold">{gameState.totalKills}</p>
                </div>
                <div>
                  <p className="text-gray-400">Max Combo</p>
                  <p className="text-xl font-bold text-orange-400">{gameState.maxCombo}x</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-400" />
                Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {achievements.map(ach => (
                  <div
                    key={ach.id}
                    className={`flex items-center gap-3 p-2 rounded ${
                      ach.unlocked ? 'bg-green-900/30' : 'bg-gray-700/30'
                    }`}
                  >
                    <span className={`text-2xl ${ach.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {ach.icon}
                    </span>
                    <div className="flex-1">
                      <p className={`font-medium ${ach.unlocked ? 'text-green-400' : 'text-gray-500'}`}>
                        {ach.name}
                      </p>
                      <p className="text-xs text-gray-500">{ach.description}</p>
                      {!ach.unlocked && (
                        <div className="mt-1 bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-purple-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${(ach.progress / ach.target) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                    {ach.unlocked && <span className="text-green-400">✓</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrades Status */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Current Upgrades
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Damage: +{gameState.upgrades.damage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>Fire Rate: +{gameState.upgrades.fireRate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Bullet Speed: +{gameState.upgrades.bulletSpeed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Move Speed: +{gameState.upgrades.moveSpeed}</span>
                </div>
              </div>
            </div>

            {/* How to Play */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">How to Play</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Survive 5 waves per level (10 levels total)</li>
                <li>• Kill enemies before they reach you</li>
                <li>• Collect power-ups for temporary boosts</li>
                <li>• Build combos for score multipliers</li>
                <li>• Choose upgrades after each level</li>
                <li>• Beat the boss on wave 5 of each level</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
