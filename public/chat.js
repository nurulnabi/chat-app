$(function(){
  $('#btn').click(function(){
    if($('.username').val() == ''){
      alert("kindly provide your username");
    }else{
      $('.userForm').hide();
      $('.container').show();
      socketIO($('.username').val());
    }
  })
});

function socketIO(username){
    var msg = {};
    $('.saluation').html('Hello '+username+'!');

    

    var chatInfra = io.connect('/chat_infra'),
        chatComm  = io.connect('/chat_comm');

    chatInfra.on('connect',function(){
      chatInfra.emit('register user',username); //register yourself with the server
    });
    chatInfra.on('new user',function(newUser){
      $('#messages').append('<li class="centered"><b>'+newUser+'</b> joined you');
    })

    //communication channel
    chatComm.on('message',function(data){
      if(data.username == username){
        $('#messages').append('<li class="mine">'+data.message);
      }else{
        $('#messages').append('<li><b>'+data.username+'</b>: '+data.message);
      }
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

