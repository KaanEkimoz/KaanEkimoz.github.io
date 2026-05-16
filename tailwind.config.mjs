/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      // Themed colors reference CSS variables defined in src/styles/global.css.
      // The `<alpha-value>` placeholder lets Tailwind's opacity modifiers
      // (e.g. bg-bg-base/80) splice the alpha in correctly. Light theme is
      // applied by setting `data-theme="light"` on <html>.
      colors: {
        bg: {
          base: 'rgb(var(--bg-base) / <alpha-value>)',
          elev: 'rgb(var(--bg-elev) / <alpha-value>)',
          'elev-2': 'rgb(var(--bg-elev-2) / <alpha-value>)',
        },
        accent: {
          1: 'rgb(var(--accent-1) / <alpha-value>)', // cyan
          2: 'rgb(var(--accent-2) / <alpha-value>)', // magenta
          3: 'rgb(var(--accent-3) / <alpha-value>)', // amber
        },
        text: {
          100: 'rgb(var(--text-100) / <alpha-value>)', // headings
          200: 'rgb(var(--text-200) / <alpha-value>)', // body
          300: 'rgb(var(--text-300) / <alpha-value>)', // meta, muted
        },
        border: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
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
