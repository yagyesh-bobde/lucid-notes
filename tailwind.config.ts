import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#8B5CF6", // Vivid Purple
          foreground: "#fff",
        },
        secondary: {
          DEFAULT: "#D3E4FD", // Soft Blue
          foreground: "#1A1F2C",
        },
        accent: {
          DEFAULT: "#FDE1D3", // Soft Peach for highlight
          foreground: "#333",
        },
        muted: {
          DEFAULT: "#F1F0FB",
          foreground: "#555",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1F2C"
        },
        sidebar: {
          DEFAULT: "#22223B",
          foreground: "#fff",
          accent: "#403E43",
          border: "#2c2c54",
        }
      },
      borderRadius: {
        lg: "1rem",
        md: "0.5rem",
        sm: "0.25rem"
      },
      keyframes: {
        "float-bubble": {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0)" }
        }
      },
      animation: {
        "float-bubble": "float-bubble 2s ease-in-out infinite",
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
