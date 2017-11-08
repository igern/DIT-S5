var socket = io('http://127.0.0.1');
socket.on('Greeting', function (data) {
  console.log("bla!");
  for(i = 0; i < 10; i++) {
      socket.emit('my other event', { my: 'data' });
  }
});