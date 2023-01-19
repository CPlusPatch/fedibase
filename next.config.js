/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	compress: true,
	images: {
		formats: ["image/avif", "image/webp"],
	},
	webpack: (config) => {
		config.resolve.fallback = {
			net: false,
			tls: false,
			dns: false,
			fs: false,
		};

		return config;
	}
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});


module.exports = withBundleAnalyzer(nextConfig);
