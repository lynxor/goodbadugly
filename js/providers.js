var mongojs = require('mongojs'),
    UserProvider = require("./db/user_provider.js").UserProvider,
    PostProvider = require("./db/post_provider.js").PostProvider;




module.exports = function (options, callback) {



    var database = mongojs.connect(require("./cloudfoundry-mongo.js").mongourl, ["user", "post"]);

    if (database) {
        var providers = {

            userProvider:new UserProvider(database),
            postProvider: new PostProvider(database)

        };
        callback(null, database, providers);
    } else {
        callback(new Error("Cannot connect to database"));
    }
};
