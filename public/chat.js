$(function checkInput(){
  $('#btn').click(function(){
    if($('.username').val() == ''|| $('.roomName').val()=='' ){
      alert("kindly provide your userName/roomName");
    }else{
      $('.userForm').hide();
      $('.container').show();
      socketIO($('.username').val(),$('.roomName').val());
    }
  })
});

var chatInfra,chatComm;
function socketIO(username,roomname){
    var username,roomname;
    var msg = {};
    var usersOnline = {};
    var roomsOpen = {};
    var allMessages = {};
    $('.saluation').html('Hello '+username+'!'+" Room: "+roomname);

    

    chatInfra = io.connect('/chat_infra');
    chatComm  = io.connect('/chat_comm');

    chatInfra.on('connect',function(){
      chatInfra.emit('register user',username); //register yourself with the server
      chatInfra.emit('join room',roomname);
    });
    chatInfra.on('new user',function(newUser){
      $('#messages').append('<li class="centered"><b>'+newUser.username+'</b> joined');
    });
    chatInfra.on('user disconnected',function(userLoggedOff){
      $('#messages').append('<li class="centered"><b>'+userLoggedOff.username+'</b> left');
      console.log(userLoggedOff.id)
      $('#'+userLoggedOff.id).hide();
      delete usersOnline[userLoggedOff.id];
    });
    chatInfra.on('user closed',function(userLoggedOff){
      $('#messages').append('<li class="centered"><b>'+userLoggedOff.username+'</b> left');
      console.log(userLoggedOff.id)
      $('#'+userLoggedOff.id).hide();
      delete usersOnline[userLoggedOff.id];
    });
    chatInfra.on('users online',function(newUsersObject){
        for(var key in newUsersObject){
          if(!usersOnline[key]){
            usersOnline[key] = newUsersObject[key];
            $('.userPopulation').append('<li class="centered chatWithUser" id="'+key+'">'+newUsersObject[key]);
          }
        }
    });
    chatInfra.on('room list',function(roomList){
      $('.room').hide();
      for(var room in roomList){
        $('.roomPopulation').append('<li class="room chatInRoom" id="'
          +room+'" onclick="chatInfra.emit(\'join room\',this.id)">'+room+': '+roomList[room]+' users');
      }
    })

    //communication channel
    chatComm.on('connect',function(){
      chatComm.on('message',function(data){
        console.log(data);
        if(data.username == username){
          $('#messages').append('<li class="mine">'+data.message);
        }else{
          $('#messages').append('<li><b>'+data.username+'</b>: '+data.message);
        }
      })
    })

    $('form').submit(function(){
          if($('#m').val() == '')
            return false;
          msg.message = $('#m').val();
          chatComm.emit('message',msg);
          $('#m').val('');
          return false;
    })
}        

