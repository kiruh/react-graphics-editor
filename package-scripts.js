const config = {
	stophost: "pm2 stop vector;",
	host: "pm2 stop vector -s; pm2 start build/host.js --name vector",
	lint: "eslint src --ext .js,.jsx",
	_watch:
		"webpack --config webpack.watch.config.js --progress --hide-modules --watch",
	watch: "nps host && nps _watch",
	_build:
		"rimraf build/assets && cross-env NODE_ENV=production webpack --progress --hide-modules",
	build: "nps host && nps _build",
	prettify: `prettier --config .prettierrc --write "src/**/*"`,
};

module.exports = {
	scripts: config,
};
