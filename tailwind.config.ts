import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#07111f',
        paper: '#f7f3ea',
        sand: '#f0e4d1',
        moss: '#0f766e',
        flame: '#ea580c',
        blush: '#ef4444'
      },
      boxShadow: {
        glow: '0 20px 80px rgba(15, 118, 110, 0.25)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top, rgba(255,255,255,0.35), transparent 40%), linear-gradient(135deg, rgba(15,23,42,0.98), rgba(7,17,31,0.92))'
      }
    }
  },
  plugins: []
};

export default config;
