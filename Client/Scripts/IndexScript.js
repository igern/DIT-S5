window.onresize = function(event) {
    document.getElementById('container').style.marginTop = (window.innerHeight / 2) - (400 / 2) + "px";
};

$(window).resize();

function toast(msg) {
    $.snackbar({content: msg, timeout: 5000, style: "toast" });
}

function signIn() {
    var username = $("#username_signin").val();
    var password = $("#password").val();

    var result = $.ajax({
        url: 'http://127.0.0.1:20895/auth',
        type: 'POST',
        headers: {
            'username':username,
            'password':sha3_512(password)
        },

        complete: function(e, xhr, settings) {
            switch(e.status) {
                case 200:
                    toast("Authentication succeeded! Check the console for your token.");
                    localStorage.setItem("token", e.getResponseHeader("token"));
                    window.open('./Forum.html', '_top');
                    break;
    
                case 401:
                    toast("Authentication failed! Username and/or password was wrong.");
                    break;
            }
        }
    });
};

function register() {
    var username = $("#username_register").val();
    var email = $("#email").val();
    var password_one = $("#password_one").val();
    var password_two = $("#password_two").val();

    if(username.length == 0) {
        console.log("Username -> " + username);
        toast("You need to enter a username!");
        return;
    }

    if(email.length == 0) {
        toast("You need to enter en email!");
        return;
    }

    if(password_one.length == 0 || password_two.length == 0) {
        toast("You need to enter a password!");
        return;
    }

    if(password_one != password_two) {
        toast("The passwords that you have entered do not match!");
        return;
    }
    
    var result = $.ajax({
        url: 'http://127.0.0.1:20895/profile',
        type: 'PUT',
        headers: {
            'username':username,
            'email':email,
            'password': sha3_512(password_one)
        },
        statusCode: {
            200: function() {
                toast("Account successfully created!");
            },

            400: function() {
                toast("Email is already in use!");
            },

            409: function() {
                toast("Username is already in use!");
            }
        }
    }).then(function(data, status, xhr) {
        // redirect to forum .. ?
    });
}

function activateSignInTab() {
    $("#registerTab").removeClass('active-tab');
    $("#signInTab").addClass('active-tab');
    $("#pane-two").css("display", "none");
    $("#pane-one").css("display", "block");
}

function activateRegisterTab() {
    $("#signInTab").removeClass('active-tab');
    $("#registerTab").addClass('active-tab');
    $("#pane-one").css("display", "none");
    $("#pane-two").css("display", "block");
}

activateSignInTab();

if(typeof(Storage) !== "undefined") {
    var token = localStorage.getItem("token");

    if(token != null) {
        $.ajax({
            url: 'http://127.0.0.1:20895/auth',
            type: 'GET',
            headers: {
                'token':token
            },
            statusCode: {
                200: function() {
                    window.open('./Forum.html', '_top');
                },
    
                400: function() {
                    localStorage.removeItem("token");
                }
            }
        });
    }
}