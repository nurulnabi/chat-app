var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000,function(){
	console.log("Server Started Listening on 3000")
});

app.use('/',express.static('public'));

	io.on('connection',function(socket){
		console.log("a user connected");
		socket.on('message',function(data){
			console.log("message: "+data);
			// io.emit('chat message',data) //send data to all client including send of the data
			socket.broadcast.emit('chat message',data)
		});
		socket.on('disconnect',function(){
			console.log("a user disconnected")
		})
	})