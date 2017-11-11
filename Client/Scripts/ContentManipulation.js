var cached_categories = null;
var active_threadid = -1;
var active_threadtitle = null;

function showThreadListView() {
    $("#dynamic-posts").empty();
    $("#thread-list-view").css('display', 'block');
    $("#thread-post-view").css('display', 'none');
}

function showThreadPostView() {
    $("#thread-list-view").css('display', 'none');
    $("#thread-post-view").css('display', 'block');
}

function setActiveThreadID(id) {
    active_threadid = id;
}

function getProfileByToken() {
    var parsed = null;
    var result = $.ajax({
        url: 'http://127.0.0.1:20895/profile',
        type: 'GET',
        headers: {
            'token': localStorage.getItem("token")
        },
    
        complete: function(e, xhr, settings) {
            if(e.status == 200) {
                parsed = JSON.parse(e.getResponseHeader("profile"));
            }
        }
    }).then((result) => {
        return parsed;
    });

    return result;
};

function getCategories() {
    var parsed = null;
    var result = $.ajax({
        url: 'http://127.0.0.1:20895/category',
        type: 'GET',
        headers: {
            'token': localStorage.getItem("token")
        },
    
        complete: function(e, xhr, settings) {
            if(e.status == 200) {
                parsed = JSON.parse(e.getResponseHeader("category"));
                cached_categories = parsed;

                $("#ThreadCategory").empty();
                for(var i = 0; i < cached_categories.length; i++) {
                    $("#ThreadCategory").append($("<option></option>")
                                        .attr('value', cached_categories[i].id)
                                        .text(cached_categories[i].title));
                }
            }
        }
    }).then((result) => {
        return parsed;
    });

    return result;
}

function createCategory() {
    if($("#CategoryName").val().length < 1) {
        alert("The category name needs to be at least 1 char!");
    } else {
        var result = $.ajax({
            url: 'http://127.0.0.1:20895/category',
            type: 'PUT',
            headers: {
                'token': localStorage.getItem("token"),
                'title': $("#CategoryName").val(),
                'color': $("#CategoryColor").val()
            },
            complete: function(e, xhr, settings) {
                if(e.status == 409) {
                    alert('A category with that name already exists!');
                }
            }
        }).then((result) => {
            $("#CategoryTitle").val('');
            CloseCategoryModal();
        });
    }
}

function getRecentThreads() {
    var parsed = null;
    var result = $.ajax({
        url: 'http://127.0.0.1:20895/thread',
        type: 'GET',
        headers: {
            'token': localStorage.getItem("token")
        },
    
        complete: function(e, xhr, settings) {
            if(e.status == 200) {
                parsed = JSON.parse(e.getResponseHeader("thread"));
            }
        }
    }).then((result) => {
        return parsed;
    });

    return result;
}

function getThreadsByCategory(cid) {
    var parsed = null;
    var result = $.ajax({
        url: 'http://127.0.0.1:20895/thread',
        type: 'GET',
        headers: {
            'token': localStorage.getItem("token"),
            'parentid': cid
        },
    
        complete: function(e, xhr, settings) {
            if(e.status == 200) {
                parsed = JSON.parse(e.getResponseHeader("thread"));
            }
        }
    }).then((result) => {
        return parsed;
    });

    return result;
}

function getPostsByThreadID(tid) {
    var parsed = null;
    var result = $.ajax({
        url: 'http://127.0.0.1:20895/post',
        type: 'GET',
        headers: {
            'token': localStorage.getItem("token"),
            'post': JSON.stringify([tid])
        },
    
        complete: function(e, xhr, settings) {
            if(e.status == 200) {
                parsed = JSON.parse(e.getResponseHeader("post"));
            }
        }
    }).then((result) => {
        return parsed;
    });

    return result;
}

function createThreadWithPost() {
    if($("#ThreadName").val().length < 10) {
        alert("The thread name needs to be at least 10 chars!");
    } else if($("#ThreadInitial").val().length < 10) {
        alert("The initial post content needs to be at least 10 chars!");
    } else {
        var result = $.ajax({
            url: 'http://127.0.0.1:20895/thread',
            type: 'PUT',
            headers: {
                'token': localStorage.getItem("token"),
                'thread': JSON.stringify([$("#ThreadName").val(), $("#ThreadCategory").val()])
            }
        }).then((result) => {
            return getRecentThreads();
        }).then((result) => {
            var id = -1;
            var name = $("#ThreadName").val();
            for(var i = 0; i < result.length; i++) {
                if(result[i].title == name) {
                    id = result[i].id;
                    break;
                }
            }

            return $.ajax({
                url: 'http://127.0.0.1:20895/post',
                type: 'PUT',
                headers: {
                    'token': localStorage.getItem("token"),
                    'post': JSON.stringify([$("#ThreadInitial").val(), id])
                }
            });
        }).then((result) => {
            $("#CategoryTitle").val('');
            $("#CategoryInitial").val('');
            $("#thread-modal").css('display', 'none');
        });
    }
}

function getProfileByEmail(email) {
    if(sessionStorage.getItem(email) == null) {
        var parsed = null;
        var result = $.ajax({
            url: 'http://127.0.0.1:20895/profile',
            type: 'GET',
            headers: {
                'token': localStorage.getItem("token"),
                'email': email
            },
        
            complete: function(e, xhr, settings) {
                if(e.status == 200) {
                    parsed = JSON.parse(e.getResponseHeader("profile"));
                    sessionStorage.setItem(email, parsed);
                }
            }
        }).then((result) => {
            return parsed;
        });

        return result;
    } else {
        return new Promise(function(resolve, reject) {
            resolve(sessionStorage.getItem(email).split(','));
        });
    }
}

function getCategoryColor(id) {
    if(cached_categories == null) {
        return "#000";
    }

    for(i = 0; i < cached_categories.length; i++) {
        if(cached_categories[i].id == id) {
            return cached_categories[i].color;
        }
    }

    return "#000";
}

function getCategoryName(id) {
    if(cached_categories == null) {
        return "Unknown";
    }

    for(i = 0; i < cached_categories.length; i++) {
        if(cached_categories[i].id == id) {
            return cached_categories[i].title;
        }
    }

    return "Unknown";
}

function submitPostToThread() {
    if($("#reply-textarea").val().length < 10) {
        alert("Your reply needs to be at least 10 chars!");
    } else {
        var result = $.ajax({
            url: 'http://127.0.0.1:20895/post',
            type: 'PUT',
            headers: {
                'token': localStorage.getItem("token"),
                'post': JSON.stringify([$("#reply-textarea").val(), active_threadid])
            }
        }).then((result) => {
            $("#reply-textarea").val('');
        });
    }
}

function showRecentThreads() {
    $("#dynamic-threads").empty();
    active_threadid = -1;
    active_threadtitle = null;

    getRecentThreads().then((result) => {
        for(var i = 0; i < result.length; i++) {
            var last_reply = new Date(result[i].updated);

            $("#dynamic-threads").append("" + 
                "<div data-threadid='" + result[i].id + "' onclick=\"sendActiveThreadID('" + result[i].id + "'); showPostsByThreadID('" + result[i].title + "'," + result[i].id + "); showThreadPostView();\" class=\"clickable thread-detail-view\">" +
                    "<div class=\"thread-left-view\">" + 
                        "<div class=\"thread-view-title\">" + result[i].title + "</div>" +
                        "<div class=\"thread-view-reply\">" +
                            "Last reply was " + getTimeSince(last_reply) + " ago" +
                        "</div>" +
                    "</div>" +
                    "<div class=\"thread-right-view\">" +
                        "<div class=\"thread-force-right\">" +
                            "<div class=\"thread-pill\" style=\"background-color:" + getCategoryColor(result[i].parent) + ";\">" +
                                getCategoryName(result[i].parent) +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>"
            );
        }
    });
    
}

function showThreadsByCategory(cid) {
    $("#dynamic-threads").empty();
    active_threadid = -1;
    active_threadtitle = null;

    getThreadsByCategory(cid).then((result) => {
        for(var i = 0; i < result.length; i++) {
            var last_reply = new Date(result[i].updated);

            $("#dynamic-threads").append("" + 
                "<div onclick=\"sendActiveThreadID('" + result[i].id + "'); showPostsByThreadID('" + result[i].title + "'," + result[i].id + "); showThreadPostView();\" class=\"clickable thread-detail-view\">" +
                    "<div class=\"thread-left-view\">" + 
                        "<div class=\"thread-view-title\">" + result[i].title + "</div>" +
                        "<div class=\"thread-view-reply\">" +
                            "Last reply was " + getTimeSince(last_reply) + " ago" +
                        "</div>" +
                    "</div>" +
                    "<div class=\"thread-right-view\">" +
                        "<div class=\"thread-force-right\">" +
                            "<div class=\"thread-pill\" style=\"background-color:" + getCategoryColor(cid) + ";\">" +
                                getCategoryName(cid) +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>"
            );
        }
    });
}

function deleteThread() {
    var temp_threadid = active_threadid;
    active_threadid = -1;

    if(confirm('Are you sure you want to delete this thread?') == true) {
        $.ajax({
            url: 'http://127.0.0.1:20895/thread',
            type: 'DELETE',
            headers: {
                'token': localStorage.getItem("token"),
                'thread': JSON.stringify([temp_threadid])
            }
        }).then((result) => {
            showThreadListView();
            sendActiveThreadID(-1);
        });
    } else {
        active_threadid = temp_threadid;
    }
}

var DefaultBgColor, DefaultTitle;

function showDeleteThreadOption() {
    $("#post-title").css('background-color', '#d61414');
    $("#post-title").text('Delete');
    $("#post-title").addClass("clickable");
    $("#post-title").attr('onclick', 'deleteThread();');
}

function hideDeleteThreadOption() {
    $("#post-title").css('background-color', DefaultBgColor);
    $("#post-title").text(DefaultTitle);
    $("#post-title").removeClass("clickable");
    $("#post-title").attr('onclick', '');
}

function deletePost(id, parent) {
    $.ajax({
        url: 'http://127.0.0.1:20895/post',
        type: 'DELETE',
        headers: {
            'token': localStorage.getItem("token"),
            'post': JSON.stringify([id, parent])
        }
    });
}

function showPostsByThreadID(title, tid) {
    var queue = [];
    active_threadid = tid;
    active_threadtitle = title;
    user_role = 'regular';

    DefaultBgColor = '#24292E';
    DefaultTitle = title;

    $("#dynamic-posts").empty();
    getProfileByToken().then((profile) => {
        if(profile[1] == 'admin') {
            user_role = 'admin';
            $("#dynamic-posts").append("<div id=\"post-title\" onmouseout=\"hideDeleteThreadOption();\" onmouseover=\"showDeleteThreadOption();\" class=\"thread-post-title\">" + title + "</div>");
        } else {
            $("#dynamic-posts").append("<div id=\"post-title\" class=\"thread-post-title\">" + title + "</div>");
        }

        return getPostsByThreadID(tid);
    }).then((result) => {
        for(var i = 0; i < result.length; i++) {
            queue.push(result[i].id);
            queue.push(result[i].parent);
            queue.push(getTimeSince(new Date(result[i].created)));
            queue.push(result[i].content);

            getProfileByEmail(result[i].creator).then((profile) => {
                var EventID = getRandomID();
                var PostID = queue.shift();
                var Parent = queue.shift();

                var Implant = "";
                if(user_role == 'admin') {
                    Implant = "<div onmouseout=\'$(\"." + EventID + "\").children().css(\"display\", \"none\");\' onmouseover=\'$(\"." + EventID + "\").children().css(\"display\", \"inline\");\' style='position: absolute; height: 20px; width: 100%;'>" +
                              "<div class='" + EventID + "' align='center'>" +
                              "<div onclick='deletePost(" + PostID + "," + Parent + ");' style='display: none; margin-top: -5px;' class='clickable mini-button'>Delete</div>" + 
                              "</div>" +
                              "</div>";
                }

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
                                queue.shift() + " ago" +
                            "</div>" +
                        "</div>" +
                        "<br>" +
                        "<div class=\"post-content\">" +
                            queue.shift() +
                        "</div>" +
                    "</div>"
                );
            });
        }
    });
}