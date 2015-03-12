var buttons = require('sdk/ui/button/action');
var notifications = require("sdk/notifications");
var tabs = require("sdk/tabs");
var panels = require("sdk/panel");
var self = require("sdk/self");
var data = self.data;
var ss = require("sdk/simple-storage");

var Timer = require("sdk/timers");

var ProductHunt = require("./ProductHuntClient").ProductHuntClient;


//save default settings ( running for first time)
if (!ss.storage.settings) {
    ss.storage.settings = {
        notifications: true
    };
}


var button = buttons.ActionButton({
    id: "mozilla-link",
    label: "Visit Mozilla",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    badge: "",
    onClick: handleClick
});


var panel = panels.Panel({
    contentURL: "./home.html",
    width: 600,
    height: 350
});



function handleClick() {
    panel.show({
        position: button
    });
}


panel.on("show", function () {
    button.badge = "";
    ProductHunt.resetUnread();
    panel.port.emit("show");
});

panel.port.on("url", function (url) {
    panel.hide();
    tabs.open(url);
});


panel.port.on("enableNotifications", function (value) {
    ss.storage.settings.notifications = value;
});


panel.port.on("panelLoaded", function () {
    panel.port.emit("setSettings", ss.storage.settings);
    panel.port.emit("buildSettings");
});


// check for new posts every 10 minutes
Timer.setInterval(function () {
    ProductHunt.getTodayPosts();
}, 5000);


var todayPostsReceived = function (newPosts) {

};

ProductHunt.onComplete = todayPostsReceived;
ProductHunt.updateBadge = function (c) {
    c === 0 ? button.badge = "" : button.badge = c;
};

ProductHunt.updatePosts = function (postsIds, posts, postsReadIds, postsRead) {
    panel.port.emit("setPosts", postsIds, posts, postsReadIds, postsRead);
};


ProductHunt.sendNotification = function (post, postNumber) {
    if(ss.storage.settings.notifications===false)
        return;
    
    if (postNumber > 1) {
        notifications.notify({
            title: postNumber + " new posts",
            iconURL: "./icon-48.png",
            onClick: function () {
                panel.show({
                    position: button
                });
            }
        });
    } else {
        notifications.notify({
            title: post.name,
            text: post.tagline,
            iconURL: "./icon-48.png",
            onClick: function () {
                panel.show({
                    position: button
                });
            }
        });
    }
};

ProductHunt.getTodayPosts();