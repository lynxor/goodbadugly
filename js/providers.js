var mongojs = require('mongojs'),
    UserProvider = require("./db/user_provider.js").UserProvider,
    PostProvider = require("./db/post_provider.js").PostProvider,
    SessionProvider = require("./db/session_provider.js").SessionProvider;




module.exports = function (options, callback) {



    var database = mongojs.connect(require("./cloudfoundry-mongo.js").mongourl, ["user", "post", "session"]);

    if (database) {
        var providers = {

            userProvider:new UserProvider(database),
            postProvider: new PostProvider(database),
            sessionProvider: new SessionProvider(database)

        };
        callback(null, database, providers);
    } else {
        callback(new Error("Cannot connect to database"));
    }
};
