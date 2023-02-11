/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
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
	],
};
