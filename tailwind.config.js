/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        jeko: {
          'gradient-from': '#0B3D36',
          'gradient-to': '#0E7C66',
          emerald: '#00614F',
          'emerald-deep': '#0B3D36',
          mint: '#97F4D9',
          accent: '#FD761A',
        },
      },
      fontFamily: {
        jeko: ['PlusJakartaSans_400Regular'],
        'jeko-semibold': ['PlusJakartaSans_600SemiBold'],
        'jeko-bold': ['PlusJakartaSans_700Bold'],
      },
    },
  },
  plugins: [],
};
