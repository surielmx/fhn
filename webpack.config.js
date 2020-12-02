const paths = require('./config/paths');
const path = require('path');
const webpack = require('webpack');
const modules = require('./config/modules');
const getClientEnvironment = require('./config/env');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const ManifestPlugin = require('webpack-manifest-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const reactRefreshOverlayEntry = require.resolve('react-dev-utils/refreshOverlayInterop');

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';
const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000');
const shouldUseReactRefresh = env.raw.FAST_REFRESH;
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getStyleLoaders = (cssOptions, preProcessor) => {
	const loaders = [
		isEnvDevelopment && require.resolve('style-loader'),
		isEnvProduction && {
			loader: MiniCssExtractPlugin.loader,
			// css is located in `static/css`, use '../../' to locate index.html folder
			// in production `paths.publicUrlOrPath` can be a relative path
			options: paths.publicUrlOrPath.startsWith('.') ? { publicPath: '../../' } : {},
		},
		{
			loader: require.resolve('css-loader'),
			options: cssOptions,
		},
	].filter(Boolean);
	if (preProcessor) {
		loaders.push(
			{
				loader: require.resolve('resolve-url-loader'),
				options: {
					sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
					root: paths.appSrc,
				},
			},
			{
				loader: require.resolve(preProcessor),
				options: {
					sourceMap: true,
				},
			}
		);
	}
	return loaders;
};

module.exports = {
	plugins: [
		// Adds support for installing with Plug'n'Play, leading to faster installs and adding
		// guards against forgotten dependencies and such.
		PnpWebpackPlugin,
		new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
		new ModuleNotFoundPlugin(paths.appPath),
		new webpack.DefinePlugin(env.stringified),
		new ManifestPlugin({
			fileName: 'asset-manifest.json',
			publicPath: paths.publicUrlOrPath,
			generate: (seed, files, entrypoints) => {
				const manifestFiles = files.reduce((manifest, file) => {
					manifest[file.name] = file.path;
					return manifest;
				}, seed);
				const entrypointFiles = entrypoints.main.filter(
					(fileName) => !fileName.endsWith('.map')
				);

				return {
					files: manifestFiles,
					entrypoints: entrypointFiles,
				};
			},
		}),
	],
	resolve: {
		// This allows you to set a fallback for where webpack should look for modules.
		// We placed these paths second because we want `node_modules` to "win"
		// if there are any conflicts. This matches Node resolution mechanism.
		// https://github.com/facebook/create-react-app/issues/253
		modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
		extensions: ['.js'],
		alias: {
			modules: path.resolve(__dirname, './node_modules'),
			api: path.resolve(__dirname, './src/api/'),
			constants: path.resolve(__dirname, './src/constants/'),
			config: path.resolve(__dirname, './src/config/'),
			components: path.resolve(__dirname, './src/components/'),
			containers: path.resolve(__dirname, './src/containers/'),
			views: path.resolve(__dirname, './src/views/'),
			hooks: path.resolve(__dirname, './src/hooks/'),
			util: path.resolve(__dirname, './src/util/'),
			actions: path.resolve(__dirname, './src/redux/actions/'),
			reducers: path.resolve(__dirname, './src/redux/reducers/'),
			selectors: path.resolve(__dirname, './src/redux/selectors/'),
		},
	},
	resolveLoader: {
		plugins: [
			// Also related to Plug'n'Play, but this time it tells webpack to load its loaders
			// from the current package.
			PnpWebpackPlugin.moduleLoader(module),
		],
	},
	module: {
		strictExportPresence: true,
		rules: [
			{ parser: { requireEnsure: false } },
			{
				oneOf: [
					// "url" loader works like "file" loader except that it embeds assets
					// smaller than specified limit in bytes as data URLs to avoid requests.
					// A missing `test` is equivalent to a match.
					{
						test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
						loader: require.resolve('url-loader'),
						options: {
							limit: imageInlineSizeLimit,
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
					{
						test: /\.(js)$/,
						include: paths.appSrc,
						loader: require.resolve('babel-loader'),
						options: {
							plugins: [
								[
									require.resolve('babel-plugin-named-asset-import'),
									{
										loaderMap: {
											svg: {
												ReactComponent:
													'@svgr/webpack?-svgo,+titleProp,+ref![path]',
											},
										},
									},
								],
								isEnvDevelopment &&
									shouldUseReactRefresh &&
									require.resolve('react-refresh/babel'),
							].filter(Boolean),
							// This is a feature of `babel-loader` for webpack (not Babel itself).
							// It enables caching results in ./node_modules/.cache/babel-loader/
							// directory for faster rebuilds.
							cacheDirectory: true,
							// See #6846 for context on why cacheCompression is disabled
							cacheCompression: false,
							compact: isEnvProduction,
						},
					},
					{
						test: /\.(js)$/,
						exclude: /@babel(?:\/|\\{1,2})runtime/,
						loader: require.resolve('babel-loader'),
						options: {
							babelrc: false,
							configFile: false,
							compact: false,
							cacheDirectory: true,
							// See #6846 for context on why cacheCompression is disabled
							cacheCompression: false,

							// Babel sourcemaps are needed for debugging into node_modules
							// code.  Without the options below, debuggers like VSCode
							// show incorrect code and set breakpoints on the wrong lines.
							sourceMaps: shouldUseSourceMap,
							inputSourceMap: shouldUseSourceMap,
						},
					},
					{
						test: cssRegex,
						exclude: cssModuleRegex,
						use: getStyleLoaders({
							importLoaders: 1,
							sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
						}),
						// Don't consider CSS imports dead code even if the
						// containing package claims to have no side effects.
						// Remove this when webpack adds a warning or an error for this.
						// See https://github.com/webpack/webpack/issues/6571
						sideEffects: true,
					},
					{
						loader: require.resolve('file-loader'),
						// Exclude `js` files to keep "css" loader working as it injects
						// its runtime that would otherwise be processed through "file" loader.
						// Also exclude `html` and `json` extensions so they get processed
						// by webpacks internal loaders.
						exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
						options: {
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
				],
			},
		],
	},
	// Some libraries import Node modules but don't use them in the browser.
	// Tell webpack to provide empty mocks for them so importing them works.
	node: {
		module: 'empty',
		dgram: 'empty',
		dns: 'mock',
		fs: 'empty',
		http2: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty',
	},
	// Turn off performance processing because we utilize
	// our own hints via the FileSizeReporter
	performance: false,
};
