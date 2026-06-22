import React, { useEffect, useRef } from 'react'

export default function PCBBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Handle window resize
    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      generateTraces()
    }
    window.addEventListener('resize', handleResize)

    let traces = []
    let currentPackets = []

    // Helper to generate a 45-degree routed trace path from A to B
    const create45DegreePath = (x1, y1, x2, y2) => {
      const points = [{ x: x1, y: y1 }]
      const dx = x2 - x1
      const dy = y2 - y1

      if (Math.abs(dx) > Math.abs(dy)) {
        const bendX = x1 + Math.sign(dx) * Math.abs(dy)
        points.push({ x: bendX, y: y2 })
      } else {
        const bendY = y1 + Math.sign(dy) * Math.abs(dx)
        points.push({ x: x2, y: bendY })
      }
      
      points.push({ x: x2, y: y2 })
      return points
    }

    const generateTraces = () => {
      traces = []
      
      // Central component bus trace layouts
      const addTrace = (fromX, fromY, toX, toY, color = '#DFD3C3') => {
        const path = create45DegreePath(fromX, fromY, toX, toY)
        traces.push({ path, color })
      }

      // Generate structured, clean engineering traces flowing horizontally and vertically
      const rows = 8
      for (let i = 0; i < rows; i++) {
        const yPos = height * (0.12 + i * 0.11)
        // Left side entry traces
        addTrace(0, yPos, width * 0.18, yPos + (i % 2 === 0 ? 40 : -40), '#DFD3C3')
        addTrace(width * 0.18, yPos + (i % 2 === 0 ? 40 : -40), width * 0.32, yPos + (i % 2 === 0 ? 100 : -100), '#9C9286')

        // Right side entry traces
        addTrace(width, yPos + 20, width * 0.82, yPos + (i % 2 === 0 ? -40 : 40), '#9C9286')
        addTrace(width * 0.82, yPos + (i % 2 === 0 ? -40 : 40), width * 0.68, yPos + (i % 2 === 0 ? -100 : 100), '#DFD3C3')
      }

      // Dynamic center system interconnect bus lines
      for (let i = 0; i < 5; i++) {
        const offset = i * 20
        addTrace(width * 0.35 + offset, height * 0.1, width * 0.35 + offset, height * 0.85, '#DFD3C3')
        addTrace(width * 0.45 + offset, height * 0.9, width * 0.45 + offset, height * 0.15, '#9C9286')
      }
    }

    generateTraces()

    // Spawn a slow-moving data current packet
    const spawnPacket = () => {
      if (traces.length === 0) return
      if (currentPackets.length > 25) return // Limit count to keep it minimal and elegant
      
      const randomTrace = traces[Math.floor(Math.random() * traces.length)]
      currentPackets.push({
        trace: randomTrace,
        pointIdx: 0,
        progress: 0,
        speed: 0.004 + Math.random() * 0.005, // Extra slow and elegant movement
        color: randomTrace.color,
        size: 1.2 + Math.random() * 0.8
      })
    }

    // Periodically spawn current packets
    const spawnInterval = setInterval(spawnPacket, 600)

    // Animation Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // 1. Draw static thin copper trace lines
      traces.forEach((trace) => {
        ctx.beginPath()
        ctx.moveTo(trace.path[0].x, trace.path[0].y)
        for (let i = 1; i < trace.path.length; i++) {
          ctx.lineTo(trace.path[i].x, trace.path[i].y)
        }
        ctx.strokeStyle = `${trace.color}0c` // Ultra low opacity (~5%)
        ctx.lineWidth = 1.0
        ctx.stroke()

        // Draw small micro pads at nodes
        const start = trace.path[0]
        const end = trace.path[trace.path.length - 1]
        
        ctx.beginPath()
        ctx.arc(start.x, start.y, 1.5, 0, Math.PI * 2)
        ctx.arc(end.x, end.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `${trace.color}18` // Low opacity pad
        ctx.fill()
      })

      // 2. Draw slow moving current dots (packets)
      currentPackets = currentPackets.filter((p) => {
        p.progress += p.speed
        if (p.progress >= 1) {
          p.pointIdx++
          p.progress = 0
        }

        const path = p.trace.path
        if (p.pointIdx >= path.length - 1) return false

        const p1 = path[p.pointIdx]
        const p2 = path[p.pointIdx + 1]

        const currentX = p1.x + (p2.x - p1.x) * p.progress
        const currentY = p1.y + (p2.y - p1.y) * p.progress

        ctx.beginPath()
        ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}25` // Minimal soft glow dot (~15% opacity)
        ctx.fill()

        return true
      })

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationId)
      clearInterval(spawnInterval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
    />
  )
}
