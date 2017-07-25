// var messages = require('./classes/messages');
var messages = [{username: 'kelly', message: 'please pass'}];
var results = {results: messages};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var actions = {
  'GET': function(request, response) {
    //decide what to get and pull it from our static asset storage
    // var statusCode = 200;
    // var headers = defaultCorsHeaders;
    response.end(JSON.stringify(results));
  },

  'POST': function(request, response) {
    var statusCode = 201;
    var headers = defaultCorsHeaders;
    response.writeHead(statusCode, headers);
    messages.push({username: request.username, message: request.message});
    response.end(console.log('It worked'));
  },

  'PUT': function(request, response) {
    //decide what to put and edit our static asset storage
  },

  'DELETE': function(request, response) {
    //decide what to delete and remove it from our static asset storage
  },

  'OPTIONS': function(request, response) {
    //decide what to do with an options request?
  }
};

var requestHandler = function(request, response) {
  // created an actions object with the allowed methods as the keys (see above)
  
  if (Object.keys(actions).includes(request.method)) {
    console.log('Serving request type ' + request.method + ' for url ' + request.url);
    
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/json'; // application/json type
    //call the function for that matching key on actions object
    // response.writeHead(statusCode, headers);
    actions[request.method](request, response);
    
  } else {
    //respond with error code
    //should response end be called with empty results?
  } 
  
};



module.exports = requestHandler;

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



