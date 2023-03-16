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
						src: "images/icons/icon-72x72.png",
						sizes: "72x72",
						type: "image/png",
					},
					{
						src: "images/icons/icon-96x96.png",
						sizes: "96x96",
						type: "image/png",
					},
					{
						src: "images/icons/icon-128x128.png",
						sizes: "128x128",
						type: "image/png",
					},
					{
						src: "images/icons/icon-144x144.png",
						sizes: "144x144",
						type: "image/png",
					},
					{
						src: "images/icons/icon-152x152.png",
						sizes: "152x152",
						type: "image/png",
					},
					{
						src: "images/icons/icon-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "images/icons/icon-384x384.png",
						sizes: "384x384",
						type: "image/png",
					},
					{
						src: "images/icons/icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
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
