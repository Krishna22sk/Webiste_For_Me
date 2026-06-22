/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core luxury palette from mockup
        primary: '#F5E6CA',       // Warm beige — main accent glow
        secondary: '#C9B99A',     // Muted warm beige — secondary
        accent: '#DFD3C3',        // Soft ivory
        highlight: '#F5E6CA',
        success: '#10B981',
        cyber: {
          dark:       '#121316',  // Deep slate charcoal (BG)
          darker:     '#0D0F12',  // Even deeper base
          gray:       '#1A1D22',  // Card fills
          lightgray:  '#21252C',  // Hover card fill
          text:       '#FFFFFF',
        }
      },
      fontFamily: {
        // Elegant serif for headings (Playfair Display = luxury editorial)
        serif:    ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        orbitron: ['"Playfair Display"', 'serif'],   // repurpose alias → serif heading
        sora:     ['"Playfair Display"', 'serif'],
        display:  ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        // Clean sans-serif for body and labels
        sans:     ['Inter', 'system-ui', 'sans-serif'],
        // Monospaced for code, pins, readings
        mono:     ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-blue':   '0 4px 24px rgba(245, 230, 202, 0.12)',
        'neon-purple': '0 4px 24px rgba(201, 185, 154, 0.10)',
        'neon-cyan':   '0 4px 20px rgba(245, 230, 202, 0.08)',
        'glass':       '0 8px 40px 0 rgba(0, 0, 0, 0.6)',
        'glow-warm':   '0 0 40px rgba(245, 230, 202, 0.08)',
        'card-hover':  '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(245, 230, 202, 0.1)',
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, rgba(245, 230, 202, 0.04) 1px, transparent 1px)',
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        glow: {
          '0%':   { boxShadow: '0 0 10px rgba(245, 230, 202, 0.08)' },
          '100%': { boxShadow: '0 0 30px rgba(245, 230, 202, 0.20)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
