import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, AlertTriangle, Terminal, Zap, Shield, HelpCircle } from 'lucide-react'

export default function EmbeddedLab({ soundEnabled, incrementScore }) {
  const [activeBus, setActiveBus] = useState('uart') 
  const [selectedPin, setSelectedPin] = useState(null)
  const [oscilloscopeState, setOscilloscopeState] = useState('idle') 
  
  const [terminalLogs, setTerminalLogs] = useState([
    'SYSTEM_BOOT: OK',
    'CLOCK_FREQ: 80MHz',
    'BUS_MONITOR: INITIALIZED',
    'Click GPIO pins or select bus protocols to run diagnostic sweeps...'
  ])
  
  const [cpuClock, setCpuClock] = useState(80) 
  const [isGlitching, setIsGlitching] = useState(false)
  const [spiBits, setSpiBits] = useState({ master: '00000000', slave: '00000000' })
  const [spiClockPulse, setSpiClockPulse] = useState(false)
  const [i2cScanAddress, setI2cScanAddress] = useState(null)
  const [i2cDevicesFound, setI2cDevicesFound] = useState([])
  const [i2cScanning, setI2cScanning] = useState(false)

  const logsEndRef = useRef(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalLogs])

  const playBeep = (freq, duration = 0.08, type = 'sine') => {
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.01, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch (e) {}
  }

  const handlePinClick = (pinNum, role) => {
    setSelectedPin(pinNum)
    playBeep(440 + pinNum * 20, 0.1)
    
    setTerminalLogs((prev) => [
      ...prev,
      `>> INTERRUPT: GPIO_PIN_${pinNum} (${role}) triggered. State: HIGH`,
      `[LOG] ADC Read: ${Math.floor(Math.random() * 4095)} // Voltage: ${(Math.random() * 3.3).toFixed(2)}V`
    ])

    if (pinNum === 2) {
      incrementScore('pin_led', 5, 'Blinked the ESP32 User LED (GPIO 2) repeatedly!')
    }
  }

  // UART Simulation
  useEffect(() => {
    if (activeBus !== 'uart' || oscilloscopeState !== 'running') return

    const uartCommands = [
      { cmd: 'AT+PING', resp: 'OK (Pong)' },
      { cmd: 'AT+TEMP?', resp: '+TEMP: 26.8C [STABLE]' },
      { cmd: 'AT+HEAP?', resp: '+HEAP: 184.2KB FREE' },
      { cmd: 'AT+WIFI?', resp: '+WIFI: CONNECTED "SYS_NET" RSSI=-55dBm' }
    ]
    let cmdIdx = 0

    const interval = setInterval(() => {
      const pair = uartCommands[cmdIdx]
      setTerminalLogs((prev) => [
        ...prev,
        `TX -> ${pair.cmd}`,
        `RX <- ${pair.resp}`
      ])
      playBeep(880, 0.05, 'square')
      
      cmdIdx = (cmdIdx + 1) % uartCommands.length
    }, 2000)

    return () => clearInterval(interval)
  }, [activeBus, oscilloscopeState])

  // SPI Simulation
  const stepSPI = () => {
    if (activeBus !== 'spi') return
    playBeep(600, 0.04)
    setSpiClockPulse(true)
    setTimeout(() => setSpiClockPulse(false), 200)

    const nextMaster = Math.floor(Math.random() * 256).toString(2).padStart(8, '0')
    const nextSlave = Math.floor(Math.random() * 256).toString(2).padStart(8, '0')
    
    setSpiBits({ master: nextMaster, slave: nextSlave })
    setTerminalLogs((prev) => [
      ...prev,
      `[SPI] Exchange: Master[${nextMaster}] <==> Slave[${nextSlave}]`
    ])
  }

  // I2C Scanner
  const runI2cScan = async () => {
    if (activeBus !== 'i2c' || i2cScanning) return
    
    setI2cScanning(true)
    setI2cDevicesFound([])
    setTerminalLogs((prev) => [...prev, '[I2C] Initializing address sweep on SDA/SCL lines...'])
    
    const devices = [
      { addr: 0x27, name: 'LCD Display (PCF8574)' },
      { addr: 0x68, name: 'RTC Clock (DS1307)' }
    ]
    
    for (let addr = 0; addr <= 127; addr++) {
      setI2cScanAddress(addr)
      playBeep(1200 + (addr % 16) * 50, 0.015)
      
      const found = devices.find(d => d.addr === addr)
      if (found) {
        setI2cDevicesFound(prev => [...prev, found])
        setTerminalLogs(prev => [...prev, `[I2C] Found device at address 0x${addr.toString(16).toUpperCase()} (${found.name})`])
        playBeep(2000, 0.15, 'triangle')
      }
      
      await new Promise(r => setTimeout(r, 60))
    }
    
    setI2cScanning(false)
    setI2cScanAddress(null)
    setTerminalLogs((prev) => [...prev, `[I2C] Sweep finished. Found ${devices.length} devices.`])
  }

  // CPU Overclock Easter Egg
  const triggerOverclock = () => {
    if (cpuClock === 80) {
      setCpuClock(160)
      playBeep(600, 0.1)
      setTerminalLogs(prev => [...prev, '[SYSTEM] PLL Config updated: CPU core frequency scaled to 160MHz.'])
    } else if (cpuClock === 160) {
      setCpuClock(240)
      playBeep(800, 0.1)
      setTerminalLogs(prev => [...prev, '[SYSTEM] PLL Config updated: CPU core frequency boosted to 240MHz (Maximum safe speed).'])
    } else if (cpuClock === 240) {
      setCpuClock(400)
      setIsGlitching(true)
      playBeep(120, 0.6, 'sawtooth')
      
      setTerminalLogs(prev => [
        ...prev,
        '⚠️ WARNING: VOLTAGE REGULATOR IN OVER-VOLT STATE',
        '🔥 WARNING: CORE TEMPERATURE EXCEEDS SAFE LIMITS',
        '[CRITICAL] ESP32 overclocked to 400MHz! GLITCH DETECTED...'
      ])
      
      incrementScore('overclock', 15, 'SYSTEM CRITICAL: Overclocked ESP32 to 400MHz! Unlocked Hidden Badge.')
      
      setTimeout(() => {
        setIsGlitching(false)
      }, 3500)
    } else {
      setCpuClock(80)
      playBeep(400, 0.1)
      setTerminalLogs(prev => [...prev, '[SYSTEM] Frequency reset. Scaled back to stable 80MHz.'])
    }
  }

  const leftPins = [
    { num: 3, role: '3V3', type: 'power' },
    { num: 1, role: 'EN', type: 'reset' },
    { num: 36, role: 'GPIO36/SVP', type: 'adc' },
    { num: 39, role: 'GPIO39/SVN', type: 'adc' },
    { num: 34, role: 'GPIO34', type: 'in' },
    { num: 35, role: 'GPIO35', type: 'in' },
    { num: 32, role: 'GPIO32', type: 'io' },
    { num: 33, role: 'GPIO33', type: 'io' },
    { num: 25, role: 'GPIO25/DAC1', type: 'dac' },
    { num: 26, role: 'GPIO26/DAC2', type: 'dac' },
    { num: 27, role: 'GPIO27', type: 'io' },
    { num: 14, role: 'GPIO14/SCK', type: 'spi' },
    { num: 12, role: 'GPIO12/MISO', type: 'spi' },
    { num: 13, role: 'GPIO13/MOSI', type: 'spi' },
    { num: 9, role: 'GND', type: 'power' }
  ]

  const rightPins = [
    { num: 99, role: 'GND', type: 'power' },
    { num: 23, role: 'GPIO23/MOSI', type: 'spi' },
    { num: 22, role: 'GPIO22/SCL', type: 'i2c' },
    { num: 1, role: 'TX0/GPIO1', type: 'uart' },
    { num: 3, role: 'RX0/GPIO3', type: 'uart' },
    { num: 21, role: 'GPIO21/SDA', type: 'i2c' },
    { num: 19, role: 'GPIO19/MISO', type: 'spi' },
    { num: 18, role: 'GPIO18/SCK', type: 'spi' },
    { num: 5, role: 'GPIO5/SS', type: 'spi' },
    { num: 17, role: 'TX2/GPIO17', type: 'uart' },
    { num: 16, role: 'RX2/GPIO16', type: 'uart' },
    { num: 4, role: 'GPIO4', type: 'io' },
    { num: 2, role: 'GPIO2/LED', type: 'led' },
    { num: 15, role: 'GPIO15/SS', type: 'spi' },
    { num: 55, role: '5V', type: 'power' }
  ]

  return (
    <section id="lab" className="py-24 md:py-32 relative bg-cyber-dark font-mono overflow-hidden border-t border-b border-white/5">
      
      {/* Glitch Overlay */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0.1, 0.4, 0] }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-500/10 z-40 pointer-events-none mix-blend-overlay"
            transition={{ repeat: Infinity, duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="section-label block mb-4">05 — Playground</span>
            <h2 className="heading-serif text-4xl md:text-6xl mb-4">
              Virtual MCU<br />
              <span className="heading-display text-3xl md:text-5xl">· ESP32 Lab</span>
            </h2>
            <div className="section-divider" />
          </div>

          {/* Overclock Controller HUD */}
          <div className="flex items-center gap-4 bg-cyber-gray border border-white/5 p-3 rounded-xl shadow-glass">
            <Zap className={`w-4 h-4 ${cpuClock === 400 ? 'text-red-500 animate-bounce' : 'text-primary'}`} />
            <div className="text-xs">
              <div className="text-slate-500 font-sans">PLL_CLOCK:</div>
              <div className={`font-bold ${cpuClock === 400 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                {cpuClock} MHz
              </div>
            </div>
            <button
              onClick={triggerOverclock}
              className={`text-[9px] font-bold px-3 py-1.5 rounded-full border transition-all duration-300 ${
                cpuClock === 400 
                  ? 'bg-red-950 border-red-800 text-red-400 hover:bg-red-900' 
                  : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
              }`}
            >
              {cpuClock === 400 ? 'RESET_FREQ' : 'OVERCLOCK'}
            </button>
          </div>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Column 1: Virtual PCB ESP32 Board (7 Cols) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative bg-cyber-gray border border-white/5 rounded-2xl p-8 shadow-glass flex flex-col items-center w-full max-w-[480px]">
              
              {/* Decorative PCB tracks */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg className="w-full h-full text-white" viewBox="0 0 400 600" fill="none" stroke="currentColor">
                  <path d="M50,100 L150,100 L200,150 L200,300 M350,100 L250,100 L200,150" strokeWidth="1.5" />
                  <path d="M50,500 L150,500 L200,450 L200,350 M350,500 L250,500 L200,450" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>
              </div>

              {/* USB Connector */}
              <div className="w-16 h-8 bg-slate-800 border-b-4 border-slate-700 rounded-t-lg shadow-inner mb-2 flex items-center justify-center text-[8px] text-slate-500 font-bold tracking-widest uppercase">
                USB_C
              </div>

              {/* PCB Container */}
              <div className="relative w-full border border-white/5 bg-cyber-dark rounded-xl p-6 flex justify-between select-none shadow-2xl">
                
                {/* Left Row Pins */}
                <div className="flex flex-col justify-between gap-1.5">
                  {leftPins.map((pin) => (
                    <button
                      key={pin.num}
                      onClick={() => handlePinClick(pin.num, pin.role)}
                      className={`gpio-pin text-[8px] w-14 py-1 text-left px-2 border rounded font-semibold transition-all duration-200 ${
                        selectedPin === pin.num 
                          ? 'bg-primary/20 border-primary text-primary font-bold shadow-neon-blue'
                          : 'bg-cyber-darker border-white/5 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {pin.role}
                    </button>
                  ))}
                </div>

                {/* Center Modules */}
                <div className="flex flex-col items-center justify-between py-6 max-w-[140px]">
                  
                  {/* Metal RF Shield */}
                  <div className="w-24 h-28 bg-slate-800 border-2 border-slate-700 rounded-lg p-2.5 text-center shadow relative flex flex-col justify-center select-none text-slate-400">
                    <div className="text-[7px] font-bold uppercase tracking-widest text-slate-350 font-orbitron">ESP32-S3</div>
                    <div className="text-[6px] font-sans mt-0.5">WROOM-32</div>
                    <div className="text-[6px] text-slate-500">FCC ID: ESP32</div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-3 bg-primary/20 border border-primary/40 rounded flex items-center justify-center">
                      <div className="w-2 h-1 bg-primary/50 rounded-sm" />
                    </div>
                  </div>

                  {/* CPU SoC */}
                  <div className="w-16 h-16 bg-cyber-darker border border-white/5 rounded-lg p-1 flex flex-col items-center justify-center mt-6 shadow-inner relative group cursor-pointer hover:border-primary transition-all">
                    <div className="text-[9px] font-bold text-white tracking-widest uppercase">MCU</div>
                    <div className="text-[6px] text-secondary mt-0.5">240MHz</div>
                    <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-60" />
                    <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  </div>

                  {/* Onboard LED */}
                  <div className="flex items-center gap-1.5 mt-8">
                    <div className="text-[7px] text-slate-500">LED_IO2:</div>
                    <div className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                      selectedPin === 2 
                        ? 'bg-primary border-primary animate-pulse shadow-neon-blue' 
                        : 'bg-slate-850 border-slate-700'
                    }`} />
                  </div>

                  {/* Reset Button */}
                  <button 
                    onClick={() => {
                      playBeep(300, 0.15)
                      setTerminalLogs(prev => [...prev, '[SYSTEM] Hard Reset Triggered... Booting...'])
                    }}
                    className="mt-6 px-3 py-1.5 bg-cyber-gray border border-white/5 rounded text-[7px] text-slate-350 hover:bg-cyber-lightgray hover:text-white transition-all"
                  >
                    EN_RST
                  </button>
                </div>

                {/* Right Row Pins */}
                <div className="flex flex-col justify-between gap-1.5">
                  {rightPins.map((pin) => (
                    <button
                      key={pin.num}
                      onClick={() => handlePinClick(pin.num, pin.role)}
                      className={`gpio-pin text-[8px] w-14 py-1 text-right px-2 border rounded font-semibold transition-all duration-200 ${
                        selectedPin === pin.num 
                          ? 'bg-secondary/20 border-secondary text-secondary font-bold shadow-neon-purple'
                          : 'bg-cyber-darker border-white/5 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {pin.role}
                    </button>
                  ))}
                </div>

              </div>

            </div>
          </div>

          {/* Column 2: Diagnostic & Monitor (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Bus Select Tabs */}
            <div className="flex border border-white/5 bg-cyber-darker p-1 rounded-xl">
              {['uart', 'spi', 'i2c'].map((bus) => (
                <button
                  key={bus}
                  onClick={() => {
                    playBeep(500, 0.05)
                    setActiveBus(bus)
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-300 ${
                    activeBus === bus 
                      ? 'bg-cyber-gray text-primary border border-white/5 shadow-neon-blue' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {bus}
                </button>
              ))}
            </div>

            {/* Protocol Panel */}
            <div className="bg-cyber-gray border border-white/5 shadow-glass rounded-xl p-5 relative h-72 flex flex-col justify-between">
              
              {/* UART Monitor */}
              {activeBus === 'uart' && (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xs text-white font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-primary" />
                      UART Interface (TX/RX)
                    </h3>
                    <p className="text-[10px] text-slate-400 font-sans leading-normal">
                      Shows bidirectional data flow. Transmit bytes from master to ESP32 over serial lines at standard baudrate 115200bps.
                    </p>
                  </div>

                  <div className="border border-white/5 bg-cyber-darker p-2.5 rounded-lg my-3 relative h-20 overflow-hidden flex flex-col justify-around">
                    <div className="absolute inset-0 scanline opacity-5" />
                    <div className="flex items-center justify-between text-[8px] font-mono">
                      <span className="text-slate-500">TX line (DATA):</span>
                      <span className="text-primary font-bold">110101011</span>
                    </div>
                    <div className="h-6 w-full text-primary flex items-center">
                      <svg className="w-full h-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M 0 5 H 10 V 1 H 20 V 9 H 30 V 5 H 40 V 1 H 50 V 9 H 60 V 5 H 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                          {oscilloscopeState === 'running' && (
                            <animate attributeName="strokeDashoffset" values="100;0" dur="2s" repeatCount="indefinite" />
                          )}
                        </path>
                      </svg>
                    </div>
                  </div>

                  <div className="flex gap-2 font-mono">
                    <button
                      onClick={() => {
                        playBeep(400, 0.08)
                        setOscilloscopeState(oscilloscopeState === 'running' ? 'idle' : 'running')
                      }}
                      className={`flex-1 py-2.5 text-[10px] font-bold rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 border ${
                        oscilloscopeState === 'running'
                          ? 'bg-red-950 border border-red-800 text-red-400 hover:bg-red-900'
                          : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      {oscilloscopeState === 'running' ? 'HALT_SIMULATOR' : 'START_TXRX'}
                    </button>
                    <button
                      onClick={() => setTerminalLogs([])}
                      className="px-3 border border-white/5 rounded-full hover:border-primary text-slate-500 hover:text-primary"
                      title="Clear Terminal logs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* SPI Monitor */}
              {activeBus === 'spi' && (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xs text-white font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-primary" />
                      SPI Shift Registers (MOSI/MISO)
                    </h3>
                    <p className="text-[10px] text-slate-400 font-sans leading-normal">
                      Synchronized full-duplex transfer. High-speed transfers with a shared CLK pin. Clock pulses shift bits between nodes.
                    </p>
                  </div>

                  <div className="space-y-3 my-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-500 w-16">MASTER:</span>
                      <div className="flex gap-1 flex-1">
                        {spiBits.master.split('').map((bit, idx) => (
                          <div key={idx} className="flex-1 py-1 text-center bg-cyber-darker border border-white/5 rounded text-xs text-primary font-bold">
                            {bit}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-500 w-16">SLAVE:</span>
                      <div className="flex gap-1 flex-1">
                        {spiBits.slave.split('').map((bit, idx) => (
                          <div key={idx} className="flex-1 py-1 text-center bg-cyber-darker border border-white/5 rounded text-xs text-slate-450 font-bold">
                            {bit}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full border transition-all ${
                        spiClockPulse ? 'bg-primary border-primary shadow-neon-blue' : 'bg-slate-800 border-slate-700'
                      }`} />
                      <span className="text-[8px] text-slate-500 font-bold">SCK_CLK_PULSE</span>
                    </div>
                    <button
                      onClick={stepSPI}
                      className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-[9px] font-bold tracking-wider hover:bg-primary/20 transition-all duration-300"
                    >
                      PULSE_CLOCK
                    </button>
                  </div>
                </div>
              )}

              {/* I2C Monitor */}
              {activeBus === 'i2c' && (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xs text-white font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-primary" />
                      I2C Bus Address Scan (SDA/SCL)
                    </h3>
                    <p className="text-[10px] text-slate-400 font-sans leading-normal">
                      Scans the 2-wire serial bus for responding devices. Send start condition followed by address bytes. Unlocking address ACKs.
                    </p>
                  </div>

                  <div className="bg-cyber-darker border border-white/5 p-2.5 rounded-lg text-center h-24 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 scanline opacity-5" />
                    {i2cScanning ? (
                      <div className="space-y-1.5 w-full">
                        <div className="text-xs text-primary animate-pulse font-bold">
                          SCANNING ADDRESS: 0x{i2cScanAddress?.toString(16).toUpperCase()}
                        </div>
                        <div className="w-36 bg-cyber-lightgray rounded-full h-1 mx-auto overflow-hidden">
                          <div 
                            className="bg-primary h-full" 
                            style={{ width: `${(i2cScanAddress / 127) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px]">
                        <div className="text-slate-500 mb-1.5">Devices found on Bus:</div>
                        {i2cDevicesFound.length > 0 ? (
                          <div className="flex justify-center gap-2">
                            {i2cDevicesFound.map((d) => (
                              <span key={d.addr} className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-[8px] rounded-full font-bold shadow-sm">
                                0x{d.addr.toString(16).toUpperCase()}: {d.name.split(' ')[0]}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500">[BUS_IDLE. Click start to sweep addresses]</span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={runI2cScan}
                    disabled={i2cScanning}
                    className={`w-full py-2.5 text-[9px] font-bold rounded-full transition-all duration-300 font-mono ${
                      i2cScanning 
                        ? 'bg-cyber-lightgray border border-white/5 text-slate-500 cursor-not-allowed' 
                        : 'bg-primary/10 border border-primary/25 text-primary hover:bg-primary/20'
                    }`}
                  >
                    {i2cScanning ? 'SWEEPING_I2C_BUS...' : 'START_I2C_ADDRESS_SWEEP'}
                  </button>
                </div>
              )}

            </div>

            {/* Diagnostic Console */}
            <div className="bg-cyber-gray border border-white/5 shadow-glass rounded-xl p-5 flex flex-col h-[280px] justify-between">
              <div className="text-[10px] text-slate-500 font-bold border-b border-white/5 pb-2 flex items-center justify-between mb-2 select-none uppercase">
                <span>[TERMINAL_OUTPUT_CONSOLE]</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              
              <div className="bg-cyber-darker border border-black p-3.5 rounded-lg font-mono text-[10px] text-primary overflow-y-auto flex-1 space-y-1.5 min-h-0 select-text leading-normal font-light">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="break-all whitespace-pre-wrap">
                    {log.startsWith('>>') ? (
                      <span className="text-sky-300 font-bold">{log}</span>
                    ) : log.startsWith('⚠️') || log.startsWith('[CRITICAL]') ? (
                      <span className="text-red-400 font-bold">{log}</span>
                    ) : log.startsWith('TX ->') ? (
                      <span className="text-primary/70 font-bold">{log}</span>
                    ) : log.startsWith('RX <-') ? (
                      <span className="text-white font-bold">{log}</span>
                    ) : (
                      log
                    )}
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
