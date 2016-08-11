// modules
var nodeStatic = require('node-static'),
port = 8080,
http = require('http');

// config
var file = new nodeStatic.Server("./");

// serve
http.createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  }).resume();
}).listen(port);

console.log('Listening on port ' + port);
