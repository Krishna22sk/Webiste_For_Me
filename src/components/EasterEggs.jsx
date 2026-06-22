import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Terminal, Award, Sparkles, X } from 'lucide-react'

export default function EasterEggs({ incrementScore, soundEnabled, toast, setToast }) {
  const [keyBuffer, setKeyBuffer] = useState([])
  const [showCoreDump, setShowCoreDump] = useState(false)
  const [coreDumpLines, setCoreDumpLines] = useState([])

  const playChime = (freqs = [523.25, 659.25, 783.99, 1046.50]) => {
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1)
        gain.gain.setValueAtTime(0.015, ctx.currentTime + idx * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.2)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + idx * 0.1)
        osc.stop(ctx.currentTime + idx * 0.1 + 0.2)
      })
    } catch (e) {}
  }

  // Monitor key presses for secret keywords
  useEffect(() => {
    const handleKeyDown = (e) => {
      const char = e.key.toLowerCase()
      setKeyBuffer((prev) => {
        const next = [...prev, char]
        if (next.length > 20) {
          next.shift()
        }
        return next
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Check key buffer for matches
  useEffect(() => {
    const bufferStr = keyBuffer.join('')

    // 1. Konami Code
    const konamiSequence = 'arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba'
    if (bufferStr.includes(konamiSequence)) {
      triggerKonami()
      setKeyBuffer([])
      return
    }

    // 2. Typing 'esp32'
    if (bufferStr.endsWith('esp32')) {
      triggerCoreDump()
      setKeyBuffer([])
      return
    }

    // 3. Typing 'firmware'
    if (bufferStr.endsWith('firmware')) {
      triggerFirmwareConfetti()
      setKeyBuffer([])
      return
    }

  }, [keyBuffer])

  const triggerKonami = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#2563EB', '#06B6D4', '#0F172A']
    })
    playChime([523, 587, 659, 698, 784, 880, 988, 1047])
    incrementScore('konami', 20, 'KONAMI_CODE DETECTED! Global System Overload Bypass Active.')
  }

  const triggerCoreDump = () => {
    playChime([120, 120, 150, 100])
    
    setCoreDumpLines([
      '*** Guru Meditation Error: Core  0 panic\'ed (Interrupt wdt timeout on CPU0) ***',
      'Core 0 register dump:',
      'PC      : 0x40081a2f  PS      : 0x00060030  A0      : 0x400824b2  A1      : 0x3ffb1ed0',
      'A2      : 0x3ffb1ef0  A3      : 0x00000000  A4      : 0x00000004  A5      : 0x00000001',
      'A6      : 0x00000000  A7      : 0x3ffb1eb0  A8      : 0x80081a2f  A9      : 0x3ffb1eb0',
      'SAR     : 0x00000004  EXCCAUSE: 0x00000006  EXCVADDR: 0x00000000  LBEG    : 0x4000c46c',
      'Backtrace: 0x40081a2c:0x3ffb1ed0 0x400824af:0x3ffb1f00 0x400d11bf:0x3ffb1f20',
      'Rebooting system...'
    ])
    
    setShowCoreDump(true)
    incrementScore('esp32_typo', 10, 'CORE_DUMP: ESP32 memory registers decrypted.')
  }

  const triggerFirmwareConfetti = () => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#2563EB', '#06B6D4']
    })
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#2563EB', '#06B6D4']
    })
    playChime([800, 1000, 1200])
    incrementScore('firmware_typo', 10, 'FIRMWARE: Confetti packet injected into render pipe.')
  }

  useEffect(() => {
    if (showCoreDump) {
      const timer = setTimeout(() => {
        setShowCoreDump(false)
      }, 7000)
      return () => clearTimeout(timer)
    }
  }, [showCoreDump])

  return (
    <>
      {/* 1. Achievement Toast Alert HUD */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[1000] max-w-sm w-full bg-white border border-slate-200 rounded-xl p-4 font-mono text-xs shadow-xl"
          >
            <div className="flex justify-between items-start mb-2 select-none">
              <span className="text-primary font-bold tracking-widest flex items-center gap-1.5 uppercase">
                <Award className="w-4 h-4" />
                ACHIEVEMENT_UNLOCKED
              </span>
              <button 
                onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-slate-800 text-xs mb-2">
              {toast.msg}
            </p>
            
            <div className="flex justify-between items-center text-[10px] text-slate-400 select-none">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                SYS_SCORE_REWARD
              </span>
              <span className="text-primary font-extrabold">+{toast.pts} PTS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Core Dump Overlay Modal */}
      <AnimatePresence>
        {showCoreDump && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black flex items-center justify-center p-4 font-mono select-text"
          >
            <div className="max-w-2xl w-full text-green-400 text-[10px] md:text-xs leading-normal">
              <div className="flex justify-between border-b border-green-900 pb-2 mb-4 text-green-500 font-bold select-none">
                <span>[ESP32_CORE_DUMP_INTERRUPT]</span>
                <button 
                  onClick={() => setShowCoreDump(false)} 
                  className="hover:text-white"
                >
                  X_CLOSE
                </button>
              </div>

              <div className="space-y-1">
                {coreDumpLines.map((line, idx) => (
                  <p key={idx} className={line.startsWith('***') ? 'text-red-400 font-bold' : ''}>
                    {line}
                  </p>
                ))}
              </div>

              <div className="mt-8 border-t border-green-900 pt-4 text-center text-[9px] text-green-600 select-none">
                System reset countdown: {5} seconds... Type 'firmware' to trigger recovery routine.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
