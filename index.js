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
				var id = socket.id.slice(socket.id.indexOf('#')+1);
				users[id] = username; //socket.id contains the channel name also
				socket.username = username;
				socket.userId = id;
				socket.broadcast.emit('new user',{id:id,username:username}); //notify to all except this
				console.log('Users Joined: '+JSON.stringify(users))
				chatInfra.emit('users online',users);
			});
			socket.on('disconnect',function(){
				console.log("userDiconnected: ",{id:socket.userId,username:socket.username});
				delete users[socket.userId];
				socket.broadcast.emit('user disconnected',{id:socket.userId,username:socket.username})
			});
			socket.on('close',function(){
				delete users[socket.userId];
				console.log("userClosed: ",{id:socket.userId,username:socket.username});
				socket.broadcast.emit('user disconnected',{id:socket.userId,username:socket.username})
			});
		});

	//for communication with the users
	var chatComm = io.of('/chat_comm');
		chatComm.on('connection',function(socket){
			socket.on('message',function(data){
				data.username = users[socket.id.slice(socket.id.indexOf('#')+1)];
				chatComm.emit('message',data);	//send to all 
				console.log(data);
			});
		});