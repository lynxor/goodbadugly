var ObjectID = require('mongodb').ObjectID,
    _ = require("underscore"),
    async = require("async"),
    moment = require("moment");


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
        },
        dislike: function(postId, user, callback){
            db.post.update({_id: new ObjectID(postId), user : {$ne: user.email}}, {$addToSet: {dislikes: user.email} }, callback);
        },
        clearToday: function(callback){
            var from = moment().sod(),
                to = moment().eod();
            db.post.remove({date:{$gte:from.toDate(), $lte:to.toDate()}}, callback);
        }
    };
};

