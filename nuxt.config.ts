// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxtjs/tailwindcss", "@nuxtjs/robots", "@nuxt/image-edge"],
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
});
