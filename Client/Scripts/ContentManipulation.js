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
            }
        }).then((result) => {
            $("#CategoryTitle").val('');
            CloseCategoryModal();
            $("#dynamic-categories").empty();
            getCategories().then((result) => {
                for(i = 0; i < result.length; i++) {
                    $("#dynamic-categories").append("" + 
                        "<div onclick=\"showThreadListView(); showThreadsByCategory(" + result[i].id + ");\" class=\"clickable category-tab\">" +
                        "<div class=\"category-color\" style=\"background-color: " + result[i].color + ";\"></div>" +
                        "<div class=\"category-title\">" + result[i].title + "</div>" +
                        "</div><br>" 
                    );
                }
            });
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
            showRecentThreads();
        });
    }
}

function getProfileByEmail(email) {
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
            }
        }
    }).then((result) => {
        return parsed;
    });

    return result;
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
            showPostsByThreadID(active_threadtitle, active_threadid)
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
                "<div onclick=\"showPostsByThreadID('" + result[i].title + "'," + result[i].id + "); showThreadPostView();\" class=\"clickable thread-detail-view\">" +
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
                "<div onclick=\"showPostsByThreadID('" + result[i].title + "'," + result[i].id + "); showThreadPostView();\" class=\"clickable thread-detail-view\">" +
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
    if(confirm('Are you sure you wanna delete this thread?') == true) {
        $.ajax({
            url: 'http://127.0.0.1:20895/thread',
            type: 'DELETE',
            headers: {
                'token': localStorage.getItem("token"),
                'thread': JSON.stringify([active_threadid])
            }
        }).then((result) => {
            showThreadListView();
            showRecentThreads();
        });
    }
}

var DefaultBgColor, DefaultTitle;

function showDeleteOption() {
    $("#post-title").css('background-color', '#d61414');
    $("#post-title").text('Delete');
    $("#post-title").addClass("clickable");
    $("#post-title").attr('onclick', 'deleteThread();');
}

function hideDeleteOption() {
    $("#post-title").css('background-color', DefaultBgColor);
    $("#post-title").text(DefaultTitle);
    $("#post-title").removeClass("clickable");
    $("#post-title").attr('onclick', '');
}

function showPostsByThreadID(title, tid) {
    var queue = [];
    active_threadid = tid;
    active_threadtitle = title;

    $("#dynamic-posts").empty();
    getPostsByThreadID(tid).then((result) => {
        $("#dynamic-posts").append("<div id=\"post-title\" onmouseout=\"hideDeleteOption();\" onmouseover=\"showDeleteOption();\" class=\"thread-post-title\">" + title + "</div>");
        DefaultBgColor = $("#post-title").css('background-color');
        DefaultTitle = $("#post-title").text();

        for(var i = 0; i < result.length; i++) {
            queue.push(getTimeSince(new Date(result[i].created)));
            queue.push(result[i].content);
            getProfileByEmail(result[i].creator).then((profile) => {

                $("#dynamic-posts").append("" +
                    "<div class=\"post-container\">" +
                        "<div class=\"post-details\">" +
                            "<div style=\"float:left;\">" +
                                "<b style=\"margin-right: 10px;\">" + 
                                    profile[0].capitalize() +
                                "</b>" + 
                            "</div>" +
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