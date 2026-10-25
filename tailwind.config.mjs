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
          1: 'rgb(var(--accent-1) / <alpha-value>)', // blue (brand)
          2: 'rgb(var(--accent-2) / <alpha-value>)', // cyan (data)
          3: 'rgb(var(--accent-3) / <alpha-value>)', // indigo
          strong: 'rgb(var(--accent-strong) / <alpha-value>)', // blue behind white text
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
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.14em',
      },
      boxShadow: {
        glow: 'var(--glow)',
        card: 'var(--shadow)',
        'glow-cyan': '0 0 20px rgb(var(--accent-2) / 0.35)',
        'glow-magenta': '0 0 20px rgb(var(--accent-1) / 0.35)',
        'glow-amber': '0 0 20px rgb(var(--accent-3) / 0.35)',
      },
    },
  },
  plugins: [],
};
