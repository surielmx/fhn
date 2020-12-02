const address = require('address');
const fs = require('fs');
const url = require('url');
const chalk = require('chalk');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const paths = require('./config/paths.js');
const config = require('./webpack.config');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const reactRefreshOverlayEntry = require.resolve('react-dev-utils/refreshOverlayInterop');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const webpackDevClientEntry = require.resolve('react-dev-utils/webpackHotDevClient');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;

function prepareUrls(protocol, host, port, pathname = '/') {
	const formatUrl = (hostname) =>
		url.format({
			protocol,
			hostname,
			port,
			pathname,
		});
	const prettyPrintUrl = (hostname) =>
		url.format({
			protocol,
			hostname,
			port: chalk.bold(port),
			pathname,
		});

	const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
	let prettyHost, lanUrlForConfig, lanUrlForTerminal;
	if (isUnspecifiedHost) {
		prettyHost = 'localhost';
		try {
			// This can only return an IPv4 address
			lanUrlForConfig = address.ip();
			if (lanUrlForConfig) {
				// Check if the address is a private ip
				// https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
				if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(lanUrlForConfig)) {
					// Address is private, format it for later use
					lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
				} else {
					// Address is not private, so we will discard it
					lanUrlForConfig = undefined;
				}
			}
		} catch (_e) {
			// ignored
		}
	} else {
		prettyHost = host;
	}
	const localUrlForTerminal = prettyPrintUrl(prettyHost);
	const localUrlForBrowser = formatUrl(prettyHost);
	return {
		lanUrlForConfig,
		lanUrlForTerminal,
		localUrlForTerminal,
		localUrlForBrowser,
	};
}

const allowedHost = prepareUrls(protocol, host, port, paths.publicUrlOrPath.slice(0, -1));

module.exports = merge(config, {
	entry: [webpackDevClientEntry, paths.appIndexJs],
	output: {
		path: undefined,
		pathinfo: false,
		filename: 'static/js/bundle.js',
		futureEmitAssets: true,
		chunkFilename: 'static/js/[name].chunk.js',
		publicPath: paths.publicUrlOrPath,
		devtoolModuleFilenameTemplate: (info) =>
			path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
		globalObject: 'this',
	},
	mode: 'development',
	bail: false,
	devtool: 'inline-source-map',
	devServer: {
		disableHostCheck: true,
		compress: true,
		clientLogLevel: 'none',
		contentBase: paths.appPublic,
		contentBasePublicPath: paths.publicUrlOrPath,
		hot: true,
		injectClient: false,
		publicPath: paths.publicUrlOrPath.slice(0, -1),
		quiet: true,
		watchOptions: {
			ignored: ignoredFiles(paths.appSrc),
		},
		transportMode: 'ws',
		https: false,
		host,
		port,
		overlay: false,
		historyApiFallback: {
			// Paths with dots should still use the history fallback.
			// See https://github.com/facebook/create-react-app/issues/387.
			disableDotRule: true,
			index: paths.publicUrlOrPath,
		},
		open: true,
		public: allowedHost.localUrlForBrowser,
		openPage: allowedHost.localUrlForBrowser,
		before(app, server) {
			// Keep `evalSourceMapMiddleware` and `errorOverlayMiddleware`
			// middlewares before `redirectServedPath` otherwise will not have any effect
			// This lets us fetch source contents from webpack for the error overlay
			app.use(evalSourceMapMiddleware(server));
			// This lets us open files from the runtime error overlay.
			app.use(errorOverlayMiddleware());

			if (fs.existsSync(paths.proxySetup)) {
				// This registers user provided middleware for proxy reasons
				require(paths.proxySetup)(app);
			}
		},
		after(app) {
			// Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
			app.use(redirectServedPath(paths.publicUrlOrPath));

			// This service worker file is effectively a 'no-op' that will reset any
			// previous service worker registered for the same host:port combination.
			// We do this in development to avoid hitting the production cache if
			// it used the same host and port.
			// https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
			app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: paths.appHtml,
		}),
		new Dotenv({
			path: './.env',
		}),
		new webpack.HotModuleReplacementPlugin(),
		new ReactRefreshWebpackPlugin({
			overlay: {
				entry: webpackDevClientEntry,
				// The expected exports are slightly different from what the overlay exports,
				// so an interop is included here to enable feedback on module-level errors.
				module: reactRefreshOverlayEntry,
				// Since we ship a custom dev client and overlay integration,
				// the bundled socket handling logic can be eliminated.
				sockIntegration: false,
			},
		}),
		new CaseSensitivePathsPlugin(),
		new WatchMissingNodeModulesPlugin(paths.appNodeModules),
	],
});
