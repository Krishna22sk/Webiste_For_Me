import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Settings, Cpu, Network, ShieldCheck, Database } from 'lucide-react'

// Dynamic Counter Sub-component
function Counter({ value, suffix = '', duration = 1.5 }) {
  const [count, setCount] = useState(0)
  const elementRef = useRef(null)
  const isInView = useInView(elementRef, { once: true, margin: '-100px' })

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

export default function About({ incrementScore }) {
  const [coreTemp, setCoreTemp] = useState(42.5)
  const [ramUsage, setRamUsage] = useState(12.4)
  const [clickCount, setClickCount] = useState(0)
  
  // Real-time floating telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCoreTemp((prev) => +(prev + (Math.random() - 0.5) * 0.4).toFixed(1))
      setRamUsage((prev) => +(prev + (Math.random() - 0.5) * 0.1).toFixed(2))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleDiagnosticClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    if (newCount === 5) {
      incrementScore('diagnostics', 10, 'Diagnostic terminal debugged! Score +10.')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80 }
    }
  }

  return (
    <section id="about" className="py-24 md:py-32 relative bg-cyber-dark border-t border-b border-white/5 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
 
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Heading */}
        <div className="mb-16">
          <span className="section-label block mb-4">01 — About Me</span>
          <h2 className="heading-serif text-4xl md:text-6xl mb-4">
            Bridging Hardware<br />
            <span className="heading-display text-3xl md:text-5xl">& Software Architecture</span>
          </h2>
          <div className="section-divider" />
        </div>
 
        {/* Content Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center"
        >
          {/* Left: Professional Interactive Terminal Panel (5 cols) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 relative"
          >
            <div 
              onClick={handleDiagnosticClick}
              className="bg-cyber-gray border border-white/5 shadow-glass p-6 rounded-xl font-mono text-xs text-slate-300 relative overflow-hidden group cursor-pointer hover:border-primary/40 hover:shadow-neon-blue transition-all duration-300"
            >
              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4 select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                </div>
                <div className="text-[10px] text-primary flex items-center gap-1.5 font-semibold">
                  <Settings className="w-3.5 h-3.5 animate-spin" />
                  <span>SYS_MONITOR: OK</span>
                </div>
              </div>
 
              {/* Diagnostic data */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">DEV_NAME:</span>
                  <span className="text-white font-semibold">Krishnamoorthy S</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">FIRMWARE_VER:</span>
                  <span className="text-secondary font-bold">v3.5.2-LTS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CORE_TEMP:</span>
                  <span className={coreTemp > 44 ? 'text-red-400 font-bold' : 'text-emerald-500 font-bold'}>
                    {coreTemp}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">MEM_ALLOC:</span>
                  <span className="text-slate-200">{ramUsage} MB / 32 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">POWER_RAIL:</span>
                  <span className="text-primary font-bold">3.3V [STABLE]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">LOG_SECTOR:</span>
                  <span className="text-slate-200 font-medium">0x3F881A - 0x7FFA</span>
                </div>
              </div>
 
              {/* Visual simulated oscilloscope */}
              <div className="mt-6 border border-white/5 bg-cyber-darker p-2.5 rounded-lg h-20 relative overflow-hidden">
                <svg className="w-full h-full text-primary/80" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path 
                    d="M 0 10 Q 15 10, 20 10 T 25 2 T 30 18 T 35 10 T 55 10 Q 70 10, 75 10 T 80 5 T 85 15 T 90 10 H 100" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.2"
                    strokeDasharray="200"
                    strokeDashoffset="0"
                  >
                    <animate attributeName="strokeDashoffset" values="200;0" dur="4s" repeatCount="indefinite" />
                  </path>
                </svg>
                <div className="absolute bottom-1 right-2 text-[8px] text-slate-500 font-bold uppercase">
                  SPI_BUS_FREQ: 10MHz
                </div>
              </div>
              
              <div className="mt-4 text-center text-[9px] text-slate-500 italic select-none">
                {clickCount < 5 
                  ? `[Interactive diagnostic panel. Click to poll sensors (${5 - clickCount} left)]` 
                  : "✓ System successfully debugged. Sector unlocked!"
                }
              </div>
            </div>
          </motion.div>
 
          {/* Right: Text and Stats Grid (7 cols) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7 flex flex-col justify-center space-y-6"
          >
            <h3 className="font-sans font-semibold text-lg md:text-xl text-white/90 tracking-tight">
              Passionate about the intersection of hardware and software
            </h3>
            
            <p className="text-slate-400 font-light leading-relaxed">
              Hello! I'm <strong className="text-primary font-semibold">Krishnamoorthy S</strong>, an Embedded Software Developer with over a year of specialized experience designing, testing, and optimizing smart devices and IoT environments. I thrive at the low-level tier, turning hardware blueprints into active, secure firmware.
            </p>
            
            <p className="text-slate-400 font-light leading-relaxed">
              I specialize in microcontrollers (ESP32, PIC, 8051) and designing interfaces that talk over diverse communication buses (UART, I2C, SPI, CAN). My work focuses on building stable operating architectures, integrating digital sensors, and structuring IoT systems that pipe raw telemetry securely to central cloud servers.
            </p>
 
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {/* Stat 1 */}
              <div className="bg-cyber-gray border border-white/5 shadow-glass p-5 rounded-xl text-center border-l-4 border-primary relative overflow-hidden group hover:shadow-neon-blue transition-all duration-300">
                <div className="absolute top-0 right-0 p-1.5 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Database className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="font-orbitron font-extrabold text-2xl md:text-3xl text-primary mb-1">
                  <Counter value="15" suffix="+" />
                </div>
                <div className="font-mono text-[9px] text-slate-500 tracking-widest uppercase">
                  Projects Done
                </div>
              </div>
 
              {/* Stat 2 */}
              <div className="bg-cyber-gray border border-white/5 shadow-glass p-5 rounded-xl text-center border-l-4 border-secondary relative overflow-hidden group hover:shadow-neon-blue transition-all duration-300">
                <div className="absolute top-0 right-0 p-1.5 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Network className="w-3.5 h-3.5 text-secondary" />
                </div>
                <div className="font-orbitron font-extrabold text-2xl md:text-3xl text-secondary mb-1">
                  <Counter value="7" suffix="+" />
                </div>
                <div className="font-mono text-[9px] text-slate-500 tracking-widest uppercase">
                  Protocols
                </div>
              </div>
 
              {/* Stat 3 */}
              <div className="bg-cyber-gray border border-white/5 shadow-glass p-5 rounded-xl text-center border-l-4 border-slate-600 relative overflow-hidden group hover:shadow-neon-blue transition-all duration-300">
                <div className="absolute top-0 right-0 p-1.5 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Cpu className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="font-orbitron font-extrabold text-2xl md:text-3xl text-slate-300 mb-1">
                  <Counter value="12" suffix="+" />
                </div>
                <div className="font-mono text-[9px] text-slate-500 tracking-widest uppercase">
                  Tech Modules
                </div>
              </div>
 
              {/* Stat 4 */}
              <div className="bg-cyber-gray border border-white/5 shadow-glass p-5 rounded-xl text-center border-l-4 border-emerald-500 relative overflow-hidden group hover:shadow-neon-blue transition-all duration-300">
                <div className="absolute top-0 right-0 p-1.5 opacity-20 group-hover:opacity-40 transition-opacity">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="font-orbitron font-extrabold text-2xl md:text-3xl text-emerald-500 mb-1">
                  <Counter value="1" suffix="+" />
                </div>
                <div className="font-mono text-[9px] text-slate-500 tracking-widest uppercase">
                  Years Exp
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
