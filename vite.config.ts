import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import { VitePWA } from "vite-plugin-pwa";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		ViteImageOptimizer(),
		VitePWA({
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
		}),
	],
	define: {
		"process.env": {},
	},
	resolve: {
		alias: {
			querystring: "querystring-es3",
			react: "preact/compat",
			"react-dom": "preact/compat",
		},
	},
});
