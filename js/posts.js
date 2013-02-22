var _ = require("underscore"),
    rs = require("./restrictedserver.js"),
    a = require("./restrictedserver.js").auths,
    async = require("async"),
    moment = require("moment"),
    jade = require("jade"),
    fs = require("fs"),
    table_template = fs.readFileSync(__dirname + "/../views/gba_table.jade");

exports.on = function (providers) {

    function getTimesFromReq (req) {
        var from,
            to;
        if (req.query.from) {
            from = moment(req.query.from);
        } else {
            from = moment().sod();
        }
        if (req.query.to) {
            to = moment(req.query.to);
        } else {
            to = moment(from).eod();
        }
        from = from.sod();
        to = to.eod();
        return {
            from:from,
            to:to
        };
    }

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
                        var posts = _.sortBy(grouped[key], 'date' );
                        return {name: key, posts: posts};
                    });

                    res.render("posts.jade", {groups:_.sortBy(groups, "name"), types:types});
                }
                else {
                    res.render("posts.jade", {groups:[], types:types});
                }
            });


        },
        tableView = function (req, res) {

            var dates = getTimesFromReq(req),
                from = dates.from,
                to = dates.to;

            postProvider.retrieve(from, to, function (err, posts) {

                if (!err && posts && posts.length) {
                    var grouped = _.groupBy(posts, function (post) {
                        return post.type;
                    });
                    _.each( _(grouped).keys(), function(key){
                        grouped[key] = _.sortBy(grouped[key], 'date' );
                    });

                    respond({rows:grouped, types:types});
                }
                else {
                    respond({rows:[], types:types});
                }
            });

            function respond(data) {
                data.from = moment(from).format("YYYY/MM/DD");
                data.to = moment(to).format("YYYY/MM/DD");

                if (!req.xhr) {
                    res.render("table_view.jade", data);
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
        router.get("/posts/table_view", a.isAuthenticated, tableView);
        router.post("/post", a.isAuthenticated, newPost);

        router.get("/post/like/:postId", a.isAuthenticated, like);
    };
};
