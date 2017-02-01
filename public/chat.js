$(function(){
  $('#btn').click(function(){
    if($('.username').val() == ''){
      alert("kindly provide your username");
    }else{
      $('.userForm').hide();
      $('.chatRoom').show();
      socketIO($('.username').val());
    }
  })
});

function socketIO(username){
    var socket = io();
    var msg = {};
          msg.user = username;
    $('#messages').append($('<li>').text("Your name is: "+msg.user));

    $('form').submit(function(){
          if($('#m').val() == '')
            return false;
          msg.info = $('#m').val();
          socket.emit('message',msg);
          $('#m').val('');
          return false;
    })

    socket.on('message',function(message){
          var str = message.user == msg.user ? '':message.user+": ";
                str += message.info;
          if(message.user == msg.user)
              $('#messages').append($('<li class="mine">').text(str));
          else
              $('#messages').append($('<li>').text(str));
    })

    function myName()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}