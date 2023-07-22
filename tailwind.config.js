/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/screen/**/*.{js,ts,tsx,mdx}",
    "./src/**/**/*.{js,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        purple: {
          light: "rgba(155, 80, 153, 0.1)",
          DEFAULT: "#9B5099",
        },
        green: {
          light: "rgba(95, 180, 101, 0.1)",
          DEFAULT: "#5FB465",
        },
        blue: {
          light: "rgba(61, 103, 173, 0.2)",
          DEFAULT: "#3D67AD",
        },
        yellow: {
          light: "rgba(255, 204, 0, 0.2)",
          DEFAULT: "##FDD207",
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
};
