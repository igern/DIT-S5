var socket = io('http://127.0.0.1');
socket.on('Heartbeat', function (data) {
  console.log("Heartbeat!");
  //for(i = 0; i < 10; i++) {
  //    socket.emit('my other event', { my: 'data' });
  //}
});

// Handles category creation events.
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

// Handles thread deletion events.
socket.on('DeletedThread', function(data) {
  // 0 -> id
  var parsed = JSON.parse(data);

  var $div = $(".thread-detail-view").filter(function() {
    return $(this).data("threadid") == parsed[0];
  });

  $div.remove();

  if(active_threadid == parsed[0]) {
    alert("The thread you were viewing has been deleted by an admin. \nWe apologize for the inconvenience.");
    active_threadid = -1;
    showThreadListView();
  }
});

// Handles thread creation events.
socket.on('NewThread', function(data) {
  // 0 -> parentid | 1 -> threadid | 2 -> title | 3 -> created
  var parsed = JSON.parse(data);
  var last_reply = new Date(parsed[3]);

  $("#dynamic-threads").prepend("" + 
  "<div data-threadid='" + parsed[1] + "' onclick=\"showPostsByThreadID('" + parsed[2] + "'," + parsed[1] + "); sendActiveThreadID(" + parsed[1] + "); showThreadPostView();\" class=\"clickable thread-detail-view\">" +
      "<div class=\"thread-left-view\">" + 
          "<div class=\"thread-view-title\">" + parsed[2] + "</div>" +
          "<div class=\"thread-view-reply\">" +
              "Last reply was " + getTimeSince(last_reply) + " ago" +
          "</div>" +
      "</div>" +
      "<div class=\"thread-right-view\">" +
          "<div class=\"thread-force-right\">" +
              "<div class=\"thread-pill\" style=\"background-color:" + getCategoryColor(parsed[0]) + ";\">" +
                  getCategoryName(parsed[0]) +
              "</div>" +
          "</div>" +
      "</div>" +
  "</div>");
});

// Handles post deletion events.
socket.on('DeletedPost', function(data) {
  // 0 -> id
  var parsed = JSON.parse(data);

  var $div = $(".post-container").filter(function() {
    return $(this).data("postid") == parsed[0];
  });

  $div.remove();
});

// Handles post creation events.
socket.on('NewPost', function(data) {
  // 0 -> threadid | 1 -> postid | 2 -> content | 3 -> created | 4 -> creator
  var parsed = JSON.parse(data);

  var PostID = parsed[1];
  var EventID = getRandomID();
  var Implant = "";
  var last_reply = new Date(parsed[3]);

  getProfileByToken().then((profile) => {
    if(profile[1] == 'admin') {
      Implant = "<div onmouseout=\'$(\"." + EventID + "\").children().css(\"display\", \"none\");\' onmouseover=\'$(\"." + EventID + "\").children().css(\"display\", \"inline\");\' style='position: absolute; height: 20px; width: 100%;'>" +
                "<div class='" + EventID + "' align='center'>" +
                "<div onclick='deletePost(" + PostID + "," + parsed[0] + ");' style='display: none; margin-top: -5px;' class='clickable mini-button'>Delete</div>" + 
                "</div>" +
                "</div>";
    }

    return getProfileByEmail(parsed[4]);
  }).then((profile) => {
    $("#dynamic-posts").append("" +
      "<div data-postid=\"" + PostID + "\" class=\"post-container\">" +
          "<div class=\"post-details\">" +
              "<div style=\"float:left;\">" +
                  "<b style=\"margin-right: 10px;\">" + 
                      profile[0].capitalize() +
                  "</b>" + 
              "</div>" +
              Implant + 
              "<div style=\"float:right;\">" +
                getTimeSince(last_reply) + " ago" +
              "</div>" +
          "</div>" +
          "<br>" +
          "<div class=\"post-content\">" +
              parsed[2] +
          "</div>" +
      "</div>"
    );
  });
});

// Informs the server which category the user is currently browsing.
function sendActiveCategoryID(id) {
  socket.emit('ActiveCategory', id);
}

// Informs the server which thread the user is currently reading through.
function sendActiveThreadID(id) {
  socket.emit('ActiveThread', id);
}