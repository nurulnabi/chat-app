//setting up channels to recieve a single type of messages on a dedicated channel
	//for recieving user information and broadcasting that
	io.of('/chat_infra')
		.on('connection',function(socket){
			socket.on('register user',function(data){
				socket.set('username',data.username,function(){
					socket.send(JSON.stringify(data));	//send back to the same user
					socket.broadcast.emit('new user',data);	//notify to all except this user
				})
			});
			socket.on('disconnect',function(data){
				socket.get('username',function(err,username){
					socket.broadcast.emit('user disconnected',username)
				})
			});
			socket.on('close',function(data){
				socket.get('username',function(err,username){
					socket.broadcast.emit('user disconnected',username)
				})
			});
		});

	//for communication with the users
	io.of('/chat_comm')
		.on('connection',function(socket){
				socket.on('message',function(data){
					socket.get('username',function(err,username){
						data.username = username;
						socket.emit('message',data);
					})
				});

				socket.on('disconnect',function(data){
					socket.get('username',function(err,username){
						socket.broadcast.emit('user disconnected',username)
					})
				});

				socket.on('close',function(data){
					socket.get('username',function(err,username){
						socket.broadcast.emit('user disconnected',username)
					})
				});
		})