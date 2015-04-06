var http = require('http'); // Add the http module.
var server = http.createServer(function(request, response){ // Create the server.
  response.writeHead(200, {"Content-Type" : "application/json"});
  var content = '{"merge":"iar"}';
  response.write(content);
  response.end();
});
server.listen(8080);
