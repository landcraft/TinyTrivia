/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-primary': '#FF477E', // Pop Pink
        'brand-secondary': '#FFBE0B', // Pop Yellow
        'brand-accent': '#3A86FF', // Pop Blue
        'brand-dark': '#1A1A1A',
        'brand-light': '#F0F4F8',
      },
      fontFamily: {
        sans: ['"Fredoka"', 'sans-serif'],
      },
      boxShadow: {
        'pop': '4px 4px 0px 0px rgba(0,0,0,1)',
        'pop-hover': '6px 6px 0px 0px rgba(0,0,0,1)',
        'pop-active': '0px 0px 0px 0px rgba(0,0,0,1)',
        'pop-white': '4px 4px 0px 0px rgba(255,255,255,1)', 
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in-up': 'slideInUp 0.5s ease-in-out',
        'pop-in': 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'bounce-slight': 'bounceSlight 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSlight: {
            '0%, 100%': { transform: 'translateY(-5%)' },
            '50%': { transform: 'translateY(0)' },
        },
        moveStripes: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '50px 50px' },
        }
      }
    }
  },
  plugins: [],
}