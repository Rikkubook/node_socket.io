var socket = io.connect();
socket.on('second', function (second) {
    $('#second').text(second.second);
});