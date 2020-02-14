const path = require('path')
const { PurgeCSS } = require("purgecss")
const posthtmlBeautifyConfig = require("./posthtml-beautify.config.cjs")

const root = ''

module.exports = {
	root,
	input: 'input.html',
	output: 'assets',
	skip: [],
	options: {},
	plugins: [
		function inlineAssets(tree) {
			return new Promise(resolve => {
				tree.match({
					tag: 'link',
					attrs: { rel: 'stylesheet' }
				}, node => {
					const source = path.join(process.cwd(), root, node.attrs.href)
					
					new PurgeCSS().purge({
						content: [tree.options.from],
						css: [source],
						rejected: true,
						rejectedCss: true,
						// safelist: [/^u-/],
						variables: true
					}).then(([ result ]) => {
						console.log({
							[`Rejected CSS rules from '${node.attrs.href}'`]: result.rejected
						})

						Object.assign(node, {
							tag: 'style',
							attrs: { type: 'text/css' },
							content: result.css
						})

						resolve(tree)
					})

					return node
				})
			})
		},
		function cleanup(tree) {
			if (process.env.NODE_ENV === 'production') {
				tree.match([{
					attrs: { 'data-env': 'dev' }
				}], node => ({ tag: false }))
			}
		},
		require("htmlnano")({ removeComments: 'all' }),
		require("posthtml-noopener").noopener(),
		require("posthtml-beautify")(posthtmlBeautifyConfig)
	]
}
