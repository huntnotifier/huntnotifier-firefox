var ProductHuntClient = {
    Posts: {},
    PostsIds: [],
    PostsLatestIds: [],
    PostsOldIds: [],
    PostsUnreadIds: [],
    PostsReadIds: [],
    PostsUnreadFull: {},
    PostsReadFull: {},
    Request: require("sdk/request").Request,
    getTodayPosts: function () {
        var phRequest = this.Request({
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer f18403286877315ce9f5992ba859cd8d02c484d3f579a7f043ae9c35fbaed531",
                "Host": "api.producthunt.com"
            },
            url: "https://api.producthunt.com/v1/posts",
            onComplete: function (response) {

                ProductHuntClient.requestComplete(response);

            }
        }).get();
    },
    requestComplete: function (response) {
        ProductHuntClient.Posts = {};
        ProductHuntClient.PostsIds = [];

        ProductHuntClient.Posts = response.json.posts;

        var posts = response.json.posts;
        for (var i = 0; i < posts.length; i++) {
            ProductHuntClient.PostsIds.push(posts[i].id);
            ProductHuntClient.Posts[posts[i].id] = posts[i];
        }

        ProductHuntClient.PostsLatestIds = ProductHuntClient.difference(ProductHuntClient.PostsIds, ProductHuntClient.PostsOldIds);
        ProductHuntClient.PostsOldIds = ProductHuntClient.concatUnique(ProductHuntClient.PostsOldIds, ProductHuntClient.PostsLatestIds);

        ProductHuntClient.PostsUnreadIds = ProductHuntClient.concatUnique(ProductHuntClient.PostsUnreadIds, ProductHuntClient.PostsLatestIds);
        ProductHuntClient.PostsReadIds = ProductHuntClient.difference(ProductHuntClient.PostsIds, ProductHuntClient.PostsUnreadIds);


        ProductHuntClient.onComplete(ProductHuntClient.PostsLatestIds);



        for (i = 0; i < ProductHuntClient.PostsLatestIds.length; i++) {
            ProductHuntClient.PostsUnreadFull[ProductHuntClient.PostsLatestIds[i]] = ProductHuntClient.Posts[ProductHuntClient.PostsLatestIds[i]];
        }

        for (i = 0; i < ProductHuntClient.PostsReadIds.length; i++) {
            ProductHuntClient.PostsReadFull[ProductHuntClient.PostsReadIds[i]] = ProductHuntClient.Posts[ProductHuntClient.PostsReadIds[i]];
        }

        if (ProductHuntClient.PostsLatestIds.length > 0) {
            var latestPostID = ProductHuntClient.PostsLatestIds[ProductHuntClient.PostsLatestIds.length - 1];
            ProductHuntClient.sendNotification(ProductHuntClient.PostsUnreadFull[latestPostID], ProductHuntClient.PostsLatestIds.length);

            ProductHuntClient.updateBadge(ProductHuntClient.PostsUnreadIds.length);
            ProductHuntClient.updatePosts(ProductHuntClient.PostsUnreadIds, ProductHuntClient.PostsUnreadFull, ProductHuntClient.PostsReadIds, ProductHuntClient.PostsReadFull);

            ProductHuntClient.storeInfo(ProductHuntClient.PostsUnreadIds, ProductHuntClient.PostsUnreadFull, ProductHuntClient.PostsOldIds, ProductHuntClient.PostsReadIds, ProductHuntClient.PostsReadFull);
        }
    },
    difference: function (foo, bar) {
        // calculate the difference between 2 arrays( PostsIds and PostsLatestIds)
        var baz = [];

        for (var i = 0; i < foo.length; i++) {
            var key = foo[i];
            if (-1 === bar.indexOf(key)) {
                baz.push(key);
            }
        }
        return baz;
    },
    concatUnique: function (a, b) {
        var c = a.concat(b.filter(function (item) {
            return a.indexOf(item) < 0;
        }));
        return c;
    },
    resetUnread: function () {
        this.PostsUnreadIds = [];
        this.PostsUnreadFull = {};
        this.PostsReadIds = [];
        this.PostsReadFull = {};
    },
    sendNotification: function () {
    },
    updateBadge: function () {
    },
    updatePosts: function () {
    },
    onComplete: function () {
    },
    storeInfo: function () {
    },
    loadInfo: function (info) {
        if (info) {
            if (info.postsIds)
                ProductHuntClient.PostsUnreadIds = info.postsIds;
            if (info.posts)
                ProductHuntClient.PostsUnreadFull = info.posts;
            if (info.postsOldIds)
                ProductHuntClient.PostsOldIds = info.postsOldIds;
            if (info.postsReadIds)
                ProductHuntClient.PostsReadIds = info.postsReadIds;
            if (info.postsReadFull)
                ProductHuntClient.PostsReadFull = info.postsReadFull;
            
            ProductHuntClient.updatePosts(ProductHuntClient.PostsUnreadIds, ProductHuntClient.PostsUnreadFull, ProductHuntClient.PostsReadIds, ProductHuntClient.PostsReadFull);
        }
    }
};


exports.ProductHuntClient = ProductHuntClient;