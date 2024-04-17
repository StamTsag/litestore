import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00afef",
        secondary: "#ef4000",
        "folder-primary": "#f0f0f0",
        "file-bg": "#eaF6Ff",
        "file-bg-active": "#eaF8Ff",
        "dark-half": "rgb(20, 20, 20, 0.9)",
      },

      boxShadow: {
        bg: "0 0 20px 0 rgba(0, 0, 0, 0.1)",
        "bg-white": "0 0 20px 0 rgba(255, 255, 255, 0.075)",
        "bg-dark": "0 0 20px 0 rgba(0, 0, 0, 0.1)",
        "bg-dark-sm": "0 0 20px 0 rgba(0, 0, 0, 0.025)",
      },

      screens: {
        mobile: {
          max: "900px",
        },
      },

      backgroundImage: {
        main: "url('/homepage-bg.jpg')",
      },

      animation: {
        twirl: "logo-twirl 2.5s ease",
      },

      keyframes: {
        "logo-twirl": {
          "0%": { transform: "translateY(0px)" },
          "25%": { transform: "translateY(-3px) translateX(2px) scale(0.9)" },
          "75%": { transform: "translateY(3px) translateX(-2px) scale(0.85)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
