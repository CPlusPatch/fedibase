/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
	dest: "public",
	register: true,
	disable: process.env.NODE_ENV !== "production",
	skipWaiting: true,
});

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	compress: true,
	images: {
		formats: ["image/avif", "image/webp"],
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback.net = false;
			config.resolve.fallback.dns = false;
			config.resolve.fallback.tls = false;
			config.resolve.fallback.zlib = false;
			config.resolve.fallback.bufferutil = false;
			config.resolve.fallback["utf-8-validate"] = false;
		}
		return config;
	},
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

module.exports = nextConfig;
//module.exports = withPWA(withBundleAnalyzer(nextConfig));