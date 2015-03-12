var ProductHunt = {
    addPost: function (post) {
        var el = $("<div></div>").addClass("post");
        var titleElement = $("<div></div>").text(post.name).addClass("title");
        var taglineElement = $("<div></div>").text(post.tagline).addClass("tagline");
        el.append(titleElement).append(taglineElement);

        el.on("click", function () {
            addon.port.emit("url", post["discussion_url"]);
        });

        $("#content").append(el);
    },
    addPosts: function (postsIds, posts, postsReadIds, postsRead) {
        $("#content").empty();
        if (postsIds.length > 0)
            $("#content").append($("<div></div>").text("Latest").addClass("group"));
        for (var i = 0; i < postsIds.length; i++) {
            this.addPost(posts[postsIds[i]]);
        }

        if (postsReadIds.length > 0)
            $("#content").append($("<div></div>").text("Today").addClass("group"));
        for (var i = 0; i < postsReadIds.length; i++) {
            this.addPost(postsRead[postsReadIds[i]]);
        }
    }

};

addon.port.on("show", function onShow() {

});

addon.port.on("setPosts", function (postsIds, posts, postsReadIds, postsRead) {
    ProductHunt.addPosts(postsIds, posts, postsReadIds, postsRead);
});

addon.port.on("buildSettings", function (settings) {
    Settings.buildSettings();

});

addon.port.on("setSettings", function (settings) {
    Settings.info = settings;
});


var Settings = {
    info: {},
    NotificationsSwitch: null,
    setSwitchery: function (switchElement, checkedBool) {
        if ((checkedBool && !switchElement.isChecked()) || (!checkedBool && switchElement.isChecked())) {
            switchElement.setPosition(true);
            switchElement.handleOnchange(true);
        }
    },
    buildSettings: function () {
        $("#hamburgerBtn").on("click", function () {
            $("#popup").toggle();
        });



        var elem = document.querySelector('#enableNotificationsSwitch');
        elem.checked=Settings.info.notifications;
        Settings.NotificationsSwitch = new Switchery(elem, {
            size: 'small'
        });

        elem.onchange = function () {
            addon.port.emit("enableNotifications", elem.checked);
        };

    }
};


jQuery(document).ready(function () {
    addon.port.emit("panelLoaded");

//    $("#hamburgerBtn").on("click", function () {
//        $("#popup").toggle();
//    });
//
//
//
//    var elem = document.querySelector('#enableNotificationsSwitch');
//    Settings.NotificationsSwitch = new Switchery(elem, {
//        size: 'small'
//    });
//
//    elem.onchange = function () {
//        addon.port.emit("enableNotifications", elem.checked);
//    };

//    addon.port.emit("enableNotifications", elem.checked);

});
