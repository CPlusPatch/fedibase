import {
	defineConfig,
	presetUno,
	presetTypography,
	presetWebFonts,
} from "unocss";
export default defineConfig({
	shortcuts: {
		"navbar-element":
			"!px-0 !py-0 !p-3 h-full !rounded-none grow dark:hover:!bg-dark-600 flex items-center justify-center text-xs flex-col gap-y-1; hover:!bg-gray-300 !bg-transparent !border-none !shadow-none !bg-white dark:!bg-transparent",
		"navbar-link":
			"flex items-center justify-center text-xs flex-col gap-y-1;",
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
	preflights: [
		{
			getCSS: () =>
				`*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:theme('borderColor.DEFAULT', currentColor)}::after,::before{--tw-content:''}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:theme('fontFamily.sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");font-feature-settings:theme('fontFamily.sans[1].fontFeatureSettings', normal);font-variation-settings:theme('fontFamily.sans[1].fontVariationSettings', normal)}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:theme('fontFamily.mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type='button'],[type='reset'],[type='submit'],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type='search']{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:theme('colors.gray.400', #9ca3af)}[role="button"],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}`,
		},
	],
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
