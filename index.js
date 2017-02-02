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
			// socket.join('default');
			var id = socket.id.slice(socket.id.indexOf('#')+1);	//socket.id contains channel name too
			var commSocket;//get the corresponding chatComm socket for this socket
			socket.on('register user',function(username){
				commSocket = chatComm.sockets['/chat_comm#'+id];
				users[id] = username;
				socket.username = username;
				socket.userId = id;
				commSocket.username = username;
				commSocket.userId = id;

				// socket.broadcast.emit('new user',{id:id,username:username}); //notify to all except this
				console.log('Users Joined: '+JSON.stringify(users))
				chatInfra.emit('users online',users);

			});

			socket.on('join room',function(room){
				socket.currentRoom = room;
				commSocket.currentRoom = room;
				socket.join(room,function(){		//join on this channel
					socket.in(socket.currentRoom).emit('new user',{id:socket.userId,username:socket.username}); //notify all the sockets in this room except this one
					var roomList = {};
					for(var room in chatInfra.adapter.rooms){
						if(room.indexOf('/chat_infra') == -1){
							roomList[room] = chatInfra.adapter.rooms[room].length;		//room/#sockets_connected pairs
						}
						console.log(room,roomList[room])
					}
					chatInfra.emit('room list',roomList)
				});	
				commSocket.join(room);	//join on corresponding channel too
				
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
			// console.log(socket)
			socket.on('message',function(data){
				data.username = users[socket.userId];
				data.currentRoom = socket.currentRoom;
				socket.send(data);
				socket.in(socket.currentRoom).emit('message',data);	//send to all but it is not sending to itself
				console.log(data);
			});
		});