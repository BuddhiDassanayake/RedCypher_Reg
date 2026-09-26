/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        snow: "#fbf4f3",
        brick: "#c91903",
        cotton: "#e9c3bf",
        black: "#010101",
        graphite: "#3d3636",
        background: "#010101",
        foreground: "#fbf4f3",
        border: "#3d3636",
        input: "#3d3636",
        ring: "#c91903",
        card: "#010101",
        "card-foreground": "#fbf4f3",
        popover: "#010101",
        "popover-foreground": "#fbf4f3",
        primary: {
          DEFAULT: "#c91903",
          foreground: "#fbf4f3",
        },
        secondary: {
          DEFAULT: "#3d3636",
          foreground: "#fbf4f3",
        },
        muted: {
          DEFAULT: "#3d3636",
          foreground: "#e9c3bf",
        },
        accent: {
          DEFAULT: "#e9c3bf",
          foreground: "#010101",
        },
        destructive: {
          DEFAULT: "#c91903",
          foreground: "#fbf4f3",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
