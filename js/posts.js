var _ = require("underscore"),
    rs = require("./restrictedserver.js"),
    a = require("./restrictedserver.js").auths,
    async = require("async"),
    moment = require("moment"),
    jade = require("jade"),
    fs = require("fs"),
    table_template = fs.readFileSync(__dirname + "/../views/gba_table.jade");

exports.on = function (providers) {
    var userProvider = providers.userProvider,
        postProvider = providers.postProvider,
        types = ["good", "bad", "ugly", "whatever"],
        listToday = function (req, res) {
            postProvider.retrieve(moment().sod(), moment().eod(), function (err, posts) {

                if (!err && posts && posts.length) {
                    var grouped = _.groupBy(posts, function (post) {
                        return post.type;
                    }),
                    groups = _.map( _(grouped).keys(), function(key){
                        return {name: key, posts: grouped[key]};
                    });

                    respond({groups:groups, types:types});
                }
                else {
                    respond({groups:[], types:types});
                }
            });

            function respond(data) {
                if (!req.xhr) {
                    res.render("posts.jade", data);
                } else {
                    var table = jade.compile(table_template, {})(data);
                    res.json({html: table});
                }
            }
        },
        newPost = function (req, res) {
            var post = req.body.post;
            post.likes = [];
            post.date = new Date();
            post.user = "" + req.user.email;

            postProvider.insert(post, function (err, docs) {
                res.redirect("/posts/today");
            });
        },
        like = function (req, res) {
            postProvider.like(req.params.postId, req.user, function (err, docs) {
                res.redirect("/posts/today");
            });
        };

    return function (router) {
        router.get("/", a.isAuthenticated, listToday);
        router.get("/posts/today", a.isAuthenticated, listToday);
        router.post("/post", a.isAuthenticated, newPost);

        router.get("/post/like/:postId", a.isAuthenticated, like);
    };
};
