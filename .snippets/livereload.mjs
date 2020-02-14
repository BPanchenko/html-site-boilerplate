import serverConfig from "../.config/server.config.mjs"

const snippetSrc = 'http://'
	+ (location.host || 'localhost').split(':')[0]
	+ ':' + serverConfig.ports.livereload
	+ '/livereload.js?snipver=1'

const script = document.createElement('script')
script.src = snippetSrc

document.head.appendChild(script)
