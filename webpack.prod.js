'use strict';
const path = require('path');
const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const paths = require('./config/paths.js');
const config = require('./webpack.config');
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const swSrc = paths.swSrc;
const appPackageJson = require(paths.appPackageJson);

module.exports = merge(config, {
	mode: 'production',
	bail: true,
	devtool: 'hidden-source-map',
	entry: paths.appIndexJs,
	output: {
		path: paths.appBuild,
		pathinfo: false,
		filename: 'static/js/[name].[contenthash:8].js',
		chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
		publicPath: paths.publicUrlOrPath,
		devtoolModuleFilenameTemplate: (info) =>
			path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/'),
		jsonpFunction: `webpackJsonp${appPackageJson.name}`,
		globalObject: 'this',
	},
	optimization: {
		minimize: true,
		minimizer: [
			// This is only used in production mode
			new TerserPlugin({
				terserOptions: {
					parse: {
						// We want terser to parse ecma 8 code. However, we don't want it
						// to apply any minification steps that turns valid ecma 5 code
						// into invalid ecma 5 code. This is why the 'compress' and 'output'
						// sections only apply transformations that are ecma 5 safe
						// https://github.com/facebook/create-react-app/pull/4234
						ecma: 8,
					},
					compress: {
						ecma: 5,
						warnings: false,
						// Disabled because of an issue with Uglify breaking seemingly valid code:
						// https://github.com/facebook/create-react-app/issues/2376
						// Pending further investigation:
						// https://github.com/mishoo/UglifyJS2/issues/2011
						comparisons: false,
						// Disabled because of an issue with Terser breaking valid code:
						// https://github.com/facebook/create-react-app/issues/5250
						// Pending further investigation:
						// https://github.com/terser-js/terser/issues/120
						inline: 2,
					},
					mangle: {
						safari10: true,
					},
					// Added for profiling in devtools
					keep_classnames: true,
					keep_fnames: true,
					output: {
						ecma: 5,
						comments: false,
						// Turned on because emoji and regex is not minified properly using default
						// https://github.com/facebook/create-react-app/issues/2488
						ascii_only: true,
					},
				},
			}),
			// This is only used in production mode
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					map: true
						? {
								// `inline: false` forces the sourcemap to be output into a
								// separate file
								inline: false,
								// `annotation: true` appends the sourceMappingURL to the end of
								// the css file, helping the browser find the sourcemap
								annotation: true,
						  }
						: false,
				},
				cssProcessorPluginOptions: {
					preset: ['default', { minifyFontValues: { removeQuotes: false } }],
				},
			}),
		],
		// Automatically split vendor and commons
		// https://twitter.com/wSokra/status/969633336732905474
		// https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
		splitChunks: {
			chunks: 'all',
			name: false,
		},
		// Keep the runtime chunk separated to enable long term caching
		// https://twitter.com/wSokra/status/969679223278505985
		// https://github.com/facebook/create-react-app/issues/5358
		runtimeChunk: {
			name: (entrypoint) => `runtime-${entrypoint.name}`,
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: paths.appHtml,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: 'static/css/[name].[contenthash:8].css',
			chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
		}),
		new WorkboxWebpackPlugin.InjectManifest({
			swSrc,
			dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
			exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
			// Bump up the default maximum size (2mb) that's precached,
			// to make lazy-loading failure scenarios less likely.
			// See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
			maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
		}),
		new BundleAnalyzerPlugin(),
	],
});
