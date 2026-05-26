/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Legacy HSL tokens (kept for backward compat)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Game palette — maps directly to globals.css CSS variables
        bg0: "var(--bg0)",
        bg1: "var(--bg1)",
        bg2: "var(--bg2)",
        bg3: "var(--bg3)",
        "border-c":     "var(--border)",
        "border-light": "var(--border-light)",
        "theme-text":   "var(--text)",
        "theme-muted":  "var(--muted)",
        "theme-faint":  "var(--faint)",
        "theme-blue":   "var(--blue)",
        "theme-red":    "var(--red)",
        "theme-green":  "var(--green)",
        "theme-yellow": "var(--yellow)",
        "theme-purple": "var(--purple)",
        "theme-orange": "var(--orange)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      minWidth: {
        game: "400px",
        form: "320px",
        card: "260px",
      },
      maxWidth: {
        game: "1920px",
        page: "1280px",
      },
    },
  },
  plugins: [],
};
