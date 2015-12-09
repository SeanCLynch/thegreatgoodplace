var socket = io();

// This is super vulnerable, please fix it.
function newMessage (user, msg) {
    $('.msg-list').append("<li><strong>"+user+"</strong>: "+msg+"</li>");
}

socket.on('roomMsg', function (user, msg) {
    // console.log(user, msg);
    newMessage(user, msg);
});

// First, we must join the appropriate room.
function joinRoom (room) {
    socket.emit('join', room);
}
