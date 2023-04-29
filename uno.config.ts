import {
	defineConfig,
	presetUno,
	presetTypography,
	presetWebFonts,
} from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
	shortcuts: {
		"modal-overlay":
			"fixed inset-0 bg-gray-500/40 transition-opacity backdrop-blur-md",
		button: "inline-flex justify-center items-center px-4 py-2 text-base font-medium rounded-md border shadow-sm duration-200 focus:outline-none sm:text-sm",
	},
	presets: [
		presetUno(),
		presetTypography({
			cssExtend: {
				"h1,h2,h3,h4,h5.h6": {
					"font-family": "'Poppins'",
				},
			},
		}),
		presetWebFonts({
			provider: "google",
			fonts: {
				sans: "Noto Sans",
			},
		}),
	],
	transformers: [transformerDirectives()],
	theme: {
		colors: {
			dark: {
				DEFAULT: "#181A1B",
				50: "#AEB4B7",
				100: "#A3AAAD",
				200: "#8E969A",
				300: "#788287",
				400: "#656D71",
				500: "#52585C",
				600: "#3E4446",
				700: "#2B2F31",
				800: "#181A1B",
				900: "#000000",
			},
		},
	},
});
