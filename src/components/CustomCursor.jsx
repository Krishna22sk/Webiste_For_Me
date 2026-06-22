import React, { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [pos, setPos]       = useState({ x: -200, y: -200 })
  const [trail, setTrail]   = useState({ x: -200, y: -200 })
  const [isHover, setIsHover] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const onMove = (e) => {
      const { clientX: x, clientY: y } = e
      setPos({ x, y })
      document.documentElement.style.setProperty('--mouse-x', `${x}px`)
      document.documentElement.style.setProperty('--mouse-y', `${y}px`)
    }

    const onEnter = (e) => {
      if (e.target.closest('a, button, [data-hover]')) setIsHover(true)
    }
    const onLeave = (e) => {
      if (e.target.closest('a, button, [data-hover]')) setIsHover(false)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', checkMobile)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
    }
  }, [])

  // Smooth trailing glow with rAF
  useEffect(() => {
    let rafId
    const lerp = (a, b, t) => a + (b - a) * t
    const tick = () => {
      setTrail(prev => ({
        x: lerp(prev.x, pos.x, 0.08),
        y: lerp(prev.y, pos.y, 0.08),
      }))
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [pos])

  if (isMobile) return null

  return (
    <>
      {/* Outer soft warm beige radial glow — trails slowly behind cursor */}
      <div
        className="fixed pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2"
        style={{
          left:       `${trail.x}px`,
          top:        `${trail.y}px`,
          width:      isHover ? '160px' : '110px',
          height:     isHover ? '160px' : '110px',
          background: 'radial-gradient(circle, rgba(245,230,202,0.10) 0%, rgba(245,230,202,0.04) 40%, transparent 70%)',
          transition: 'width 0.4s ease, height 0.4s ease',
          willChange: 'left, top',
        }}
      />

      {/* Inner crisp cursor ring — follows cursor exactly */}
      <div
        className="fixed pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2"
        style={{
          left:         `${pos.x}px`,
          top:          `${pos.y}px`,
          width:        isHover ? '20px' : '8px',
          height:       isHover ? '20px' : '8px',
          background:   isHover ? 'transparent' : 'rgba(245,230,202,0.85)',
          border:       isHover ? '1.5px solid rgba(245,230,202,0.75)' : 'none',
          borderRadius: '50%',
          transition:   'width 0.25s ease, height 0.25s ease, background 0.25s ease, border 0.25s ease',
          willChange:   'left, top',
        }}
      />
    </>
  )
}
