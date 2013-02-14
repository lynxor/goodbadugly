var ObjectID = require('mongodb').ObjectID,
    _ = require("underscore"),
    async = require("async");


exports.PostProvider = function (db) {

    return {
        retrieve:function (from, to, callback) {
            db.post.find({date:{$gte:from.toDate(), $lte:to.toDate()}}, callback);
        },
        insert:function (post, callback) {
            db.post.insert(post, callback);
        },
        like: function(postId, user, callback){
            db.post.update({_id: new ObjectID(postId), user : {$ne: user.email}}, {$addToSet: {likes: user.email} }, callback);
        }
    };
};

