function toast(msg) {
    $.snackbar({content: msg, timeout: 5000, style: "toast" });
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function getTimeSince(date) {
    var time = Math.floor((new Date() - date) / 1000);
    var since = null;   
    if(time < 60) {
        if(time > 1) {
            return time + " seconds";
        } else {
            return time + " second";
        }
    } else if (time >= 60 && time < 3600) {
        since = Math.floor(time / 60);
        if(since > 1) {
            return since + " minutes";
        } else {
            return since + " minute";
        }
    } else if (time >= 3600 && time < 86400) {
        since = Math.floor(time / 3600);
        if(since > 1) {
            return since + " hours";
        } else {
            return since + " hour";
        }
    } else if (time >= 86400 && time < 2592000) {
        since = Math.floor(time / 86400);
        if(since > 1) {
            return since + " days";
        } else {
            return since + " day";
        }
    } else if (time >= 2592000 && time < 31104000) {
        since = Math.floor(time / 2592000);
        if(since > 1) {
            return since + " months";
        } else {
            return since + " month";
        }
    } else if (time >= 31104000) {
        since = Math.floor(time / 31104000);
        if(since > 1) {
            return since + " years";
        } else {
            return since + " year";
        }
    } else {
        return "error";
    }
}