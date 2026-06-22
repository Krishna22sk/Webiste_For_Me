import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, Lock, Unlock, Cpu, Wifi, HelpCircle, Layers, Activity, Zap } from 'lucide-react'

// Dynamic Counter Sub-component
function Counter({ value, suffix = '', duration = 1.5 }) {
  const [count, setCount] = useState(0)
  const elementRef = useRef(null)
  const isInView = useInView(elementRef, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = parseInt(value, 10)
    if (isNaN(end)) {
      setCount(value)
      return
    }

    const totalSteps = 60
    const increment = end / totalSteps
    const stepTime = (duration * 1000) / totalSteps
    let step = 0

    const timer = setInterval(() => {
      start += increment
      step++
      
      if (step >= totalSteps) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [isInView, value, duration])

  return (
    <span ref={elementRef} className="font-mono">
      {count}
      {suffix}
    </span>
  )
}

export default function Achievements({ unlockedBadges = [], score = 0, maxScore = 45 }) {
  const badgeList = [
    {
      id: 'hero_click',
      title: 'Hero Core Probe',
      points: 5,
      description: 'Triggered the MCU core in the main title card.',
      hint: 'Probe the main developer title on the system boot page.',
      icon: <Cpu className="w-4 h-4" />
    },
    {
      id: 'resume_click',
      title: 'Resume Cache Loader',
      points: 5,
      description: 'Loaded resume PDF cache registers into memory.',
      hint: 'Download resume file payload.',
      icon: <Layers className="w-4 h-4" />
    },
    {
      id: 'diagnostics',
      title: 'Terminal Debugger',
      points: 10,
      description: 'Polled local diagnostic sensors to clear memory flags.',
      hint: 'Tap the About diagnostics panel 5 times to resolve sector errors.',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'project_detail',
      title: 'Schematics Inspector',
      points: 5,
      description: 'Inspected low-level firmware architecture & block diagrams.',
      hint: 'Open view details of any featured project card.',
      icon: <HelpCircle className="w-4 h-4" />
    },
    {
      id: 'pin_led',
      title: 'User LED Pulsar',
      points: 5,
      description: 'Forced GPIO 2 high to toggle the on-board user LED.',
      hint: 'Click the ESP32 user LED pin (GPIO2) on the virtual board.',
      icon: <Wifi className="w-4 h-4" />
    },
    {
      id: 'overclock',
      title: 'System Overlord',
      points: 15,
      description: 'Flashed PLL clock configuration registers to 400MHz.',
      hint: 'Overclock the virtual ESP32 to 400MHz in the interactive lab.',
      icon: <Zap className="w-4 h-4" />
    }
  ]

  const isBadgeUnlocked = (badgeId) => {
    if (badgeId === 'project_detail') {
      return unlockedBadges.some(b => b.startsWith('project_detail_'))
    }
    return unlockedBadges.includes(badgeId)
  }

  const unlockedCount = badgeList.filter(b => isBadgeUnlocked(b.id)).length

  return (
    <section id="achievements" className="py-24 md:py-32 relative bg-cyber-dark font-mono overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute left-0 top-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
 
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-16">
          <span className="section-label block mb-4">06 — Stats & Metrics</span>
          <h2 className="heading-serif text-4xl md:text-6xl mb-4">
            Achievements<br />
            <span className="heading-display text-3xl md:text-5xl">& Statistics</span>
          </h2>
          <div className="section-divider" />
        </div>
 
        {/* Dynamic Telemetry Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-cyber-gray border border-white/5 shadow-glass p-6 rounded-xl border-l-4 border-primary relative overflow-hidden group hover:shadow-neon-blue transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 opacity-[0.05] text-primary group-hover:scale-110 transition-transform">
              <Cpu className="w-24 h-24" />
            </div>
            <div className="text-3xl md:text-4xl font-extrabold font-orbitron text-primary mb-1">
              <Counter value="15" suffix="+" />
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">Embedded Projects</div>
          </div>
 
          <div className="bg-cyber-gray border border-white/5 shadow-glass p-6 rounded-xl border-l-4 border-secondary relative overflow-hidden group hover:shadow-neon-blue transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 opacity-[0.05] text-secondary group-hover:scale-110 transition-transform">
              <Wifi className="w-24 h-24" />
            </div>
            <div className="text-3xl md:text-4xl font-extrabold font-orbitron text-secondary mb-1">
              <Counter value="8" suffix="+" />
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">IoT Deployments</div>
          </div>
 
          <div className="bg-cyber-gray border border-white/5 shadow-glass p-6 rounded-xl border-l-4 border-slate-600 relative overflow-hidden group hover:shadow-neon-blue transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 opacity-[0.05] text-slate-600 group-hover:scale-110 transition-transform">
              <Layers className="w-24 h-24" />
            </div>
            <div className="text-3xl md:text-4xl font-extrabold font-orbitron text-slate-300 mb-1">
              <Counter value="7" suffix="+" />
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">Protocols Handled</div>
          </div>
 
          <div className="bg-cyber-gray border border-white/5 shadow-glass p-6 rounded-xl border-l-4 border-emerald-500 relative overflow-hidden group hover:shadow-neon-blue transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 opacity-[0.05] text-emerald-500 group-hover:scale-110 transition-transform">
              <Activity className="w-24 h-24" />
            </div>
            <div className="text-3xl md:text-4xl font-extrabold font-orbitron text-emerald-500 mb-1">
              <Counter value="12" suffix="+" />
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">Sensors Integrated</div>
          </div>
        </div>
 
        {/* Gamification Dashboard */}
        <div className="bg-cyber-gray/40 border border-white/5 rounded-2xl p-6 md:p-8 shadow-glass">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/5 gap-4">
            <div>
              <h3 className="font-orbitron font-extrabold text-xl text-white tracking-wider flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                FIRMWARE_CHALLENGES // PORTFOLIO_BADGES
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Unlock diagnostic certificates by interacting with hardware components, clicking logs, and exploring layouts.
              </p>
            </div>
 
            {/* Score Tracker HUD */}
            <div className="flex items-center gap-4 bg-cyber-gray border border-white/5 p-4 rounded-xl shadow-glass select-none min-w-[200px] justify-between">
              <div className="text-[10px]">
                <div className="text-slate-500 font-sans uppercase">System Sync:</div>
                <div className="font-bold text-primary tracking-wider mt-0.5 uppercase">
                  {unlockedCount === badgeList.length ? '100% OPERATIONAL (MASTER)' : 'CALIBRATING INTELLIGENCE'}
                </div>
              </div>
              <div className="text-right">
                <div className="font-orbitron font-extrabold text-2xl text-primary">
                  {score}<span className="text-xs text-slate-500 font-light">/{maxScore}</span>
                </div>
                <div className="text-[9px] text-slate-500 font-bold">{unlockedCount} / {badgeList.length} BADGES</div>
              </div>
            </div>
          </div>
 
          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badgeList.map((badge) => {
              const unlocked = isBadgeUnlocked(badge.id)
              return (
                <div
                  key={badge.id}
                  className={`relative p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                    unlocked
                      ? 'bg-cyber-gray border-primary/45 shadow-glass text-slate-200 hover:shadow-neon-blue'
                      : 'bg-cyber-gray/25 border-white/5 text-slate-500'
                  }`}
                >
                  <div>
                    {/* Badge Header: Icon + Points */}
                    <div className="flex justify-between items-center mb-4">
                      <div className={`p-2 rounded-lg border transition-colors ${
                        unlocked 
                          ? 'bg-primary/10 border-primary/20 text-primary' 
                          : 'bg-cyber-darker border-white/5 text-slate-650'
                      }`}>
                        {badge.icon}
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        unlocked 
                          ? 'border-primary/20 bg-primary/10 text-primary' 
                          : 'border-white/5 bg-cyber-darker text-slate-500'
                      }`}>
                        +{badge.points} PTS
                      </span>
                    </div>
 
                    {/* Badge Title */}
                    <h4 className={`font-orbitron font-bold text-sm mb-1.5 flex items-center gap-1.5 ${
                      unlocked ? 'text-white' : 'text-slate-500'
                    }`}>
                      {unlocked ? <Unlock className="w-3.5 h-3.5 text-secondary" /> : <Lock className="w-3.5 h-3.5" />}
                      {badge.title}
                    </h4>
 
                    {/* Description vs Hint */}
                    <p className="text-xs font-sans font-light leading-relaxed mb-4 text-slate-400">
                      {unlocked ? badge.description : badge.hint}
                    </p>
                  </div>
 
                  {/* Unlock Status Stamp */}
                  <div className="text-[8px] uppercase tracking-widest font-bold text-right">
                    {unlocked ? (
                      <span className="text-secondary">✓ SECURE_SYNCHRONIZED</span>
                    ) : (
                      <span className="text-slate-600">✗ REGISTER_LOCKED</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
