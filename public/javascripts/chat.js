// Connect to socket chatroom.
var connect = function () {
    // Grab a username
    username = "Guest";
    $('#messages').append($('<li>').text("Hello " + username + "!"));

    // Start the connection.
    var socket = io();

    // Wait to send chat messages...
    $('form').submit(function() {
        var msg = {
            un: username,
            txt: $('#m').val()
        }
        socket.emit('chat message', msg);
        $('#m').val('');
        return false;
    });

    // And receive them
    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').text(msg.un + ": " + msg.txt));
    });

    // Handle admin annoucements
    socket.on('annoucement', function(data) {
        $('#messages').append($('<li>').text("{!} - " + data.txt));
    });
}

connect();
