module.exports = {
	apps: [
		{
			name: "Fedibase",
			port: "2790",
			exec_mode: "cluster",
			instances: "max",
			script: "./.output/server/index.mjs",
		},
	],
};
