var _ = require("underscore"),
    rs = require("./restrictedserver.js"),
    a = require("./restrictedserver.js").auths,
    async = require("async"),
    moment = require("moment"),
    jade = require("jade"),
    fs = require("fs"),
    ObjectID = require('mongodb').ObjectID,
    table_template = fs.readFileSync(__dirname + "/../views/gba_table.jade");

exports.on = function (providers) {

    function getTimesFromReq(req) {
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
        sessionProvider = providers.sessionProvider,
        listSession = function (req, res) {
            sessionProvider.retrieve(req.params.sessionId, function (err, session) {
                var types = session.types;
                postProvider.retrieve(req.params.sessionId, function (err, posts) {

                    if (!err && posts && posts.length) {
                        var grouped = _.groupBy(posts, function (post) {
                                return post.type;
                            }),
                            groups = _.map(_(grouped).keys(), function (key) {
                                var posts = _.sortBy(grouped[key], 'date');
                                return {name:key, posts:posts};
                            });

                        res.render("posts.jade", {groups:_.sortBy(groups, "name"), types:types, session: session});
                    }
                    else {
                        res.render("posts.jade", {groups:[], types:types, session: session});
                    }
                });
            });


        },
        nostyle = function (req, res) {
            res.render("nostyle.jade", {types:types});
        },
        tableView = function (req, res) {
            sessionProvider.retrieve(req.params.sessionId, function (err, session) {
                var types = session.types;
                postProvider.retrieve(req.params.sessionId, function (err, posts) {

                    if (!err && posts && posts.length) {
                        var grouped = _.groupBy(posts, function (post) {
                            return post.type;
                        });
                        _.each(types, function (key) {
                            grouped[key] = _.sortBy(grouped[key], 'date');
                        });

                        respond({rows:grouped, types:types, session: session});
                    }
                    else {
                        respond({rows:[], types:types, session: session});
                    }
                });
            });

            function respond(data) {
                if (!req.xhr) {
                    res.render("table_view.jade", data);
                } else {
                    var table = jade.compile(table_template, {})(data);
                    res.json({html:table});
                }
            }
        },
        newPostF = function (redirectUrl) {
            return function (req, res) {
                var post = req.body.post;
                post.likes = [];
                post.date = new Date();
                post.user = "" + req.user.email;
                post.sessionId = new ObjectID(req.params.sessionId);

                postProvider.insert(post, function (err, docs) {
                    res.redirect(redirectUrl + "/" + req.params.sessionId);
                });
            };
        },
        like = function (req, res) {
            postProvider.like(req.params.postId, req.user, function (err, docs) {
                res.redirect("/post/"+req.params.sessionId);
            });
        },
        dislike = function (req, res) {
            postProvider.dislike(req.params.postId, req.user, function (err, docs) {
                res.redirect("/post/" + req.params.sessionId);
            });
        },
        clearSession = function (req, res) {
            postProvider.clearSession(req.params.sessionId, function () {
                res.redirect("/post/" + req.params.sessionId);
            });
        };

    return function (router) {

        router.get("/post/:sessionId", a.isAuthenticated, listSession);
        router.get("/nostyle/:sessionId", a.isAuthenticated, nostyle);
        router.get("/post/table-view/:sessionId", a.isAuthenticated, tableView);
        router.post("/post/:sessionId", a.isAuthenticated, newPostF('/post'));
        router.post("/post/nostyle/:sessionId", a.isAuthenticated, newPostF('/nostyle'));

        router.get("/post/like/:postId/:sessionId", a.isAuthenticated, like);
        router.get("/post/dislike/:postId/:sessionId", a.isAuthenticated, dislike);

        //admin functions
        router.get("/post/clear-session/:sessionId", a.hasRole("admin"), clearSession);
    };
};
