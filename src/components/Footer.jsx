import React, { useState, useEffect } from 'react'
import { Github, Linkedin, Mail, ArrowUp, Cpu } from 'lucide-react'

export default function Footer({ soundEnabled }) {
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const playChirp = () => {
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200, ctx.currentTime)
      gain.gain.setValueAtTime(0.01, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.05)
    } catch (e) {}
  }

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${hours}:${mins}:${secs}`
  }

  const handleScrollTop = (e) => {
    e.preventDefault()
    playChirp()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 relative border-t border-white/5 bg-cyber-dark text-slate-550 font-mono text-xs overflow-hidden select-none">
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
 
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Side */}
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-white font-bold tracking-wider font-orbitron">
            <Cpu className="w-4 h-4 text-primary" />
            <span>K_MOORTHY.S // firmware</span>
          </div>
          <p className="text-[10px] text-slate-500 font-sans">
            &copy; {currentYear} Krishnamoorthy S. Licensed under MIT hardware parameters.
          </p>
          <div className="text-[9px] text-slate-650">
            SYS_LOC: 0x4B3A8E // STABLE // 3.3V RAIL
          </div>
        </div>
 
        {/* Center: Uptime */}
        <div className="flex flex-col items-center gap-1.5 bg-cyber-gray border border-white/5 px-4 py-2 rounded-xl text-[10px] shadow-glass">
          <div className="flex items-center gap-1.5 text-secondary font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span>CORE_UPTIME</span>
          </div>
          <div className="text-primary font-bold tracking-widest">{formatUptime(uptime)}</div>
        </div>
 
        {/* Right Side: Social links */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playChirp}
              className="p-2 border border-white/5 rounded-full hover:bg-cyber-gray text-slate-500 hover:text-primary hover:border-primary transition-all duration-300"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playChirp}
              className="p-2 border border-white/5 rounded-full hover:bg-cyber-gray text-slate-500 hover:text-primary hover:border-primary transition-all duration-300"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:krishnamoorthy.firmware@gmail.com"
              onClick={playChirp}
              className="p-2 border border-white/5 rounded-full hover:bg-cyber-gray text-slate-500 hover:text-primary hover:border-primary transition-all duration-300"
              title="Email Node"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
 
          <button
            onClick={handleScrollTop}
            className="p-2 border border-white/5 rounded-full hover:bg-cyber-gray text-slate-500 hover:text-secondary hover:border-secondary transition-all duration-300"
            title="Reset Pointer to SYS_INIT"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
 
      </div>
    </footer>
  )
}
