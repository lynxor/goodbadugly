var ObjectID = require('mongodb').ObjectID,
    _ = require("underscore"),
    async = require("async"),
    moment = require("moment");


exports.PostProvider = function (db) {

    return {
        retrieve:function (sessionId, callback) {
            db.post.find({sessionId: new ObjectID(sessionId) }, callback);
        },
        insert:function (post, callback) {
            db.post.insert(post, callback);
        },
        like: function(postId, user, callback){
            db.post.update({_id: new ObjectID(postId), user : {$ne: user.email}}, {$addToSet: {likes: user.email} }, callback);
        },
        dislike: function(postId, user, callback){
            db.post.update({_id: new ObjectID(postId), user : {$ne: user.email}}, {$addToSet: {dislikes: user.email} }, callback);
        },
        clearSession: function(sessionId, callback){
            db.post.remove({sessionId: new ObjectID(sessionId) }, callback);
        }
    };
};

