import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import profileImgUrl from '../profile_real.jpg?url'

/* ═══════════════════════════════════════════════
   TYPEWRITER HOOK
═══════════════════════════════════════════════ */
function useTypewriter(titles) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [del, setDel] = useState(false)
  useEffect(() => {
    const cur = titles[idx]
    let t
    if (del) t = setTimeout(() => setText(cur.substring(0, text.length - 1)), 45)
    else t = setTimeout(() => setText(cur.substring(0, text.length + 1)), 85)
    if (!del && text === cur) t = setTimeout(() => setDel(true), 2200)
    else if (del && text === '') { setDel(false); setIdx(p => (p + 1) % titles.length) }
    return () => clearTimeout(t)
  }, [text, del, idx, titles])
  return text
}

/* ═══════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════ */
function Counter({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const done = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        let v = 0
        const timer = setInterval(() => {
          v += end / 55
          if (v >= end) { setCount(end); clearInterval(timer) }
          else setCount(Math.floor(v))
        }, 22)
      }
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ═══════════════════════════════════════════════
   LIVE CLOCK
═══════════════════════════════════════════════ */
function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i) }, [])
  const p = n => String(n).padStart(2, '0')
  return (
    <div className="pf-clock-wrap">
      <div className="pf-clock-lbl">LIVE</div>
      <div className="pf-clock-time">
        {p(t.getHours())}<span className="pf-csep">:</span>{p(t.getMinutes())}<span className="pf-csep">:</span>
        <motion.span key={p(t.getSeconds())} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {p(t.getSeconds())}
        </motion.span>
      </div>
      <div className="pf-clock-date">{p(t.getDate())}.{p(t.getMonth() + 1)}.{t.getFullYear()}</div>
      <div className="pf-clock-status"><span className="pf-dot-green" />ONLINE</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════════ */
function ParticleCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    if (window.innerWidth <= 900) return
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    c.width = c.offsetWidth; c.height = c.offsetHeight
    const pts = Array.from({ length: 35 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
      r: Math.random() * 2 + 0.8, o: Math.random() * .5 + .15
    }))
    let anim
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(172,138,84,${p.o})`; ctx.fill()
      })
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
        if (d < 60) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
          ctx.strokeStyle = `rgba(172,138,84,${.15 * (1 - d / 60)})`; ctx.lineWidth = .7; ctx.stroke()
        }
      }
      anim = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(anim)
  }, [])
  return <canvas ref={ref} className="pf-particle-c" />
}

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const PROJECTS = [
  {
    id: 1, title: 'IoT Learning Kit', cat: 'FIRMWARE & DEV KIT',
    desc: 'ESP32 & Arduino firmware with I2C, SPI, UART communication protocols and cloud sensor integration.',
    tags: ['ESP32', 'I2C', 'SPI', 'MQTT'], link: 'https://github.com/Krishna22sk', img: null
  },
  {
    id: 2, title: 'Gym Automation System', cat: 'HARDWARE INTEGRATION',
    desc: 'RFID-based locker assignment system with MQTT dashboard monitoring and PIC microcontroller.',
    tags: ['RFID', 'ESP32', 'PIC', 'MQTT'], link: 'https://github.com/Krishna22sk', img: '/GYM.jpg'
  },
  {
    id: 3, title: 'Water Quality Monitor', cat: 'ENVIRONMENTAL IOT',
    desc: 'Biofloc aquaculture monitoring with pH sensor, DS18B20 temperature probe and Blynk cloud.',
    tags: ['Arduino', 'ESP01', 'pH Sensor', 'Blynk'], link: 'https://github.com/Krishna22sk', img: '/WATER.jpg'
  },
  {
    id: 4, title: 'Smart Home Controller', cat: 'IoT AUTOMATION',
    desc: 'ESP32-based home automation with relay control, DHT11 sensor and web dashboard interface.',
    tags: ['ESP32', 'Relay', 'DHT11', 'WebSocket'], link: 'https://github.com/Krishna22sk', img: '/HOME.jpg'
  },
]

const SKILLS = [
  {
    title: 'MICROCONTROLLERS', color: '#C9A97A', items: [
      { n: 'ESP32', v: 92 }, { n: 'Arduino', v: 95 }, { n: 'ARM / STM32', v: 78 }, { n: 'PIC / 8051', v: 82 }
    ]
  },
  {
    title: 'PROGRAMMING', color: '#7A9CC9', items: [
      { n: 'Embedded C', v: 95 }, { n: 'C / C++', v: 88 }, { n: 'Python', v: 80 }, { n: 'Node.js', v: 72 }
    ]
  },
  {
    title: 'PROTOCOLS', color: '#7AC99A', items: [
      { n: 'UART / SPI / I2C', v: 94 }, { n: 'MQTT / BLE', v: 88 }, { n: 'CAN / RS485', v: 82 }, { n: 'One-Wire', v: 85 }
    ]
  },
  {
    title: 'HARDWARE & TOOLS', color: '#C97A9A', items: [
      { n: 'RFID / Sensors', v: 90 }, { n: 'IoT Systems', v: 85 }, { n: 'PCB / EasyEDA', v: 78 }, { n: 'FreeRTOS', v: 76 }
    ]
  },
]

const NAV_LINKS = ['Home', 'About', 'Skills', 'Projects', 'Contact']

/* ═══════════════════════════════════════════════
   TOAST HOOK
═══════════════════════════════════════════════ */
function useToast() {
  const [toasts, setToasts] = useState([])
  const show = (msg, type = 'success') => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200)
  }
  return { toasts, show }
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════ */
export default function PortfolioShowcase() {
  const typed = useTypewriter(['Firmware Developer', 'ESP32 Specialist', 'IoT Engineer', 'Embedded Systems Architect'])
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const { toasts, show } = useToast()

  // Scroll hooks
  const { scrollY, scrollYProgress } = useScroll()
  const yBlob1 = useTransform(scrollY, [0, 2800], [0, 180])
  const yBlob2 = useTransform(scrollY, [0, 2800], [0, -180])
  const opacityScrollHint = useTransform(scrollY, [0, 140], [1, 0])

  // Refs for each section
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const skillsRef = useRef(null)
  const projectsRef = useRef(null)
  const contactRef = useRef(null)

  const sectionRefs = { home: heroRef, about: aboutRef, skills: skillsRef, projects: projectsRef, contact: contactRef }

  // Scroll spy
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.dataset.section) })
    }, { threshold: 0.35 })
    Object.values(sectionRefs).forEach(r => { if (r.current) obs.observe(r.current) })
    return () => obs.disconnect()
  }, [])

  const scrollTo = (section) => {
    const element = sectionRefs[section]?.current
    if (!element) return

    const navbarHeight = 64
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight

    if (menuOpen) {
      setMenuOpen(false)
      // Defer scroll on mobile so the collapsing transition does not abort the browser's smooth scroll
      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }, 150)
    } else {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const handleDownloadCV = () => {
    const a = document.createElement('a')
    a.href = '/Krishnamoorthys_CV.pdf'
    a.download = 'Krishnamoorthy_S_CV.pdf'
    a.click()
    show('CV downloading...', 'success')
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      show('Please fill all fields', 'error'); return
    }
    setSending(true)

    const accessKey = "20b49a8d-03bf-4bc8-9bec-e904061c6e11"

    if (accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
      // Fallback to mock send if key is not yet configured
      await new Promise(r => setTimeout(r, 1600))
      show('Message sent (Demo Mode)! I\'ll get back to you soon 🎉', 'success')
      setFormData({ name: '', email: '', message: '' })
      setSending(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("access_key", accessKey)
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("message", formData.message)
      formDataToSend.append("subject", `New Portfolio Message from ${formData.name}`)

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend
      })
      const data = await response.json()
      if (data.success) {
        show('Message sent! I\'ll get back to you soon 🎉', 'success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        show(data.message || 'Something went wrong. Please try again.', 'error')
      }
    } catch (err) {
      show('Failed to send message. Please check connection.', 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="pf-wrap" style={{ overflow: 'hidden', position: 'relative' }}>
        {/* Parallax Background Blobs */}
        <motion.div style={{ y: yBlob1 }} className="pf-blob pf-blob-1" />
        <motion.div style={{ y: yBlob2 }} className="pf-blob pf-blob-2" />

        {/* ──── TOAST ──── */}
        <div className="pf-toasts">
          <AnimatePresence>
            {toasts.map(t => (
              <motion.div key={t.id} className={`pf-toast pf-toast-${t.type}`}
                initial={{ x: 120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 120, opacity: 0 }}>
                {t.type === 'success' ? '✓' : '!'} {t.msg}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ──── NAVBAR ──── */}
        <nav className="pf-nav">
          <motion.div className="pf-scroll-bar" style={{ scaleX: scrollYProgress }} />
          <div className="pf-nav-inner">
            <div className="pf-brand" onClick={() => scrollTo('home')}>Krishnamoorthy S</div>

            {/* Desktop links */}
            <div className="pf-nav-links">
              {NAV_LINKS.map(l => (
                <button key={l} className={`pf-nav-btn ${activeSection === l.toLowerCase() ? 'pf-nav-active' : ''}`}
                  onClick={() => scrollTo(l.toLowerCase())}>{l}</button>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button className="pf-hamburger" onClick={() => setMenuOpen(p => !p)} aria-label="Menu">
              <span className={menuOpen ? 'pf-ham-open' : ''} />
              <span className={menuOpen ? 'pf-ham-open' : ''} />
              <span className={menuOpen ? 'pf-ham-open' : ''} />
            </button>
          </div>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div className="pf-mobile-menu"
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}>
                {NAV_LINKS.map(l => (
                  <button key={l} className={`pf-mobile-link ${activeSection === l.toLowerCase() ? 'pf-mobile-active' : ''}`}
                    onClick={() => scrollTo(l.toLowerCase())}>{l}</button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ════════════════════════════════════════
            SECTION 1 — HERO
        ════════════════════════════════════════ */}
        <section ref={heroRef} data-section="home" className="pf-section pf-hero-section">
          <div className="pf-hero-inner">

            {/* Left: text */}
            <div className="pf-hero-text">
              <motion.div className="pf-badge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <span className="pf-dot-green" /> Available for opportunities
              </motion.div>

              <motion.h1 className="pf-h1" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}>
                Engineering<br /><span className="pf-gradient-text">the Invisible.</span>
              </motion.h1>

              <motion.p className="pf-specialty" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}>
                Embedded Systems · IoT · Firmware · ESP32
              </motion.p>

              <motion.div className="pf-typerow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>
                <span className="pf-arrow">→</span>
                <span className="pf-typed">{typed}</span>
                <span className="pf-cursor" />
              </motion.div>

              <motion.p className="pf-sub" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .38 }}>
                Designing low-level integrations and building stable firmware, real-time operating parameters, and secure telemetry systems for connected IoT deployments.
              </motion.p>

              <motion.div className="pf-hero-btns" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .46 }}>
                <motion.button className="pf-btn-primary" whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: .97 }}
                  onClick={() => scrollTo('projects')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                  View Work
                </motion.button>
                <motion.button className="pf-btn-ghost" whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: .97 }}
                  onClick={handleDownloadCV}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Download CV
                </motion.button>
              </motion.div>

              <motion.div className="pf-socials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .54 }}>
                <span className="pf-soc-label">Find me</span>
                {[
                  {
                    label: 'GitHub', href: 'https://github.com/Krishna22sk',
                    i: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg>
                  },
                  {
                    label: 'LinkedIn', href: 'https://www.linkedin.com/in/krishnamoorthy1408/',
                    i: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                  },
                  {
                    label: 'Email', href: 'mailto:krishnamoorthys1408@gmail.com',
                    i: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  },
                ].map(({ label, href, i }) => (
                  <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="pf-soc-link" title={label} whileHover={{ scale: 1.12 }} whileTap={{ scale: .95 }}>{i}</motion.a>
                ))}
              </motion.div>
            </div>

            {/* Right: photo */}
            <motion.div className="pf-photo-wrap"
              initial={{ opacity: 0, scale: .95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: .25, duration: .8, ease: [.25, 1, .5, 1] }}>
              <div className="pf-photo-frame">
                <img src={profileImgUrl} alt="Krishnamoorthy S" className="pf-photo" />
                <div className="pf-corner pf-c-tl" /><div className="pf-corner pf-c-tr" />
                <div className="pf-corner pf-c-bl" /><div className="pf-corner pf-c-br" />
              </div>
              <motion.div className="pf-float-card"
                animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}>
                <span className="pf-float-lbl">Hardware Node</span>
                <span className="pf-float-val">ESP32-S3-WROOM</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                  <span className="pf-dot-green" /><span style={{ fontSize: 8, color: '#4CAF50', fontFamily: 'monospace', letterSpacing: '.1em' }}>CORE ONLINE</span>
                </div>
              </motion.div>
              <motion.div className="pf-float-pill"
                animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: .8 }}>
                C · C++ · Python
              </motion.div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="pf-stats-row">
            {[{ l: 'Projects', n: 15, s: '+' }, { l: 'Protocols', n: 7, s: '+' }, { l: 'Modules', n: 12, s: '+' }, { l: 'Yrs Exp', n: 1, s: '+' }].map((s, i) => (
              <motion.div key={s.l} className="pf-stat" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .6 + i * .08 }} whileHover={{ y: -3 }}>
                <div className="pf-stat-n"><Counter end={s.n} suffix={s.s} /></div>
                <div className="pf-stat-l">{s.l}</div>
              </motion.div>
            ))}
          </div>

          <motion.div className="pf-scroll-hint" onClick={() => scrollTo('about')} style={{ opacity: opacityScrollHint }}>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>↓</motion.div>
            <span>Scroll to explore</span>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 2 — ABOUT
        ════════════════════════════════════════ */}
        <section ref={aboutRef} data-section="about" className="pf-section pf-about-section">
          <div className="pf-container">
            <motion.div className="pf-sec-head"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}>
              <span className="pf-sec-label">01 — About Me</span>
              <h2 className="pf-h2">Bridging Hardware<br /><span className="pf-gradient-text">& Software</span></h2>
            </motion.div>

            <div className="pf-about-grid">
              {/* Text */}
              <motion.div className="pf-about-text"
                initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .65 }}>
                <p>
                  I'm <strong>Krishnamoorthy S</strong>, an Embedded Systems & IoT Engineer with hands-on experience
                  in designing and deploying firmware for microcontrollers like ESP32, Arduino, and ARM/STM32.
                </p>
                <p style={{ marginTop: 16 }}>
                  My work spans the full spectrum from bare-metal C to cloud-connected IoT deployments.
                  I specialize in communication protocols (UART, SPI, I2C, MQTT), hardware integration,
                  and building reliable, efficient embedded solutions for real-world problems.
                </p>
                <p style={{ marginTop: 16 }}>
                  I believe the best firmware is invisible — it just works, reliably, every time.
                </p>

                {/* Key facts */}
                <div className="pf-facts-grid">
                  {[
                    { icon: '🎓', label: 'Education', val: 'B.E. Electronics & Communication' },
                    { icon: '📍', label: 'Location', val: 'Tamil Nadu, India' },
                    { icon: '💼', label: 'Experience', val: '1+ Year Embedded Development' },
                    { icon: '🔧', label: 'Specialty', val: 'Firmware & IoT Systems' },
                  ].map((f, fi) => (
                    <motion.div key={f.label} className="pf-fact"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: fi * 0.08, duration: 0.4 }}>
                      <span className="pf-fact-icon">{f.icon}</span>
                      <div>
                        <div className="pf-fact-lbl">{f.label}</div>
                        <div className="pf-fact-val">{f.val}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Cards */}
              <motion.div className="pf-about-cards"
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .65, delay: .1 }}>
                <LiveClock />
                <div className="pf-particle-wrap"><ParticleCanvas /></div>
                <div className="pf-about-quote">
                  <div className="pf-quote-mark">"</div>
                  <p>The best firmware is the one that nobody notices — because it just works.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 3 — SKILLS
        ════════════════════════════════════════ */}
        <section ref={skillsRef} data-section="skills" className="pf-section pf-skills-section">
          <div className="pf-container">
            <motion.div className="pf-sec-head"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}>
              <span className="pf-sec-label">02 — Stack</span>
              <h2 className="pf-h2">Technical Skills</h2>
            </motion.div>

            <div className="pf-skills-grid">
              {SKILLS.map((cat, ci) => (
                <motion.div key={cat.title} className="pf-skill-card"
                  style={{ borderTopColor: cat.color }}
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: ci * .1, duration: .5 }}>
                  <div className="pf-skill-cat" style={{ color: cat.color }}>{cat.title}</div>
                  {cat.items.map(s => (
                    <div key={s.n} className="pf-skill-row">
                      <div className="pf-skill-meta">
                        <span className="pf-skill-name">{s.n}</span>
                        <span className="pf-skill-pct" style={{ color: cat.color }}>{s.v}%</span>
                      </div>
                      <div className="pf-skill-track">
                        <motion.div className="pf-skill-bar" style={{ background: cat.color }}
                          initial={{ width: 0 }} whileInView={{ width: `${s.v}%` }} viewport={{ once: true }}
                          transition={{ delay: .2 + ci * .1, duration: 1.1, ease: 'easeOut' }} />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 4 — PROJECTS
        ════════════════════════════════════════ */}
        <section ref={projectsRef} data-section="projects" className="pf-section pf-projects-section">
          <div className="pf-container">
            <motion.div className="pf-sec-head"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}>
              <span className="pf-sec-label">03 — Portfolio</span>
              <h2 className="pf-h2">Featured Projects</h2>
            </motion.div>

            <div className="pf-projects-grid">
              {PROJECTS.map((p, i) => (
                <motion.div key={p.id} className="pf-proj-card"
                  initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * .1, duration: .5 }}
                  whileHover={{ y: -5, boxShadow: '0 20px 48px rgba(0,0,0,.10)' }}>
                  <div className="pf-proj-thumb">
                    {p.img ? (
                      <img src={p.img} alt={p.title} className="pf-proj-img" />
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C0B090" strokeWidth="1.2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    )}
                  </div>
                  <div className="pf-proj-body">
                    <span className="pf-proj-cat">{p.cat}</span>
                    <h3 className="pf-proj-title">{p.title}</h3>
                    <p className="pf-proj-desc">{p.desc}</p>
                    <div className="pf-proj-tags">
                      {p.tags.map(t => <span key={t} className="pf-tag">{t}</span>)}
                    </div>
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="pf-proj-link">
                      View on GitHub →
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 5 — CONTACT
        ════════════════════════════════════════ */}
        <section ref={contactRef} data-section="contact" className="pf-section pf-contact-section">
          <div className="pf-container">
            <motion.div className="pf-sec-head"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}>
              <span className="pf-sec-label">04 — Contact</span>
              <h2 className="pf-h2">Let's Build<br /><span className="pf-gradient-text">Something.</span></h2>
              <p className="pf-contact-sub">Have a project in mind? I'm always open to discussing new opportunities.</p>
            </motion.div>

            <div className="pf-contact-grid">
              {/* Info */}
              <motion.div className="pf-contact-info"
                initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}>
                {[
                  { icon: '📧', label: 'Email', val: 'krishnamoorthys1408@gmail.com', href: 'mailto:krishnamoorthys1408@gmail.com' },
                  { icon: '🐙', label: 'GitHub', val: 'github.com/Krishna22sk', href: 'https://github.com/Krishna22sk' },
                  { icon: '💼', label: 'LinkedIn', val: 'linkedin.com/in/krishnamoorthy1408', href: 'https://www.linkedin.com/in/krishnamoorthy1408/' },
                  { icon: '📍', label: 'Location', val: 'Tamil Nadu, India', href: null },
                ].map(c => (
                  <div key={c.label} className="pf-contact-item">
                    <span className="pf-contact-icon">{c.icon}</span>
                    <div>
                      <div className="pf-contact-lbl">{c.label}</div>
                      {c.href
                        ? <a href={c.href} target={c.href.startsWith('mailto:') ? undefined : "_blank"} rel="noopener noreferrer" className="pf-contact-val pf-contact-link">{c.val}</a>
                        : <div className="pf-contact-val">{c.val}</div>
                      }
                    </div>
                  </div>
                ))}

                <motion.button className="pf-btn-primary pf-full-width" style={{ marginTop: 24 }}
                  whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: .97 }} onClick={handleDownloadCV}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Download CV
                </motion.button>
              </motion.div>

              {/* Form */}
              <motion.form className="pf-contact-form" onSubmit={handleContactSubmit}
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .6, delay: .1 }}>
                <div className="pf-form-group">
                  <label className="pf-label">Your Name</label>
                  <input className="pf-input" type="text" placeholder="John Doe"
                    value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="pf-form-group">
                  <label className="pf-label">Email Address</label>
                  <input className="pf-input" type="email" placeholder="john@example.com"
                    value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="pf-form-group">
                  <label className="pf-label">Message</label>
                  <textarea className="pf-textarea" placeholder="Tell me about your project..."
                    value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} />
                </div>
                <motion.button type="submit" className="pf-btn-primary pf-full-width"
                  whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: .97 }} disabled={sending}>
                  {sending
                    ? <><span className="pf-spinner" />Sending...</>
                    : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>Send Message</>
                  }
                </motion.button>
              </motion.form>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pf-footer">
          <div className="pf-footer-inner">
            <div className="pf-footer-brand">Krishnamoorthy S</div>
            <div className="pf-footer-links">
              {NAV_LINKS.map(l => (
                <button key={l} className="pf-footer-link" onClick={() => scrollTo(l.toLowerCase())}>{l}</button>
              ))}
            </div>
            <div className="pf-footer-copy">© 2025 Krishnamoorthy S · Embedded Systems Engineer</div>
          </div>
        </footer>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

.pf-wrap {
  min-height: 100vh;
  background: #F8F6F2;
  font-family: 'Inter', sans-serif;
  color: #1A1714;
  position: relative;
}

body {
  zoom: 1.1;
}

/* ─── Grid texture ─── */
.pf-wrap::before {
  content: '';
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(to right, rgba(172,138,84,.055) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(172,138,84,.055) 1px, transparent 1px);
  background-size: 44px 44px;
}

/* ─── TOAST ─── */
.pf-toasts {
  position: fixed; top: 76px; right: 16px; z-index: 9999;
  display: flex; flex-direction: column; gap: 10px;
}
.pf-toast {
  padding: 12px 18px; border-radius: 10px;
  font-size: 13px; font-weight: 600; white-space: nowrap;
  box-shadow: 0 6px 24px rgba(0,0,0,.12);
}
.pf-toast-success { background: #fff; border-left: 4px solid #4CAF50; color: #2E7D32; }
.pf-toast-error   { background: #fff; border-left: 4px solid #E53E3E; color: #C53030; }

/* ─── NAVBAR ─── */
.pf-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: rgba(255,255,255,.88); backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(172,138,84,.14);
}
.pf-nav-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; height: 64px;
}
.pf-brand {
  font-weight: 700; font-size: 14px; letter-spacing: .03em;
  color: #0F0D0B; cursor: pointer; white-space: nowrap;
}
.pf-nav-links { display: flex; gap: 4px; }
.pf-nav-btn {
  background: none; border: none; cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 13px; font-weight: 500; color: #8A7E72;
  padding: 6px 12px; border-radius: 6px;
  transition: all .2s;
}
.pf-nav-btn:hover { color: #1A1714; background: rgba(172,138,84,.07); }
.pf-nav-active { color: #C9A97A !important; font-weight: 600; }

/* Hamburger */
.pf-hamburger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 4px;
}
.pf-hamburger span {
  display: block; width: 22px; height: 2px; border-radius: 2px;
  background: #1A1714; transition: all .28s;
}
.pf-hamburger span.pf-ham-open:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
.pf-hamburger span.pf-ham-open:nth-child(2) { opacity: 0; transform: scaleX(0); }
.pf-hamburger span.pf-ham-open:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }

/* Mobile menu */
.pf-mobile-menu {
  overflow: hidden; border-top: 1px solid rgba(172,138,84,.12);
  background: rgba(255,255,255,.97); backdrop-filter: blur(8px);
  display: flex; flex-direction: column;
}
.pf-mobile-link {
  background: none; border: none; cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 15px; font-weight: 500; color: #4A4035;
  padding: 14px 24px; text-align: left;
  border-bottom: 1px solid rgba(172,138,84,.08);
  transition: all .2s;
}
.pf-mobile-link:hover { background: rgba(172,138,84,.07); color: #1A1714; }
.pf-mobile-active { color: #C9A97A !important; }

/* ─── SECTIONS ─── */
.pf-section { position: relative; z-index: 1; }
.pf-container {
  max-width: 1200px; margin: 0 auto;
  padding: 0 24px;
}
.pf-sec-head { margin-bottom: 48px; }
.pf-sec-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
  color: #C9A97A; display: block; margin-bottom: 10px;
}
.pf-h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(28px, 4vw, 52px); font-weight: 700;
  line-height: 1.1; color: #0F0D0B; letter-spacing: -.02em;
}

/* ─── HERO ─── */
.pf-hero-section {
  min-height: 100vh; padding-top: 64px;
  display: flex; flex-direction: column; justify-content: center;
}
.pf-hero-inner {
  max-width: 1200px; margin: 0 auto; padding: 56px 24px 32px;
  display: grid; grid-template-columns: 1fr 300px;
  gap: 40px; align-items: center;
}
.pf-badge {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; letter-spacing: .18em; text-transform: uppercase;
  color: #7A6E62; margin-bottom: 20px;
}
.pf-dot-green {
  width: 7px; height: 7px; border-radius: 50%; background: #4CAF50;
  animation: pf-pulse 2s infinite; flex-shrink: 0;
}
@keyframes pf-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.55;transform:scale(.82)} }

.pf-h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(30px, 4.2vw, 60px); font-weight: 700;
  line-height: 1.05; letter-spacing: -.03em; color: #0F0D0B;
  margin-bottom: 14px;
}
.pf-gradient-text {
  background: linear-gradient(90deg, #C9A97A 0%, #E8C98A 45%, #B8936A 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: pf-shimmer 3s linear infinite;
}
@keyframes pf-shimmer { 0%{background-position:0 center} 100%{background-position:200% center} }

.pf-specialty {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
  color: #C9A97A; margin-bottom: 16px;
}
.pf-typerow {
  display: flex; align-items: center; gap: 9px; margin-bottom: 16px;
}
.pf-arrow { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #A09080; }
.pf-typed {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px; font-weight: 500; color: #C9A97A; min-width: 180px;
}
.pf-cursor {
  display: inline-block; width: 2px; height: 15px; background: #C9A97A;
  animation: pf-blink 1s step-start infinite;
}
@keyframes pf-blink { 0%,100%{opacity:1} 50%{opacity:0} }

.pf-sub {
  font-size: 13px; color: #6B6256; line-height: 1.75;
  max-width: 480px; margin-bottom: 24px;
}
.pf-hero-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 22px; }
.pf-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 24px; border: none; border-radius: 8px; cursor: pointer;
  background: #C9A97A; color: #fff;
  font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
  letter-spacing: .05em;
  box-shadow: 0 4px 18px rgba(172,138,84,.28);
  transition: all .22s;
}
.pf-btn-primary:hover { background: #B8936A; }
.pf-btn-primary:disabled { opacity: .65; cursor: not-allowed; }
.pf-btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 22px; border: 1.5px solid rgba(172,138,84,.28); border-radius: 8px; cursor: pointer;
  background: transparent; color: #6B6256;
  font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
  letter-spacing: .05em; transition: all .22s;
}
.pf-btn-ghost:hover { border-color: #C9A97A; color: #1A1714; background: rgba(172,138,84,.06); }
.pf-full-width { width: 100%; justify-content: center; }

/* Socials */
.pf-socials { display: flex; align-items: center; gap: 10px; }
.pf-soc-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: .18em; text-transform: uppercase; color: #A09080;
}
.pf-soc-link {
  width: 34px; height: 34px; border-radius: 50%;
  border: 1px solid rgba(172,138,84,.22);
  display: flex; align-items: center; justify-content: center;
  color: #8A7E72; text-decoration: none;
  transition: all .2s;
}
.pf-soc-link:hover { color: #C9A97A; border-color: #C9A97A; background: rgba(172,138,84,.07); }

/* Profile photo */
.pf-photo-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
.pf-photo-frame {
  width: 220px; height: 264px;
  border-radius: 18px;
  background: linear-gradient(145deg, #F2EDE4, #E8E0D4);
  border: 1px solid rgba(172,138,84,.2);
  box-shadow: 0 16px 48px rgba(0,0,0,.1);
  overflow: hidden; position: relative;
  display: flex; align-items: flex-end; justify-content: center;
}
.pf-photo { width: 100%; height: 115%; object-fit: cover; object-position: top center; }
.pf-corner { position: absolute; width: 18px; height: 18px; }
.pf-c-tl { top: 9px; left: 9px; border-top: 2px solid rgba(172,138,84,.5); border-left: 2px solid rgba(172,138,84,.5); }
.pf-c-tr { top: 9px; right: 9px; border-top: 2px solid rgba(172,138,84,.5); border-right: 2px solid rgba(172,138,84,.5); }
.pf-c-bl { bottom: 9px; left: 9px; border-bottom: 2px solid rgba(172,138,84,.5); border-left: 2px solid rgba(172,138,84,.5); }
.pf-c-br { bottom: 9px; right: 9px; border-bottom: 2px solid rgba(172,138,84,.5); border-right: 2px solid rgba(172,138,84,.5); }

.pf-float-card {
  position: absolute; bottom: -12px; left: -50px;
  background: rgba(255,255,255,.94); border: 1px solid rgba(172,138,84,.18);
  border-radius: 12px; padding: 10px 14px;
  box-shadow: 0 6px 24px rgba(0,0,0,.09);
  min-width: 160px;
}
.pf-float-lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px; letter-spacing: .14em; text-transform: uppercase; color: #C9A97A;
  display: block; margin-bottom: 3px;
}
.pf-float-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; font-weight: 700; color: #0F0D0B;
}
.pf-float-pill {
  position: absolute; top: -12px; right: -28px;
  background: rgba(255,255,255,.94); border: 1px solid rgba(172,138,84,.18);
  border-radius: 8px; padding: 6px 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px; font-weight: 500; color: #C9A97A;
  box-shadow: 0 4px 16px rgba(0,0,0,.07);
}

/* Stats row */
.pf-stats-row {
  max-width: 1200px; margin: 0 auto;
  display: flex; gap: 14px; padding: 18px 24px 32px;
  border-top: 1px solid rgba(172,138,84,.1);
  flex-wrap: wrap;
}
.pf-stat {
  flex: 1 1 100px; min-width: 90px;
  background: rgba(255,255,255,.88);
  border: 1px solid rgba(172,138,84,.15);
  border-top: 3px solid #C9A97A;
  border-radius: 10px; padding: 16px 12px; text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,.04); cursor: default;
  transition: transform .2s;
}
.pf-stat:hover { transform: translateY(-3px); }
.pf-stat-n {
  font-family: 'Playfair Display', serif;
  font-size: 26px; font-weight: 700; color: #C9A97A; line-height: 1;
  margin-bottom: 4px;
}
.pf-stat-l {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px; letter-spacing: .14em; text-transform: uppercase; color: #8A7E72;
}

/* Scroll hint */
.pf-scroll-hint {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding-bottom: 28px; cursor: pointer;
  font-size: 11px; color: #A09080; letter-spacing: .08em;
  position: relative; z-index: 1;
}

/* ─── ABOUT ─── */
.pf-about-section {
  padding: 100px 0;
  background: rgba(255,255,255,.55);
}
.pf-about-grid {
  display: grid; grid-template-columns: 1fr 320px;
  gap: 48px; align-items: start;
}
.pf-about-text p { font-size: 14px; color: #4A4035; line-height: 1.8; }
.pf-about-text strong { color: #1A1714; font-weight: 700; }

.pf-facts-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 12px; margin-top: 28px;
}
.pf-fact {
  display: flex; align-items: flex-start; gap: 10px;
  background: rgba(249,247,244,.9);
  border: 1px solid rgba(172,138,84,.12);
  border-radius: 10px; padding: 12px;
}
.pf-fact-icon { font-size: 18px; flex-shrink: 0; }
.pf-fact-lbl { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; letter-spacing: .12em; text-transform: uppercase; color: #C9A97A; margin-bottom: 2px; }
.pf-fact-val { font-size: 12px; font-weight: 600; color: #1A1714; }

.pf-about-cards { display: flex; flex-direction: column; gap: 12px; }

/* Clock */
.pf-clock-wrap {
  background: rgba(255,255,255,.9);
  border: 1px solid rgba(172,138,84,.16);
  border-radius: 12px; padding: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,.05);
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.pf-clock-lbl { font-family: 'JetBrains Mono', monospace; font-size: 7.5px; letter-spacing: .2em; text-transform: uppercase; color: #C9A97A; }
.pf-clock-time {
  font-family: 'Playfair Display', serif;
  font-size: 32px; font-weight: 700; color: #0F0D0B; display: flex; align-items: baseline;
}
.pf-csep { color: #C9A97A; padding: 0 2px; font-size: 24px; }
.pf-clock-date { font-size: 11px; font-weight: 500; color: #A09080; }
.pf-clock-status { display: flex; align-items: center; gap: 6px; font-size: 9px; color: #4CAF50; font-family: monospace; letter-spacing: .08em; }

/* Particle */
.pf-particle-wrap {
  background: #FAF8F5; border: 1px solid rgba(172,138,84,.14);
  border-radius: 12px; overflow: hidden; height: 100px;
}
.pf-particle-c { width: 100%; height: 100%; display: block; }

/* Quote */
.pf-about-quote {
  background: rgba(255,255,255,.9); border: 1px solid rgba(172,138,84,.16);
  border-radius: 12px; padding: 18px 18px 18px 22px;
  box-shadow: 0 2px 12px rgba(0,0,0,.05);
  border-left: 4px solid #C9A97A; position: relative;
}
.pf-quote-mark { font-family: 'Playfair Display', serif; font-size: 48px; color: #E8D9C0; line-height: .8; margin-bottom: 4px; }
.pf-about-quote p { font-size: 12px; font-style: italic; color: #6B6256; line-height: 1.7; }

/* ─── SKILLS ─── */
.pf-skills-section { padding: 100px 0; }
.pf-skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.pf-skill-card {
  background: rgba(255,255,255,.85); border: 1px solid rgba(172,138,84,.14);
  border-top-width: 3px; border-radius: 12px; padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,.04);
  transition: background .2s;
}
.pf-skill-card:hover { background: rgba(255,255,255,.98); }
.pf-skill-cat { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 14px; display: block; }
.pf-skill-row { margin-bottom: 10px; }
.pf-skill-meta { display: flex; justify-content: space-between; margin-bottom: 4px; }
.pf-skill-name { font-size: 12px; font-weight: 600; color: #1A1714; }
.pf-skill-pct { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; }
.pf-skill-track { height: 3px; border-radius: 2px; background: rgba(172,138,84,.14); overflow: hidden; }
.pf-skill-bar { height: 100%; border-radius: 2px; }

/* ─── PROJECTS ─── */
.pf-projects-section { padding: 100px 0; background: rgba(255,255,255,.55); }
.pf-projects-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.pf-proj-card {
  background: #fff; border: 1px solid rgba(172,138,84,.16);
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,.05);
  cursor: pointer; transition: box-shadow .25s, transform .25s;
  display: flex; flex-direction: column;
}
.pf-proj-thumb {
  height: 120px; background: #EDEAE4;
  display: flex; align-items: center; justify-content: center;
  border-bottom: 1px solid rgba(172,138,84,.1);
  overflow: hidden;
}
.pf-proj-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.pf-proj-card:hover .pf-proj-img {
  transform: scale(1.06);
}
.pf-proj-body { padding: 16px 18px 18px; flex: 1; display: flex; flex-direction: column; }
.pf-proj-cat { font-family: 'JetBrains Mono', monospace; font-size: 8px; letter-spacing: .14em; text-transform: uppercase; color: #C9A97A; display: block; margin-bottom: 6px; }
.pf-proj-title { font-size: 14px; font-weight: 700; color: #1A1714; margin-bottom: 8px; }
.pf-proj-desc { font-size: 12px; color: #7A6E62; line-height: 1.6; margin-bottom: 12px; flex: 1; }
.pf-proj-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
.pf-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px; letter-spacing: .06em;
  background: rgba(172,138,84,.1); border: 1px solid rgba(172,138,84,.22);
  border-radius: 4px; padding: 3px 7px; color: #8A6A3A;
}
.pf-proj-link {
  font-size: 12px; font-weight: 600; color: #C9A97A; text-decoration: none;
  transition: color .2s; letter-spacing: .03em;
}
.pf-proj-link:hover { color: #B8936A; }

/* ─── CONTACT ─── */
.pf-contact-section { padding: 100px 0; }
.pf-contact-sub { font-size: 14px; color: #6B6256; margin-top: 12px; line-height: 1.7; }
.pf-contact-grid { display: grid; grid-template-columns: 340px 1fr; gap: 40px; align-items: start; }

.pf-contact-info { display: flex; flex-direction: column; gap: 0; }
.pf-contact-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 14px 16px;
  background: rgba(255,255,255,.85);
  border: 1px solid rgba(172,138,84,.14);
  border-radius: 10px; margin-bottom: 10px;
}
.pf-contact-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
.pf-contact-lbl { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; letter-spacing: .12em; text-transform: uppercase; color: #C9A97A; margin-bottom: 3px; }
.pf-contact-val { font-size: 12px; font-weight: 600; color: #1A1714; word-break: break-all; }
.pf-contact-link { text-decoration: none; color: #C9A97A !important; transition: color .2s; }
.pf-contact-link:hover { color: #B8936A !important; }

/* Form */
.pf-contact-form {
  background: rgba(255,255,255,.88); border: 1px solid rgba(172,138,84,.16);
  border-radius: 14px; padding: 28px;
  box-shadow: 0 2px 14px rgba(0,0,0,.05);
  display: flex; flex-direction: column; gap: 18px;
}
.pf-form-group { display: flex; flex-direction: column; gap: 6px; }
.pf-label { font-size: 12px; font-weight: 600; color: #3A3025; }
.pf-input, .pf-textarea {
  width: 100%; padding: 11px 14px;
  background: #FDFCFA; border: 1.5px solid rgba(172,138,84,.2);
  border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 13px; color: #1A1714;
  outline: none; transition: border-color .2s;
}
.pf-input:focus, .pf-textarea:focus { border-color: #C9A97A; background: #fff; }
.pf-input::placeholder, .pf-textarea::placeholder { color: #B0A898; }
.pf-textarea { min-height: 130px; resize: vertical; }

/* Spinner */
.pf-spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  animation: pf-spin .7s linear infinite; display: inline-block;
}
@keyframes pf-spin { to { transform: rotate(360deg); } }

/* ─── FOOTER ─── */
.pf-footer {
  background: #1A1714; color: #D4C4A8;
  border-top: 1px solid rgba(172,138,84,.18);
  position: relative; z-index: 1;
}
.pf-footer-inner {
  max-width: 1200px; margin: 0 auto; padding: 28px 24px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 14px;
}
.pf-footer-brand { font-weight: 700; font-size: 14px; color: #E8D9C0; }
.pf-footer-links { display: flex; gap: 6px; flex-wrap: wrap; }
.pf-footer-link {
  background: none; border: none; cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 12px; color: #A09080;
  padding: 4px 10px; border-radius: 5px;
  transition: color .2s;
}
.pf-footer-link:hover { color: #C9A97A; }
.pf-footer-copy { font-size: 11px; color: #5A504A; }

/* ─── SCROLLBAR ─── */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(172,138,84,.25); border-radius: 3px; }

/* ═══════════════════════════════════════════════
   MOBILE RESPONSIVE
═══════════════════════════════════════════════ */
@media (max-width: 900px) {
  .pf-nav-links { display: none; }
  .pf-hamburger { display: flex; }

  .pf-hero-inner {
    grid-template-columns: 1fr;
    gap: 32px; padding: 80px 20px 24px;
  }
  .pf-photo-wrap { order: -1; margin: 0 auto; }
  .pf-photo-frame { width: 180px; height: 216px; }
  .pf-float-card { left: -20px; bottom: -16px; min-width: 140px; }
  .pf-float-pill { top: -10px; right: -12px; }

  .pf-h1 { font-size: 32px; }
  .pf-sub { max-width: 100%; }

  .pf-stats-row { gap: 10px; padding: 16px 20px 24px; }
  .pf-stat { flex: 1 1 80px; padding: 12px 8px; }
  .pf-stat-n { font-size: 22px; }

  .pf-about-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .pf-particle-wrap { display: none; }
  .pf-about-cards { display: flex; flex-direction: column; gap: 12px; }
  .pf-facts-grid { grid-template-columns: 1fr; }

  .pf-skills-grid { grid-template-columns: 1fr; }

  .pf-projects-grid { grid-template-columns: 1fr; }

  .pf-contact-grid { grid-template-columns: 1fr; gap: 24px; }
  .pf-contact-info { order: 2; }
  .pf-contact-form { order: 1; }

  .pf-footer-inner { flex-direction: column; align-items: flex-start; gap: 10px; }

  .pf-about-section,
  .pf-skills-section,
  .pf-projects-section,
  .pf-contact-section { padding: 72px 0; }

  .pf-container { padding: 0 16px; }

  .pf-toasts { top: 68px; right: 12px; }
  .pf-toast { white-space: normal; max-width: calc(100vw - 40px); }
}

@media (max-width: 480px) {
  .pf-hero-btns { flex-direction: column; }
  .pf-btn-primary, .pf-btn-ghost { width: 100%; justify-content: center; }
  .pf-about-cards { grid-template-columns: 1fr; }
  .pf-h2 { font-size: 26px; }
  .pf-photo-frame { width: 160px; height: 192px; }
}

/* Scroll progress bar */
.pf-scroll-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #C9A97A, #E8C98A);
  transform-origin: 0%;
  z-index: 101;
}

/* Glowing background blobs */
.pf-blob {
  position: absolute;
  width: 380px;
  height: 380px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.65;
  filter: blur(130px);
}
.pf-blob-1 {
  top: 18%;
  left: -8%;
  background: radial-gradient(circle, rgba(201,169,122,0.18) 0%, rgba(201,169,122,0) 70%);
}
.pf-blob-2 {
  top: 52%;
  right: -8%;
  width: 440px;
  height: 440px;
  background: radial-gradient(circle, rgba(122,156,201,0.14) 0%, rgba(122,156,201,0) 70%);
}
`
