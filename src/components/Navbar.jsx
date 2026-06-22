import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Award, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar({ score, maxScore, soundEnabled, setSoundEnabled }) {
  const [activeSection, setActiveSection]   = useState('hero')
  const [scrolled, setScrolled]             = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { id: 'hero',         label: 'Home' },
    { id: 'about',        label: 'About' },
    { id: 'skills',       label: 'Skills' },
    { id: 'experience',   label: 'Experience' },
    { id: 'projects',     label: 'Projects' },
    { id: 'lab',          label: 'Lab' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact',      label: 'Contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
      const sections = navLinks.map(l => document.getElementById(l.id))
      const scrollPos = window.scrollY + 200
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i]
        if (s && s.offsetTop <= scrollPos) { setActiveSection(navLinks[i].id); break }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, id) => {
    e.preventDefault()
    setActiveSection(id)
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    if (soundEnabled) playChirp()
  }

  const playChirp = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08)
      gain.gain.setValueAtTime(0.02, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(); osc.stop(ctx.currentTime + 0.12)
    } catch (e) {}
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (!soundEnabled) setTimeout(playChirp, 100)
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled
        ? 'py-3 bg-cyber-dark/90 backdrop-blur-xl border-b border-primary/8 shadow-glass'
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">

        {/* ── Logo: elegant serif KS monogram ── */}
        <a
          href="#hero"
          onClick={e => handleNavClick(e, 'hero')}
          className="flex items-center gap-3 group no-select"
          data-hover
        >
          {/* Elegant serif KS lettermark */}
          <span
            className="text-primary text-2xl font-bold leading-none"
            style={{ fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.02em' }}
          >
            KS
          </span>
          <span className="hidden sm:block w-px h-5 bg-primary/20" />
          <span className="hidden sm:block text-[10px] font-mono tracking-[0.18em] text-secondary uppercase opacity-70">
            Portfolio
          </span>
        </a>

        {/* ── Desktop Nav Links ── */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = activeSection === link.id
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={e => handleNavClick(e, link.id)}
                data-hover
                className={`relative text-[11px] font-sans font-medium tracking-wide transition-all duration-300 py-1.5 px-4 rounded-full no-select ${
                  isActive
                    ? 'text-cyber-dark bg-primary font-semibold'
                    : 'text-slate-400 hover:text-primary hover:bg-white/4'
                }`}
              >
                {link.label}
              </a>
            )
          })}
        </div>

        {/* ── System Controls ── */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Score pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 border border-primary/15 rounded-full text-[10px] font-mono text-primary font-semibold tracking-wider">
            <Award className="w-3 h-3" />
            <span>{score}/{maxScore} PTS</span>
          </div>
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            data-hover
            className={`p-2 rounded-full border transition-all duration-300 ${
              soundEnabled
                ? 'border-primary/25 text-primary bg-primary/6'
                : 'border-white/8 text-slate-500 hover:text-primary hover:border-primary/20'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* ── Mobile Controls ── */}
        <div className="lg:hidden flex items-center gap-2">
          <button onClick={toggleSound} className="p-1.5 rounded border border-white/8 text-slate-400">
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded border border-white/8 text-slate-400 hover:text-primary"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="lg:hidden absolute top-full left-0 w-full bg-cyber-dark/96 backdrop-blur-xl border-b border-primary/8 py-5 px-6 flex flex-col gap-1 shadow-2xl"
          >
            {navLinks.map(link => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={e => handleNavClick(e, link.id)}
                  className={`text-sm font-sans font-medium tracking-wide py-2.5 px-4 rounded-lg transition-all ${
                    isActive ? 'text-cyber-dark bg-primary font-semibold' : 'text-slate-400 hover:text-primary hover:bg-white/4'
                  }`}
                >
                  {link.label}
                </a>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
