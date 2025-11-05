import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fef8f3",
        foreground: "#1a1a1a",
        orange: {
          DEFAULT: "#ff6b35",
          light: "#ff8c5a",
          dark: "#e55a2b",
          50: "#fff5f0",
          100: "#ffe5d9",
          200: "#ffc9b3",
          300: "#ffa882",
          400: "#ff8c5a",
          500: "#ff6b35",
          600: "#e55a2b",
          700: "#c74a22",
          800: "#a33d1c",
          900: "#7d2f15",
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
