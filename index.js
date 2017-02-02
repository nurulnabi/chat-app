var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000,function(){
	console.log("Server Started Listening on 3000")
});

var users = {};

app.use('/',express.static('public'));


	//setting up channels to recieve a single type of messages on a dedicated channel
	//for recieving user information and broadcasting that
	var chatInfra = io.of('/chat_infra');
		chatInfra.on('connection',function(socket){
			socket.on('register user',function(username){
				var id = 
				users[socket.id.slice(socket.id.indexOf('#'))] = username; //socket.id contains the channel name also
				socket.username = username;
				socket.broadcast.emit('new user',username); //notify to all except this
				chatInfra.emit('online users',users)
			});
			socket.on('disconnect',function(){
				console.log("userDiconnected: ",socket.username);
				socket.broadcast.emit('user disconnected',socket.username)
			});
			socket.on('close',function(){
				console.log("userClosed: ",socket.username);
				socket.broadcast.emit('user disconnected',socket.username)
			});
		});

	//for communication with the users
	var chatComm = io.of('/chat_comm');
		chatComm.on('connection',function(socket){
			socket.on('message',function(data){
				data.username = users[socket.id.slice(socket.id.indexOf('#'))];
				chatComm.emit('message',data);	//send to all 
				console.log(data);
			})
			
			// socket.on('disconnect',function(data){
			// 	console.log("userDiconnected: ",socket.id);
			// 	chatComm.broadcast.emit('user disconnected',socket.username)
			// });

			// socket.on('close',function(data){
			// 	console.log("userClosed: ",socket.id);
			// 	chatComm.broadcast.emit('user disconnected',socket.username)
			// });
		})