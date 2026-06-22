import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Phone, Mail, MessageSquare, ShieldAlert, Cpu } from 'lucide-react'

export default function Contact({ soundEnabled }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })
  
  const [statusMsg, setStatusMsg] = useState('')
  const [errorFields, setErrorFields] = useState([])

  const WHATSAPP_NUMBER = '6369948483' 
  const DIRECT_EMAIL = 'krishnamoorthy.firmware@gmail.com'
  const DIRECT_PHONE = '6369948483'

  const getWhatsAppLink = (text = '') => {
    return `https://wa.me/91${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`
  }

  const playBeep = (freq, duration = 0.08) => {
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.015, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch (e) {}
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (errorFields.includes(id)) {
      setErrorFields((prev) => prev.filter(f => f !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    playBeep(900, 0.1)

    const emptyFields = []
    if (!formData.name.trim()) emptyFields.push('name')
    if (!formData.email.trim()) emptyFields.push('email')
    if (!formData.message.trim()) emptyFields.push('message')

    if (emptyFields.length > 0) {
      playBeep(200, 0.2) 
      setErrorFields(emptyFields)
      setStatusMsg('⚠️ ERROR: COMPULSORY REGISTER VALUE MISSING.')
      return
    }

    setStatusMsg('✓ SUCCESS: COMPILING PAYLOAD... OPENING TRANSMITTER...')

    const rawMessage = `Name: ${formData.name}\nPhone: ${formData.phone || 'N/A'}\nEmail: ${formData.email}\nMessage: ${formData.message}`
    
    setTimeout(() => {
      window.open(getWhatsAppLink(rawMessage), '_blank')
      setStatusMsg('')
      setFormData({ name: '', phone: '', email: '', message: '' })
    }, 1200)
  }

  return (
    <section id="contact" className="py-24 md:py-32 relative bg-cyber-dark border-t border-b border-white/5 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute left-1/3 top-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="section-label block mb-4">07 — Get In Touch</span>
          <h2 className="heading-serif text-4xl md:text-6xl mb-4">
            Let's<br />
            <span className="heading-display text-3xl md:text-5xl">Connect</span>
          </h2>
          <div className="section-divider" />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-stretch">
          
          {/* Column 1: Contact Form Panel (7 Cols) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              className="bg-cyber-gray border border-white/5 shadow-glass p-6 md:p-8 rounded-2xl relative h-full flex flex-col justify-between"
            >
              <div className="absolute inset-0 scanline opacity-5 pointer-events-none rounded-2xl" />
              
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6 select-none font-mono">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider">
                    TRANSMISSION_PROTOCOL_V1.4
                  </span>
                </div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-[9px] font-mono uppercase text-slate-500 font-bold mb-1.5 tracking-widest">
                      REGISTER_NAME *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Recruiter Name"
                      className={`w-full px-4 py-3 rounded-xl bg-cyber-darker border text-white text-sm font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all ${
                        errorFields.includes('name') ? 'border-red-400 bg-red-950/20' : 'border-white/5'
                      }`}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-[9px] font-mono uppercase text-slate-500 font-bold mb-1.5 tracking-widest">
                      REGISTER_PHONE
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-cyber-darker border border-white/5 text-white text-sm font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-[9px] font-mono uppercase text-slate-500 font-bold mb-1.5 tracking-widest">
                    REGISTER_EMAIL *
                    </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. agent@company.com"
                    className={`w-full px-4 py-3 rounded-xl bg-cyber-darker border text-white text-sm font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all ${
                      errorFields.includes('email') ? 'border-red-400 bg-red-950/20' : 'border-white/5'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[9px] font-mono uppercase text-slate-500 font-bold mb-1.5 tracking-widest">
                    PAYLOAD_MESSAGE *
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Type details of firmware requirements or recruitment details..."
                    className={`w-full px-4 py-3 rounded-xl bg-cyber-darker border text-white text-sm font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all resize-none ${
                      errorFields.includes('message') ? 'border-red-400 bg-red-950/20' : 'border-white/5'
                    }`}
                  />
                </div>

                {statusMsg && (
                  <div className={`p-3 rounded-xl text-[9px] font-mono font-bold border ${
                    statusMsg.includes('ERROR')
                      ? 'border-red-800 bg-red-950/20 text-red-400 flex items-center gap-1.5'
                      : 'border-primary/20 bg-primary/10 text-primary animate-pulse'
                  }`}>
                    {statusMsg.includes('ERROR') && <ShieldAlert className="w-4 h-4 text-red-400" />}
                    {statusMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-cyber-dark font-bold tracking-wider rounded-xl transition-all hover:scale-[1.005] active:scale-95 flex items-center justify-center gap-2 font-mono text-xs shadow-md"
                >
                  <Send className="w-4 h-4" />
                  INITIATE_WHATSAPP_HANDSHAKE
                </button>
              </form>
            </motion.div>
          </div>

          {/* Column 2: Direct Connections (5 Cols) */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.15 }}
              className="flex flex-col justify-between h-full gap-6 font-mono"
            >
              <div className="bg-cyber-gray border border-white/5 shadow-glass p-6 rounded-2xl flex-1 flex flex-col justify-around">
                <div>
                  <h3 className="font-orbitron font-extrabold text-lg text-white mb-2 tracking-wide">
                    Direct Connections
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Choose an alternative packet transmission route to establish an instant connection link.
                  </p>
                </div>

                <div className="space-y-4 my-6">
                  {/* WhatsApp Quick Chat */}
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault()
                      playBeep(800, 0.08)
                      window.open(getWhatsAppLink(), '_blank')
                    }}
                    className="flex items-center justify-between p-4 bg-cyber-darker border border-white/5 hover:border-emerald-500/35 hover:bg-cyber-darker rounded-xl group hover:shadow-neon-blue transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-950 border border-emerald-900 text-emerald-400 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-200 group-hover:text-emerald-400 uppercase">
                          WHATSAPP_NODE
                        </span>
                        <span className="block text-[9px] text-slate-500 font-sans mt-0.5">
                          Instant messaging channel
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] text-emerald-400 font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                      CONNECT_SYS
                    </span>
                  </a>

                  {/* Direct Call */}
                  <a
                    href={`tel:${DIRECT_PHONE}`}
                    onClick={() => playBeep(800, 0.08)}
                    className="flex items-center justify-between p-4 bg-cyber-darker border border-white/5 hover:border-primary/35 hover:bg-cyber-darker rounded-xl group hover:shadow-neon-blue transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-full group-hover:bg-primary group-hover:text-cyber-dark transition-all">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-200 group-hover:text-primary uppercase">
                          VOICE_DIALER
                        </span>
                        <span className="block text-[9px] text-slate-500 font-sans mt-0.5">
                          Call +91 63699 48483
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] text-primary font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                      DIAL_PORT
                    </span>
                  </a>

                  {/* Direct Email */}
                  <a
                    href={`mailto:${DIRECT_EMAIL}`}
                    onClick={() => playBeep(800, 0.08)}
                    className="flex items-center justify-between p-4 bg-cyber-darker border border-white/5 hover:border-slate-500/35 hover:bg-cyber-darker rounded-xl group hover:shadow-neon-blue transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyber-lightgray border border-white/5 text-slate-300 rounded-full group-hover:bg-white group-hover:text-black transition-all">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-200 group-hover:text-white uppercase">
                          MAIL_CLIENT
                        </span>
                        <span className="block text-[9px] text-slate-500 font-sans mt-0.5">
                          Write to email address
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-300 font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                      SEND_MAIL
                    </span>
                  </a>
                </div>
              </div>

              {/* Status HUD readout card */}
              <div className="border border-white/5 bg-cyber-darker rounded-xl p-4 text-[9px] text-slate-500 flex flex-col gap-2 relative select-none">
                <div className="absolute top-2.5 right-3.5 text-primary">● RX_READY</div>
                <div>SECURE_TRANSCEIVER: SHIFT_REGISTER // KEY_CIPHER</div>
                <div>TRANSMIT_POWER: +14dBm // RSSI: -48dBm</div>
                <div className="font-sans text-[8px] italic border-t border-white/5 pt-2 text-slate-600">
                  Transmitting over standard TLS endpoints. Text strings will compile locally in device cache registers.
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
