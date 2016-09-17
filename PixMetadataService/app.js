"use strict";
var restify = require('restify'),
    metadataService = require('./lib/metadata_service'),
    config = require('./lib/config');

var server = restify.createServer({
    name: 'flynnpixn',
    version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser());

server.get('/pix/metadata/_id/:id', metadataService.get);
server.del('/pix/metadata/_id/:id', metadataService.del);
server.get('/pix/metadata', metadataService.find);
server.put('/pix/metadata/_id/:id', metadataService.put);
server.post('/pix/metadata', metadataService.post);

server.listen(8080, () => {
    console.log(`ServerName=${server.name},ServerUrl=${server.url}`);
});