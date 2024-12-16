/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind";
import tailwindScrollbar from "tailwind-scrollbar";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    fontFamily: {
      sans: "Roboto Mono, monospace",
    },
    extend: {
      height: { screen: "100dvh" },
    },
  },
  plugins: [
    flowbite.plugin(),
    tailwindScrollbar,
    /*  tailwindScrollbar({ preferredStrategy: 'pseudoelements' }) */
  ],
};
