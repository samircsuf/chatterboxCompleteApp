var http = require('http');
var fs = require('fs');
//var path = require('path');
var extract = require('./extract');
var wss = require('./websockets-server');

var mime = require('mime');

var handleError = function(err, res) {
    res.writeHead(404);
    res.end();
};

var server = http.createServer(function(req, res) {
    console.log('Responding to a request.');
    /*var url = req.url;
    var fileName = 'index.html';

    if (url.length > 1) {
      fileName = url.substring(1);
    }
    console.log(fileName);
    var filePath = path.resolve(__dirname, 'app', fileName);*/
    var filePath = extract(req.url);

    var type = mime.lookup(filePath)
    //var charset = mime.charsets.lookup(type);

    //res.end('<h1>Hello, World !!</h1>');
    fs.readFile(filePath, function(err, data) {
        if (err) {
            handleError(err, res);
            return;
        } else {
            //res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
            res.setHeader('Content-Type', type);
            res.end(data);
        }
    });

});
server.listen(3000);
