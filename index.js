var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000,function(){
	console.log("Server Started Listening on 3000")
});

var users = [];

app.use('/',express.static('public'));

	
	
	io.on('connection',function(socket){
		console.log("a user connected");
		socket.on('message',function(data){
			console.log("message: "+JSON.stringify(data));
			io.emit('message',data); //send data to all client including send of the data
			// socket.broadcast.emit('chat message',data) send data to all except sender
		});
		socket.on('disconnect',function(data){
			console.log("a user disconnected: "+JSON.stringify(data))
			io.clients(function(err,clients){
			})
		});
	})