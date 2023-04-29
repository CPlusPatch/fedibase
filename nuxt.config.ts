// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		"@nuxtjs/robots",
		"@nuxt/image-edge",
		"@vite-pwa/nuxt",
		"@unocss/nuxt",
		"@nuxtjs/eslint-module",
		"nuxt-headlessui",
		"nuxt-icon",
		"@pinia/nuxt",
		"@pinia-plugin-persistedstate/nuxt",
	],
	pinia: {
		autoImports: ["defineStore"],
	},
	ssr: false,
	app: {
		keepalive: true,
		head: {
			link: [
				{
					rel: "icon",
					href: "/favicon.png",
					type: "image/png",
				},
			],
			title: "Fedibase",
			htmlAttrs: { lang: "en-us" },
		},
	},
	vite: {
		resolve: {
			alias: {
				querystring: "querystring-es3",
			},
		},
		define: {
			"process.env": {},
		},
	},
	nitro: {
		compressPublicAssets: true,
		routeRules: {
			"/_nuxt/**": {
				headers: {
					"cache-control": `public,max-age=${
						60 * 60 * 24 * 365
					},s-maxage=${60 * 60 * 24 * 365}`,
				},
			},
		},
	},
	image: {
		ipx: {
			maxAge: 60 * 60 * 24 * 365,
		},
	},
	pwa: {
		registerType: "autoUpdate",
		manifest: {
			name: "Fedibase",
			short_name: "Fedibase",
			theme_color: "#f38121",
			background_color: "#181a1b",
			display: "standalone",
			orientation: "portrait",
			scope: "/",
			start_url: "/",
			icons: [
				{
					src: "images/icons/logo.svg",
					sizes: "48x48 72x72 96x96 128x128 256x256 512x512",
					type: "image/svg+xml",
					purpose: "any",
				},
			],
			screenshots: [
				{
					src: "images/screenshots/dark1.webp",
					sizes: "1170x2532",
					type: "image/webp",
					platform: "narrow",
				},
				{
					src: "images/screenshots/dark2.webp",
					sizes: "1170x2532",
					type: "image/webp",
					platform: "narrow",
				},
				{
					src: "images/screenshots/light1.webp",
					sizes: "1170x2532",
					type: "image/webp",
					platform: "narrow",
				},
				{
					src: "images/screenshots/light2.webp",
					sizes: "1170x2532",
					type: "image/webp",
					platform: "narrow",
				},
			],
		},
	},
});
