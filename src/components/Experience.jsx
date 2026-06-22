import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Briefcase, Activity, Cpu, Lock } from 'lucide-react'

export default function Experience({ soundEnabled }) {
  const [activeProject, setActiveProject] = useState(null)

  const playClick = () => {
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(900, ctx.currentTime)
      gain.gain.setValueAtTime(0.01, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } catch (e) {}
  }

  const experienceData = [
    {
      role: 'Embedded Software Developer',
      company: 'Petal Automations',
      duration: 'June 2025 - Present',
      location: 'India',
      description: 'Engineered firmware solutions for automated hardware, custom microcontroller setups, and real-time communication bridges. Led the low-level architecture design and integration of local RFID scanners and IoT dashboards.',
      projects: [
        {
          title: 'IoT Lab Kit',
          icon: <Cpu className="w-4 h-4 text-primary" />,
          details: 'Designed an educational hardware system to train engineers on IoT communication. Created modular driver scripts for ESP32 and PIC to interface SPI/I2C sensors, pushing telemetry data to brokers.',
          tags: ['ESP32', 'PIC', 'SPI', 'I2C', 'MQTT', 'Sensors']
        },
        {
          title: 'Gym Automation System',
          icon: <Lock className="w-4 h-4 text-secondary" />,
          details: 'Developed an automated locker routing and status network. Programmed ESP32 nodes to scan RFID tags, encrypt validation IDs, and transmit locker status packets over local BLE profiles and MQTT brokers.',
          tags: ['RFID', 'MQTT', 'BLE', 'ESP32', 'PIC', 'Automation']
        }
      ]
    }
  ]

  return (
    <section id="experience" className="py-24 md:py-32 relative bg-cyber-dark border-t border-b border-white/5">
      
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="section-label block mb-4">03 — Timeline</span>
          <h2 className="heading-serif text-4xl md:text-6xl mb-4">
            Experience<br />
            <span className="heading-display text-3xl md:text-5xl">Log</span>
          </h2>
          <div className="section-divider" />
        </div>
 
        {/* Timeline Container */}
        <div className="relative border-l border-white/5 md:ml-6 space-y-12">
          {experienceData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="relative pl-8 md:pl-12 group"
            >
              {/* Timeline point */}
              <div className="absolute -left-[9px] top-1.5 w-[18px] h-[18px] rounded-full bg-cyber-dark border-2 border-primary flex items-center justify-center group-hover:border-secondary transition-colors duration-300 shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-primary group-hover:bg-secondary" />
              </div>
 
              {/* Time badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-mono text-primary mb-5 select-none font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.duration}</span>
              </div>
 
              {/* Work Card */}
              <div className="bg-cyber-gray border border-white/5 shadow-glass rounded-xl p-6 md:p-8 hover:shadow-neon-blue transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-2">
                  <div>
                    <h3 className="font-orbitron font-extrabold text-xl text-white tracking-wide">
                      {item.role}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-secondary font-bold font-mono mt-1.5 uppercase">
                      <Briefcase className="w-4 h-4" />
                      <span>{item.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold font-mono">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
                  </div>
                </div>
 
                <p className="text-slate-400 text-sm font-sans font-light leading-relaxed mb-6">
                  {item.description}
                </p>
 
                {/* Sub-projects list */}
                <div className="space-y-4 font-mono">
                  <div className="text-[10px] font-bold text-slate-500 border-b border-white/5 pb-2.5 flex items-center gap-2 uppercase select-none">
                    <Activity className="w-4 h-4 text-primary" />
                    <span>FEATURED_PROJECTS_UNDER_ROLE:</span>
                  </div>
 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.projects.map((proj, idx) => {
                      const isActive = activeProject === proj.title
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            playClick()
                            setActiveProject(isActive ? null : proj.title)
                          }}
                          className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 bg-cyber-darker/50 select-none ${
                            isActive 
                              ? 'border-primary bg-cyber-darker shadow-neon-blue' 
                              : 'border-white/5 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-200 text-xs flex items-center gap-2">
                              {proj.icon}
                              {proj.title}
                            </span>
                            <span className="text-[9px] text-primary font-bold">
                              {isActive ? 'CLOSE_X' : 'OPEN_O'}
                            </span>
                          </div>
 
                          <motion.div
                            initial={false}
                            animate={{ height: isActive ? 'auto' : '0px', opacity: isActive ? 1 : 0 }}
                            className="overflow-hidden"
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4 mt-2">
                              {proj.details}
                            </p>
                          </motion.div>
 
                          {/* Tech Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {proj.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[8px] font-bold px-2 py-0.5 rounded bg-cyber-dark border border-white/5 text-slate-400"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
