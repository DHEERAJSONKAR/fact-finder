/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0EA5E9',
          light: '#38BDF8',
          lighter: '#7DD3FC',
          dark: '#0284C7',
          hover: '#0284C7',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          raised: '#FFFFFF',
          hover: '#F1F5F9',
        },
        status: {
          verified: '#10B981',
          inaccurate: '#F59E0B',
          false: '#EF4444',
          unverifiable: '#6B7280',
        },
        bg: {
          base: '#020617',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          light: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
