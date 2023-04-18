import type { Config } from "tailwindcss";

export default {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
	theme: {
		extend: {
			fontFamily: {
				inter: ["Inter", "sans-serif"],
				poppins: ["Poppins", "sans-serif"],
				sans: ["Noto\\ Sans", "sans-serif"],
			},
			animation: {
				"spin-once": "spin 1s ease-in-out 1",
				hithere: "hithere 1s ease infinite",
			},
			keyframes: {
				hithere: {
					"30%": {
						transform: "scale(1.2)",
					},
					"40%, 60%": {
						transform: "rotate(-20deg) scale(1.2)",
					},
					"50%": {
						transform: "rotate(20deg) scale(1.2)",
					},
					"70%": {
						transform: "rotate(0deg) scale(1.2)",
					},
					"100%": {
						transform: "scale(1)",
					},
				},
			},
			colors: {
				dark: {
					DEFAULT: "#1B1B18",
					50: "#B6B7AE",
					100: "#ADAEA3",
					200: "#999A8D",
					300: "#868778",
					400: "#717265",
					500: "#5B5C51",
					600: "#46463E",
					700: "#30312B",
					800: "#1B1B18",
					900: "#000000",
					950: "#000000",
				},
			},
		},
		nightwind: {
			typography: true,
		},
	},
} satisfies Config;
