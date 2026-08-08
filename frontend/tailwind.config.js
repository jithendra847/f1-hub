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
        f1: {
          bg: 'var(--bg-primary)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
          red: '#E10600',
          dark: 'var(--text-primary)',
          muted: 'var(--text-muted)',
          secondary: 'var(--text-secondary)',
          border: 'var(--border-primary)',
          shadowDark: '#C5CAD1',
          shadowLight: '#FFFFFF',
        }
      },
      boxShadow: {
        'soft-outer': 'var(--card-shadow)',
        'soft-outer-sm': 'var(--card-shadow-sm)',
        'soft-outer-hover': 'var(--card-shadow-hover)',
        'soft-inset': 'var(--card-shadow-inset)',
        'accent-glow': 'var(--accent-glow)'
      }
    },
  },
  plugins: [],
}
