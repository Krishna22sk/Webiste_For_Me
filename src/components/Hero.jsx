import React, { useState, useEffect } from 'react'
import { Download, Send, Github, Linkedin, Mail, ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import profileImg from '../profile.png'

export default function Hero({ soundEnabled, incrementScore }) {
  const [textIndex, setTextIndex]   = useState(0)
  const [typedText, setTypedText]   = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const titles = [
    'Firmware Developer',
    'ESP32 Specialist',
    'IoT Engineer',
    'Embedded Systems Architect',
  ]

  useEffect(() => {
    let timer
    const current = titles[textIndex]
    if (isDeleting) {
      timer = setTimeout(() => setTypedText(current.substring(0, typedText.length - 1)), 45)
    } else {
      timer = setTimeout(() => setTypedText(current.substring(0, typedText.length + 1)), 90)
    }
    if (!isDeleting && typedText === current) timer = setTimeout(() => setIsDeleting(true), 2200)
    else if (isDeleting && typedText === '') {
      setIsDeleting(false)
      setTextIndex(p => (p + 1) % titles.length)
    }
    return () => clearTimeout(timer)
  }, [typedText, isDeleting, textIndex])

  const playBeep = () => {
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(660, ctx.currentTime)
      gain.gain.setValueAtTime(0.012, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(); osc.stop(ctx.currentTime + 0.18)
    } catch (e) {}
  }

  const fadeUp = (delay = 0) => ({
    initial:    { opacity: 0, y: 20 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] },
  })

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-cyber-dark py-24"
    >
      {/* Ambient background orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/3 rounded-full blur-[120px] pointer-events-none" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(12,13,16,0.7)_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* ────── Left: Editorial Copy (7 cols) ────── */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">

          {/* Status label */}
          <motion.div {...fadeUp(0)}>
            <span className="section-label mb-8 flex items-center gap-2 inline-block">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Available for opportunities
            </span>
          </motion.div>

          {/* ── Main serif heading — editorial bold statement ── */}
          <motion.h1
            {...fadeUp(0.1)}
            className="heading-serif text-5xl sm:text-7xl md:text-8xl mb-5 leading-[1.02]"
            onClick={() => incrementScore('hero_click', 5, 'Found the Hero Easter Egg! Firmware Overclocked.')}
            style={{ cursor: 'default' }}
          >
            Engineering<br />
            <span className="text-shimmer">the Invisible.</span>
          </motion.h1>

          {/* ── Subtitle: specialty label ── */}
          <motion.p
            {...fadeUp(0.2)}
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-secondary mb-8"
          >
            Embedded Systems · IoT · Firmware · ESP32
          </motion.p>

          {/* ── Typewriter role line ── */}
          <motion.div
            {...fadeUp(0.28)}
            className="flex items-center gap-2 mb-8"
          >
            <span className="font-mono text-sm text-slate-500">→</span>
            <span className="font-mono text-sm text-primary font-medium min-h-[22px]">
              {typedText}
            </span>
            <span className="w-0.5 h-4 bg-primary animate-pulse" />
          </motion.div>

          {/* ── Brief description ── */}
          <motion.p
            {...fadeUp(0.35)}
            className="font-sans text-slate-400 text-base max-w-lg mb-12 leading-relaxed font-light"
          >
            Designing low-level integrations and building stable firmware, real-time operating 
            parameters, and secure telemetry systems for connected IoT deployments.
          </motion.p>

          {/* ── CTA Buttons ── */}
          <motion.div {...fadeUp(0.42)} className="flex flex-wrap gap-4 items-center mb-14">
            <a
              href="#contact"
              onClick={e => {
                playBeep()
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-primary"
              data-hover
            >
              <Send className="w-3.5 h-3.5" />
              View Work
            </a>
            <a
              href="#"
              onClick={e => {
                e.preventDefault(); playBeep()
                incrementScore('resume_click', 5, 'Resume downloaded to cache!')
                alert('Resume PDF download initialized.')
              }}
              className="btn-ghost"
              data-hover
            >
              <Download className="w-3.5 h-3.5" />
              Download CV
            </a>
          </motion.div>

          {/* ── Social Links ── */}
          <motion.div {...fadeUp(0.5)} className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase mr-1">Find me</span>
            {[
              { href: 'https://github.com', Icon: Github, label: 'GitHub' },
              { href: 'https://linkedin.com', Icon: Linkedin, label: 'LinkedIn' },
              { href: 'mailto:krishnamoorthy.firmware@gmail.com', Icon: Mail, label: 'Email' },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target={label !== 'Email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                onClick={playBeep}
                data-hover
                aria-label={label}
                className="p-2.5 border border-white/6 rounded-full text-slate-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* ────── Right: Profile Card (5 cols) ────── */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">

          {/* Profile portrait — elegant framed card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-64 h-72 sm:w-80 sm:h-96 cursor-pointer group"
            onClick={() => incrementScore('hero_click', 5, 'Found the Hero Easter Egg!')}
          >
            {/* Main photo frame */}
            <div className="w-full h-full rounded-2xl overflow-hidden border border-primary/10 bg-cyber-gray shadow-glass group-hover:border-primary/25 transition-all duration-500 group-hover:shadow-neon-blue">
              <img
                src={profileImg}
                alt="Krishnamoorthy S"
                className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-darker/50 via-transparent to-transparent" />
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-primary/30 rounded-tl-sm" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-primary/30 rounded-tr-sm" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-primary/30 rounded-bl-sm" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-primary/30 rounded-br-sm" />
          </motion.div>

          {/* Floating name + role card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="absolute -bottom-4 -left-6 sm:-left-10 glassmorphism-glow-blue px-4 py-3 rounded-xl w-52 max-w-full shadow-glass"
          >
            <p className="text-[9px] font-mono text-secondary tracking-widest uppercase mb-0.5">Hardware Node</p>
            <p className="text-sm font-sans font-semibold text-white leading-tight">ESP32-S3-WROOM</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] font-mono text-green-400">CORE ONLINE</span>
            </div>
          </motion.div>

          {/* Floating tech stack pill */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
            className="absolute -top-4 -right-4 sm:-right-8 glassmorphism px-3 py-2 rounded-lg"
          >
            <p className="text-[9px] font-mono text-primary tracking-widest">C · C++ · Python</p>
          </motion.div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">Scroll</span>
        <ArrowDown className="w-3 h-3 text-slate-500 animate-bounce" />
      </div>
    </section>
  )
}
