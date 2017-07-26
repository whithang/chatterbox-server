// var messages = require('./classes/messages');
// var messages = [{username: 'kelly', message: 'please pass'}];
// var results = {results: messages};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

//require node's innate fileservice protocols in order to use "request.on/end"
var fs = require('fs');

//cleaned up how messages object with results and rooms
var messages = {results: 
[ {username: 'kelly', text: 'hello world', roomname: 'lobby', objectId: 0}, 
  {usernamoe: 'will', text: 'what up?', roomname: 'lobby', objectId: 1}, 
  {username: 'bill', text: 'hello world', roomname: 'main', objectId: 2}, 
  {username: 'phil', text: 'hello world', roomname: 'room2', objectId: 3}, ]};


//all Ajax request comes with a method, as well as a request url, it will receive all
//data and it will sort it through its own ajax parameters **assumption:
// **Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.**
var requestHandler = function(request, response) {
  var headers = defaultCorsHeaders;
  var newId = 6;
  //headers['Content-Type'] = 'application/json'; 
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  if (request.method === 'GET' && request.url === '/classes/messages') {
    response.writeHead(200, headers);
    response.end(JSON.stringify(messages));
    
  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    response.writeHead(201, headers);
    var chunks = '';
    // var chunksParse = '';
    var newId = 3;
    request.on('data', (chunk) => {
      // chunksParse += {chunk};
      chunks += chunk.toString();
      //try to parse here
      // var newData = JSON.parse(chunksParse);
      var newMessage = chunks.split('&');
      var finalMessage = newMessage.map( (message) => {
        return message.slice(message.indexOf('=') + 1);
      });
      var convert = {username: finalMessage[0], text: finalMessage[1], roomname: finalMessage[2], objectId: ++newId};
      
      messages.results.push(convert);
      response.end(JSON.stringify(messages.results));
    });
    
  } else if (request.method === 'POST' && request.url === '/classes/room') {
    var chunks = '';
    request.on('data', (chunk) => {
      chunks += chunk.toString('ascii');
    });
    request.on('end', () => {
      messages.results.push(JSON.parse(chunks));
      response.writeHead(201, headers);
      response.end();
    });
    
  } else if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  } else {
    response.writeHead(404, headers);
    response.end();
  }
};


//To follow the lecture's method of exporting:
module.exports.requestHandler = requestHandler;