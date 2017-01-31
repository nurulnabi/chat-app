var socket = io();
var msg = {};
      msg.user = myName();
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
