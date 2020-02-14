import * as ports from "port-authority"

import childProcess from "child_process"
import express from "express"
import livereload from "livereload"
import path from "path"
import serverConfig from "./.config/server.config.mjs"

const config = {
	domain: 'localhost',
	root: '.',
	watch: '',
	...serverConfig
}
const clientUrl = `http://${config.domain}:${config.ports.client}`

const server = express()
server.use(express.static(config.root))
server.listen(config.ports.client, handlerServerReady)

function handlerPortFound(port) {
	const liveServer = livereload.createServer({ ...config, port })

	// Start watching
	if (Array.isArray(config.watch)) {
		liveServer.watch(config.watch.map(item => path.resolve(process.cwd(), item)))
	} else {
		liveServer.watch(path.resolve(process.cwd(), config.watch))
	}
	
	// Out message
	console.log(green('LiveReload enabled on port ' + port))

	// Run Chrome Browser
	childProcess.exec(`start chrome ${clientUrl}`)
}

function handlerServerReady() {
	console.log(green(`DEV Server started at ${clientUrl}`))
	ports.find(config.ports.livereload).then(handlerPortFound)
}

function green(text) {
	return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m'
}
