#!/usr/bin/env node

var http = require('http');
var pkg = require('./package.json');
var Throttle = require('./Throttle');
var bytes = require('bytes');
var program = require('commander');

//---------------------------------
var SERVER_HOSTNAME;
var SERVER_PORT;
var PROXY_PORT = 9000;
var SPEED = 1024 * 100;

program
	.version(pkg.version)
	.option('-p, --port [port]', 'Run the proxy server on the specified port. [' + PROXY_PORT + ']', PROXY_PORT)
	.option('-s, --speed [speed]', 'Throttle to the specified kB/s. [' + bytes(SPEED) + ']', SPEED)
	.arguments('<target>')
	.action(function (target) {
		SERVER_HOSTNAME = target.split(':')[0];
		SERVER_PORT = target.split(':')[1];
	});

program.on('--help', function () {
	console.log('  Examples:');
	console.log('');
	console.log('    $ throxy --help');
	console.log('    $ throxy localhost:8080				# Proxies localhost:8080 behind default port ' + PROXY_PORT);
	console.log('    $ throxy localhost:8080 --speed 10	# Default port and override speed to 10kB/s');
	console.log('    $ throxy localhost:8080 --port 7000	# Override proxy server port');
	console.log('');
});

program.parse(process.argv);

if(!SERVER_HOSTNAME || !SERVER_PORT) program.help();

PROXY_PORT = program.port;
SPEED = program.speed * 1024;

console.log('Proxying %s:%s with proxy port %s throttling to %s/s', SERVER_HOSTNAME, SERVER_PORT, PROXY_PORT, bytes(SPEED));

var server = http.createServer(function (req, res) {

	var options = {
		hostname: SERVER_HOSTNAME,
		port: SERVER_PORT,
		path: req.url,
		method: req.method
	};

	var throttle = new Throttle(SPEED);

	var proxy = http.request(options, function (response) {
		response.pipe(throttle).pipe(res);
	});

	// sending to the server, we dont really need to delay this
	req.pipe(proxy);

});

server.listen(PROXY_PORT);