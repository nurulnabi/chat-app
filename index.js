var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000,function(){
	console.log("Server Started Listening on 3000")
});

var users = [];

app.use('/',express.static('public'));


	//setting up channels to recieve a single type of messages on a dedicated channel
	//for recieving user information and broadcasting that
	io.of('/chat_infra')
		.on('connection',function(socket){
			socket.on('register user',function(username){
				var user = {};
				user.id = socket.id;
				user.name = username;
				users.push(user);
				socket.username = username;
				socket.broadcast.emit('new user',username); //notify to all except this
			});
			socket.on('disconnect',function(){
				socket.broadcast.emit('user disconnected',socket.username)
			});
			socket.on('close',function(){
				socket.broadcast.emit('user disconnected',socket.username)
			});
		});

	//for communication with the users
	io.of('/chat_comm')
		.on('connection',function(socket){
				socket.on('message',function(data){
					console.log(JSON.stringify(data)+"->"+socket.username);
					data.username = socket.username;
					socket.emit('message',data);
					console.log(JSON.stringify(data));
				});

				socket.on('disconnect',function(data){
					socket.broadcast.emit('user disconnected',socket.username)
				});

				socket.on('close',function(data){
					socket.broadcast.emit('user disconnected',socket.username)
				});
		})