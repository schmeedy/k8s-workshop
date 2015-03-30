var url = require('url');
var http = require('http')
var connect = require('connect');
var serveStatic = require('serve-static');
var proxy = require('proxy-middleware');

var SERVER_PORT = 80;
var PROXY_REQUEST_PATH = '/api';
var RESOURCE_DIR = '/data/app';

var backendUrl = process.env.BACKEND_URL;
if (!backendUrl) {
    throw new Error('No backend API to proxy defined. Please set the BACKEND_URL environment variable pointing to the API endpoint which should be proxied.')
}

var app = connect();

console.log('Proxying "' + backendUrl + '" under the "' + PROXY_REQUEST_PATH + '" request path');
app.use(PROXY_REQUEST_PATH, proxy(url.parse(backendUrl)));

console.log('Serving resources from the "' + RESOURCE_DIR + '" directory');
app.use('/', serveStatic(RESOURCE_DIR, { 'index': ['index.html'] }));

console.log('Listening on port ' + SERVER_PORT);
http.createServer(app).listen(SERVER_PORT);