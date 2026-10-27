import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F1EFFF',
        line: '#D9D5F5',
        ink: { DEFAULT: '#17133A', soft: '#5A5680', raised: '#2A2360' },
        brand: { DEFAULT: '#5B3DF5', soft: '#7C63FF' },
        x: { DEFAULT: '#F0436A', bright: '#FF7A95', deep: '#D42E58', tint: '#FFE3EA' },
        o: { DEFAULT: '#0E9F8E', bright: '#3EE0C8', deep: '#0E8070', tint: '#D8F5F0' },
      },
      fontFamily: { sans: ['var(--font-sora)', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card: '0 12px 32px -14px rgba(23, 19, 58, 0.25)',
        brand: '0 8px 20px -6px rgba(91, 61, 245, 0.6)',
      },
    },
  },
  plugins: [],
};

export default config;
