/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Background layers
        bg: {
          base: '#0a0a14',
          elev: '#14141f',
          'elev-2': '#1f1f2e',
        },
        // Accent colors (cool palette: cyan + magenta + amber)
        accent: {
          1: '#00d9ff', // cyan — primary CTA, link, glow
          2: '#ff4dff', // magenta — hover, secondary highlight
          3: '#ffd60a', // amber — XP/level/reward emphasis
        },
        // Text hierarchy
        text: {
          100: '#f0f0f5', // headings
          200: '#b8b8c8', // body
          300: '#a8a8c0', // meta, muted — WCAG AA contrast on bg-base (~7:1)
        },
        border: {
          DEFAULT: '#2a2a3a',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 217, 255, 0.4)',
        'glow-magenta': '0 0 20px rgba(255, 77, 255, 0.4)',
        'glow-amber': '0 0 20px rgba(255, 214, 10, 0.4)',
      },
    },
  },
  plugins: [],
};
