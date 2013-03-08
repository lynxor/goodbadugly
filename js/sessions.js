var _ = require("underscore"),
    rs = require("./restrictedserver.js"),
    a = require("./restrictedserver.js").auths,
    async = require("async"),
    moment = require("moment"),
    jade = require("jade"),
    fs = require("fs"),
    table_template = fs.readFileSync(__dirname + "/../views/gba_table.jade");

exports.on = function (db, providers) {

    var userProvider = providers.userProvider,
        postProvider = providers.postProvider,
        sessionProvider = providers.sessionProvider,
        editSession = function (req, res) {
            userProvider.retrieveAll(function (err, users) {
                sessionProvider.retrieve(req.params.sessionId, function (err, session) {
                    session.endDate = (session.endDate? moment(session.endDate) : moment().eod()).format("YYYY/MM/DD");
                    res.render("session_edit.jade", {session:session, users: users});
                });
            });
        },
        newSession = function (req, res) {
            userProvider.retrieveAll(function (err, users) {
                var session = sessionProvider.emptySession();
                session.endDate = moment(session.endDate).format("YYYY/MM/DD");
                res.render("session_new.jade", {session:session,  users: users});
            });
        },
        saveSession = function (req, res) {
            var session = req.body.session;
            session.types = _.map(session.types.split(","), function (t) {
                return t.trim();
            });
            session.endDate = moment(session.endDate, "YYYY/MM/DD").toDate();

            sessionProvider.update(req.params.sessionId, session, function (err, session) {
                req.flash("info", "Session updated");
                res.redirect("/session/list");
            });
        },
        addSession = function (req, res) {
            var session = req.body.session;
            session.types = _.map(session.types.split(","), function (t) {
                return t.trim();
            });
            session.startDate = new Date();
            session.endDate = moment(session.endDate, "YYYY/MM/DD").toDate();

            sessionProvider.insert(session, function (err, docs) {
                res.redirect("/session/list");
            });
        },
        listSessions = function(req, res){
            sessionProvider.retrieveAll(req.user, function(err, sessions){
                res.render("list_sessions.jade", {sessions: sessions});
            });
        },
        remove = function(req, res){
            sessionProvider.remove(req.params.sessionId, function(){
                res.redirect("/session/list");
            });
        };

    return function (router) {
        router.get("/", a.isAuthenticated, listSessions);
        router.get("/session/list", a.isAuthenticated, listSessions);
        router.get("/session/new", a.hasRole("admin"), newSession);
        router.get("/session/edit/:sessionId", a.hasRole("admin"), editSession);
        router.get("/session/remove/:sessionId", a.hasRole("admin"), remove);
        router.post("/session/edit/:sessionId", a.hasRole("admin"), saveSession);
        router.post("/session/new", a.hasRole("admin"), addSession);
    };
};
