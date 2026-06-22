import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Terminal, Network, Hammer } from 'lucide-react'

// HTML5 Canvas Protocol Network Node Visualization
function ProtocolNetwork() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', handleResize)

    // Node definitions
    const nodes = [
      { id: 'esp32', label: 'ESP32 (MCU)', x: width / 2, y: height / 2, size: 20, color: '#DFD3C3' },
      { id: 'uart', label: 'UART', x: width * 0.25, y: height * 0.25, size: 12, color: '#9C9286' },
      { id: 'spi', label: 'SPI', x: width * 0.75, y: height * 0.25, size: 12, color: '#9C9286' },
      { id: 'i2c', label: 'I2C', x: width * 0.2, y: height * 0.5, size: 12, color: '#9C9286' },
      { id: 'can', label: 'CAN Bus', x: width * 0.8, y: height * 0.5, size: 12, color: '#9C9286' },
      { id: 'mqtt', label: 'MQTT Broker', x: width * 0.25, y: height * 0.75, size: 14, color: '#DFD3C3' },
      { id: 'ble', label: 'BLE Link', x: width * 0.75, y: height * 0.75, size: 12, color: '#DFD3C3' },
      { id: 'sensors', label: 'Sensors I/O', x: width * 0.5, y: height * 0.15, size: 12, color: '#9C9286' }
    ]

    const links = [
      { from: 'esp32', to: 'uart' },
      { from: 'esp32', to: 'spi' },
      { from: 'esp32', to: 'i2c' },
      { from: 'esp32', to: 'can' },
      { from: 'esp32', to: 'mqtt' },
      { from: 'esp32', to: 'ble' },
      { from: 'esp32', to: 'sensors' },
      { from: 'uart', to: 'mqtt' },
      { from: 'spi', to: 'sensors' },
      { from: 'i2c', to: 'sensors' }
    ]

    let particles = []
    
    const spawnParticle = (link) => {
      const fromNode = nodes.find(n => n.id === link.from)
      const toNode = nodes.find(n => n.id === link.to)
      if (fromNode && toNode) {
        particles.push({
          fromX: fromNode.x,
          fromY: fromNode.y,
          toX: toNode.x,
          toY: toNode.y,
          progress: 0,
          speed: 0.005 + Math.random() * 0.007,
          color: toNode.color,
          size: 1.5
        })
      }
    }

    const interval = setInterval(() => {
      const randomLink = links[Math.floor(Math.random() * links.length)]
      spawnParticle(randomLink)
    }, 600)

    let hoverNode = null
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      
      let found = null
      nodes.forEach((n) => {
        const dist = Math.hypot(n.x - mx, n.y - my)
        if (dist < n.size + 15) {
          found = n
        }
      })
      hoverNode = found
    }

    const handleCanvasClick = () => {
      if (hoverNode) {
        const connectedLinks = links.filter(l => l.from === hoverNode.id || l.to === hoverNode.id)
        connectedLinks.forEach((link) => {
          for (let i = 0; i < 2; i++) {
            setTimeout(() => {
              spawnParticle(link)
            }, i * 200)
          }
        })
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('click', handleCanvasClick)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // 1. Draw Link lines
      links.forEach((link) => {
        const fromNode = nodes.find(n => n.id === link.from)
        const toNode = nodes.find(n => n.id === link.to)
        if (fromNode && toNode) {
          ctx.beginPath()
          ctx.moveTo(fromNode.x, fromNode.y)
          ctx.lineTo(toNode.x, toNode.y)
          ctx.lineWidth = 1
          
          if (hoverNode && (hoverNode.id === link.from || hoverNode.id === link.to)) {
            ctx.strokeStyle = 'rgba(223, 211, 195, 0.25)'
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
          }
          ctx.stroke()
        }
      })

      // 2. Draw signal particles
      particles = particles.filter((p) => {
        p.progress += p.speed
        if (p.progress >= 1) return false

        const currentX = p.fromX + (p.toX - p.fromX) * p.progress
        const currentY = p.fromY + (p.toY - p.fromY) * p.progress

        ctx.beginPath()
        ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}50` // Transparent soft color
        ctx.fill()
        return true
      })

      // 3. Draw Nodes
      nodes.forEach((n) => {
        const isHovered = hoverNode && hoverNode.id === n.id
        
        n.x = n.id === 'esp32' ? width / 2 : (n.id === 'uart' ? width * 0.22 : (n.id === 'spi' ? width * 0.78 : (n.id === 'i2c' ? width * 0.15 : (n.id === 'can' ? width * 0.85 : (n.id === 'mqtt' ? width * 0.22 : (n.id === 'ble' ? width * 0.78 : width * 0.5))))))
        n.y = n.id === 'esp32' ? height / 2 : (n.id === 'uart' ? height * 0.28 : (n.id === 'spi' ? height * 0.28 : (n.id === 'i2c' ? height * 0.5 : (n.id === 'can' ? height * 0.5 : (n.id === 'mqtt' ? height * 0.72 : (n.id === 'ble' ? height * 0.72 : height * 0.12))))))

        // Outer glow layer
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.size + (isHovered ? 6 : 3), 0, Math.PI * 2)
        ctx.fillStyle = isHovered ? `${n.color}10` : 'rgba(15, 23, 42, 0.01)'
        ctx.strokeStyle = isHovered ? n.color : 'rgba(15, 23, 42, 0.08)'
        ctx.lineWidth = 1
        ctx.fill()
        ctx.stroke()

        // Inner solid core
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.size / 2, 0, Math.PI * 2)
        ctx.fillStyle = n.color
        ctx.fill()

        // Labels
        ctx.fillStyle = isHovered ? '#0f172a' : '#64748b'
        ctx.font = 'bold 9px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.fillText(n.label, n.x, n.y + n.size + 14)
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('click', handleCanvasClick)
      }
    }
  }, [])

  return (
    <div className="w-full h-[320px] md:h-[400px] border border-slate-200 rounded-xl bg-slate-50/50 relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-3 left-4 text-[9px] text-slate-400 font-mono flex items-center gap-1.5 uppercase select-none">
        <Network className="w-3.5 h-3.5 text-primary" />
        <span>LIVE_PROTOCOL_NODE_MAP</span>
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

export default function Skills({ incrementScore }) {
  const [hoveredSkill, setHoveredSkill] = useState(null)

  const skillCategories = [
    {
      id: 'mcu',
      title: 'MICROCONTROLLERS',
      icon: <Cpu className="w-5 h-5 text-primary" />,
      color: 'border-primary',
      skills: [
        { name: 'ESP32', level: '92%', note: 'Dual-Core Tensilica, WiFi, BLE' },
        { name: 'PIC', level: '85%', note: 'PIC16F/PIC18F microcontrollers' },
        { name: '8051', level: '80%', note: 'Legacy & Keil C architectures' },
        { name: 'ARM', level: '78%', note: 'STM32, Cortex-M cores' },
        { name: 'Arduino', level: '95%', note: 'Prototyping & Custom shields' }
      ]
    },
    {
      id: 'prog',
      title: 'PROGRAMMING',
      icon: <Terminal className="w-5 h-5 text-secondary" />,
      color: 'border-secondary',
      skills: [
        { name: 'C', level: '90%', note: 'Low-level registers, pointers' },
        { name: 'C++', level: '82%', note: 'OOP structures for hardware' },
        { name: 'Embedded C', level: '95%', note: 'Bare-metal, registers mapping' }
      ]
    },
    {
      id: 'proto',
      title: 'PROTOCOLS',
      icon: <Network className="w-5 h-5 text-slate-400" />,
      color: 'border-slate-500',
      skills: [
        { name: 'UART', level: '95%', note: 'Asynchronous serial links' },
        { name: 'SPI', level: '90%', note: 'High speed Synchronous bus' },
        { name: 'I2C', level: '92%', note: 'Inter-Integrated circuit bus' },
        { name: 'CAN', level: '80%', note: 'Automotive & Industrial bus' },
        { name: 'RS485', level: '85%', note: 'Modbus & Differential links' },
        { name: 'MQTT', level: '90%', note: 'Broker messaging for IoT nodes' },
        { name: 'BLE', level: '82%', note: 'Bluetooth low energy profiles' }
      ]
    },
    {
      id: 'hw',
      title: 'HARDWARE & I/O',
      icon: <Hammer className="w-5 h-5 text-emerald-500" />,
      color: 'border-emerald-500',
      skills: [
        { name: 'RFID', level: '88%', note: 'RC522 & Active RFID scanners' },
        { name: 'Sensors', level: '92%', note: 'ADC, DAC, 1-wire, analog/digital' },
        { name: 'Schematic Design', level: '78%', note: 'PCB routing, EasyEDA/Altium' },
        { name: 'IoT Systems', level: '85%', note: 'Sensors nodes, gateways' }
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  }

  const handleSkillClick = (name) => {
    if (name === 'ESP32') {
      incrementScore('esp32_skill', 5, 'Selected ESP32. Firmware compiled at 240MHz!')
    }
  }

  return (
    <section id="skills" className="py-24 md:py-32 relative bg-cyber-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="section-label block mb-4">02 — Stack</span>
          <h2 className="heading-serif text-4xl md:text-6xl mb-4">
            Technical<br />
            <span className="heading-display text-3xl md:text-5xl">Skills</span>
          </h2>
          <div className="section-divider" />
        </div>
 
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
          
          {/* Animated Protocol Network Graph Column (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <ProtocolNetwork />
          </div>
 
          {/* Cards Category Column (7 cols) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {skillCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={cardVariants}
                className={`bg-cyber-gray border border-white/5 shadow-glass rounded-xl p-5 border-t-4 ${category.color} relative overflow-hidden group hover:shadow-neon-blue transition-all duration-300`}
              >
                <div className="flex items-center gap-3 mb-5">
                  {category.icon}
                  <h3 className="font-orbitron font-bold text-sm text-white tracking-wider">
                    {category.title}
                  </h3>
                </div>
 
                <div className="space-y-3 font-mono">
                  {category.skills.map((skill) => {
                    const isHovered = hoveredSkill === skill.name
                    return (
                      <div
                        key={skill.name}
                        onClick={() => handleSkillClick(skill.name)}
                        onMouseEnter={() => setHoveredSkill(skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        className="cursor-pointer relative p-2.5 rounded-lg border border-white/5 bg-cyber-darker/30 hover:border-primary/25 hover:bg-cyber-darker transition-all duration-200"
                      >
                        <div className="flex justify-between items-center mb-1 select-none">
                          <span className="text-[11px] font-bold text-slate-200">
                            {skill.name}
                          </span>
                          <span className={`text-[10px] font-bold ${
                            category.id === 'mcu' ? 'text-primary' :
                            category.id === 'prog' ? 'text-secondary' :
                            category.id === 'proto' ? 'text-slate-400' : 'text-emerald-500'
                          }`}>
                            {skill.level}
                          </span>
                        </div>
 
                        {/* Progress Bar */}
                        <div className="w-full bg-cyber-lightgray rounded-full h-1 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              category.id === 'mcu' ? 'bg-primary' :
                              category.id === 'prog' ? 'bg-secondary' :
                              category.id === 'proto' ? 'bg-slate-400' : 'bg-emerald-500'
                            }`}
                            initial={{ width: 0 }}
                            whileInView={{ width: skill.level }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                          />
                        </div>
 
                        {/* Hover note */}
                        <motion.div
                          className="text-[9px] text-slate-500 mt-1 max-h-0 overflow-hidden opacity-0 font-sans"
                          animate={{
                            maxHeight: isHovered ? '40px' : '0px',
                            opacity: isHovered ? 1 : 0,
                            marginTop: isHovered ? '6px' : '0px'
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {skill.note}
                        </motion.div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
 
        </div>
      </div>
    </section>
  )
}
