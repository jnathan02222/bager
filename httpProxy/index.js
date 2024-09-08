
var express = require('express');
var http = require('http')

var server = express();

server.use((req, res, next)=>{
    if (req.secure) {
        // Request is already HTTPS
        return next();
    }
    // Redirect to HTTPS
    res.redirect(`https://${req.headers.host}${req.originalUrl}`); //originalUrl preserves query
});

http.createServer(server).listen(80);
