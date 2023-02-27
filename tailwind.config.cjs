/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				inter: ["'Inter'", "sans-serif"],
				poppins: ["'Poppins'", "sans-serif"],
			},
			animation: {
				"spin-once": "spin 1s ease-in-out 1",
			},
		},
		nightwind: {
			typography: true,
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/aspect-ratio"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/line-clamp"),
	],
};
