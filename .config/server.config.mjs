export default {
	applyCSSLive: true,
	domain: 'local.protosite.rocks',
	exts: [ 'html', 'css', 'js', 'mjs', 'ttf', 'woff', 'woff2' ],
	ports: {
		client: 8080,
		livereload: 35729
	},
	watch: ['.snippets', 'assets', 'core']
}
