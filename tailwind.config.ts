import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      container: {
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
        },
        center: true,
      },
      fontFamily: {
        josefin: ["var(--font-josefin)"],
        poppins: ["var(--font-poppins)"],
      },
      fontSize: {
        xxs: "0.625rem",
        xs: "0.75rem",
        md: "1rem",
      },
      colors: {
        title: "#14142B",
        body: "#4E4B66",
        label: "#6E7191",
        placholder: "#A0A3BD",
        line: "#D9DBE9",
        "input-bg": "#EFF0F6",
        bg: "#F7F7FC",
        "off-white": "#FCFCFC",
        background: "#FFFFFF",
        foreground: "hsl(var(--foreground))",
        button: {
          "1": "#00FF66",
          "2": "#DB4444",
          DEFAULT: "#00FF66",
          hover: "#E07575",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#5F2EEA",
          foreground: "#BCA4FF",
          background: "#2A00A2",
        },
        secondary: {
          DEFAULT: "#1CC8EE",
          foreground: "#82E9FF",
          background: "#0096B7",
        },
        error: {
          DEFAULT: "#ED2E7E",
          foreground: "#FF84B7",
          background: "#C30052",
        },
        success: {
          DEFAULT: "#00BA88",
          foreground: "#34EAB9",
          background: "#00966D",
        },
        warning: {
          DEFAULT: "#F4B740",
          foreground: "#FFD789",
          background: "#946200",
        },
        "gradient-primary": {
          DEFAULT:
            "linear-gradient(135deg, rgba(116, 51, 255, 1) 0%, rgba(255, 163, 253, 1) 100%)",
          foreground: "#BCA4FF",
          background: "#5F2EEA",
        },
        "gradient-secondary": {
          DEFAULT:
            "linear-gradient(135deg, rgba(98,74,242,1) 0%, rgba(80,221,195,1) 100%)",
          foreground: "#82E9FF",
          background: "#5F2EEA",
        },
        "gradient-accent": {
          DEFAULT:
            "linear-gradient(135deg, rgba(235,0,85,1) 0%, rgba(255,250,128,1) 100%)",
          foreground: "#FFD789",
          background: "#ED2E7E",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": {
            opacity: "1",
          },
          "20%,50%": {
            opacity: "0",
          },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
