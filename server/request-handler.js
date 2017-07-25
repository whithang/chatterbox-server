// var messages = require('./classes/messages');
// var messages = [{username: 'kelly', message: 'please pass'}];
// var results = {results: messages};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

//require node's innate fileservice protocols in order to use "request.on/end"
var fs = require('fs');

//cleaned up how messages object with results and rooms
var messages = {results: [], rooms: []};



//all Ajax request comes with a method, as well as a request url, it will receive all
//data and it will sort it through its own ajax parameters **assumption:
// **Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.**
var requestHandler = function(request, response) {
  var headers = defaultCorsHeaders;
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  if (request.method === 'GET' && request.url === '/classes/messages') {
    response.writeHead(200, headers);
    //we stringify our entire object and give it to the request and allow them to filter what information they want
    //from the ajax call to keep or use.
    response.end(JSON.stringify(messages));
  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    response.writeHead(201, headers);
    //accept streams of data since it doesn't come as one piece and you want to maintain order.
    //chunks are essentially pieces of the full data considering the data could be hundreds of objects
    var chunks = '';
    //uponse receiving data, push it to the chunk until the entire data object is recieved.
    request.on('data', (chunk) => {
      //found this resource: https://stackoverflow.com/questions/16542023/chunk-data-logging-in-node-js
      chunks += chunk.toString();
      //use JSON.parse to turn the stringified info into an actual data object and then push it to our results array
      messages.results.push(JSON.parse(chunks));
      //
      response.end(JSON.stringify(messages.results));
    });
  } else if (request.method === 'POST' && request.url === '/classes/room') {
    var chunks = '';
    request.on('data', (chunk) => {
      chunks += chunk.toString();
    }).on('end', () => {
      messages.results.push(JSON.parse(chunks));
      response.writeHead(201);
      response.end(JSON.stringify(messages));
    });
  } else {
    //our chatterbox only accepts gets or posts requests. Never implemented ajax for puts or deletes.
    console.log('Requests need to be "GET" or "POST"');
    response.writeHead(404);
    response.end();
  }
};


//To follow the lecture's method of exporting:
module.exports.requestHandler = requestHandler;

// Request and Response come from node's http module.
//
// They include information about both the incoming request, such as
// headers and URL, and about the outgoing response, such as its status
// and content.
//
// Documentation for both request and response can be found in the HTTP section at
// http://nodejs.org/documentation/api/

// Do some basic logging.
//
// Adding more logging to your server can be an easy way to get passive
// debugging help, but you should always be careful about leaving stray
// console.logs in your code.

// The outgoing status.

// See the note below about CORS headers.

// Tell the client we are sending them plain text.
//
// You will need to change this if you are sending something
// other than plain text, like JSON or HTML.

// .writeHead() writes to the request line and headers of the response,
// which includes the status and all headers.

// Make sure to always call response.end() - Node may not send
// anything back to the client until you do. The string you pass to
// response.end() will be the body of the response - i.e. what shows
// up in the browser.
//
// Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
