/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        un: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#BAE0FF',
          300: '#7CC4FF',
          400: '#38A7FF',
          500: '#0077D4', // Authentic UNESCO / UN Blue Core
          600: '#005FB8',
          700: '#004A94',
          800: '#00366D',
          900: '#0A2544',
          950: '#051324',
        },
        aurora: {
          cyan: '#00E5FF',
          blue: '#38BDF8',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          indigo: '#6366F1',
        }
      },
      boxShadow: {
        'glass-sm': '0 2px 10px 0 rgba(0, 119, 212, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.9)',
        'glass-md': '0 10px 30px -5px rgba(10, 37, 68, 0.08), 0 2px 8px -2px rgba(0, 119, 212, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.9)',
        'glass-lg': '0 20px 40px -10px rgba(10, 37, 68, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 1)',
        'glass-hover': '0 24px 48px -12px rgba(0, 119, 212, 0.18), inset 0 1px 0 0 rgba(255, 255, 255, 1)',
        'glow-un': '0 0 25px -3px rgba(0, 119, 212, 0.45)',
        'glow-emerald': '0 0 25px -3px rgba(16, 185, 129, 0.45)',
        'glow-amber': '0 0 25px -3px rgba(245, 158, 11, 0.45)',
      },
      animation: {
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
