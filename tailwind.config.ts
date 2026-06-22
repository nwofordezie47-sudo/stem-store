import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff9ec",
          100: "#d8f0c0",
          200: "#b3dc8a",
          300: "#8dbf74",
          400: "#6b9c45",
          500: "#43822e",
          600: "#316d23",
          700: "#25531a",
          800: "#193b11",
          900: "#0f220a",
        },
      },
    },
  },
  plugins: [],
};

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'momo-display': ['"Momo Trust Display"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        icons: ['var(--font-material-symbols)'],
      },
    },
  },
};


export default config;
