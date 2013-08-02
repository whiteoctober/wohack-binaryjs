var fs = require('fs');
var http = require('http');

// Serve client side statically
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);

// Start Binary.js server
var BinaryServer = require('binaryjs').BinaryServer;

// link it to express
var bs = BinaryServer({server: server});

// Wait for new user connections
bs.on('connection', function(client){

  console.log("NEW CONECTION, " + JSON.stringify(client.id))

  client.send(client.id);

  // Incoming stream from browsers
  client.on('stream', function(stream, meta){

    console.log("Send file to " + meta.target);

    stream.on('data', function(data){
      console.log("data>", data);
    })

    var other = bs.clients[meta.target];

    if(other){
      stream.pipe(other.createStream(meta));
    }

    // broadcast to all other clients
    // for(var id in bs.clients){
    //   if(bs.clients.hasOwnProperty(id)){
    //     var otherClient = bs.clients[id];
    //     if(otherClient != client){
    //       var send = otherClient.createStream(meta);
    //       stream.pipe(send);
    //     }
    //   }
    // }
  });
});

server.listen(9000);
console.log('HTTP and BinaryJS server started on port 9000');