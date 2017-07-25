var http = require('http');
var handleRequest = require('./request-handler');

var port = 3000;
var ip = '127.0.0.1';


//a bit weird but makes sense if handleRequest is the variable name for module.exports
var server = http.createServer(handleRequest.requestHandler);
console.log('Listening on http://' + ip + ':' + port);
server.listen(port, ip);
