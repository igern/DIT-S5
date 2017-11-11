var socket = io('http://127.0.0.1');
socket.on('Heartbeat', function (data) {
  console.log("Heartbeat!");
  //for(i = 0; i < 10; i++) {
  //    socket.emit('my other event', { my: 'data' });
  //}
});

socket.on('NewCategory', function(data) {
  // 0 -> title | 1 -> id | 2 -> color
  var parsed = JSON.parse(data);

  $("#dynamic-categories").append("" + 
    "<div onclick=\"showThreadListView(); showThreadsByCategory(" + parsed[1] + ");\" class=\"clickable category-tab\">" +
    "<div class=\"category-color\" style=\"background-color: " + parsed[2] + ";\"></div>" +
    "<div class=\"category-title\">" + parsed[0] + "</div>" +
    "</div><br>" 
  );

  $("#ThreadCategory").append($("<option></option>")
                      .attr('value', parsed[1])
                      .text(parsed[0]));
});