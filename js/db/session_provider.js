var ObjectID = require('mongodb').ObjectID,
    _ = require("underscore"),
    async = require("async"),
    moment = require("moment");


exports.SessionProvider = function (db) {
    return {
        retrieve:function (id, callback) {
            db.session.findOne({_id: new ObjectID(id)}, callback);
        },
        retrieveAll:function (user, callback) {
            var query = {$in: {users: user.email}};
            if(user.role.name === "admin"){
                query = {};
            }
            db.session.find(query, callback);
        },
        insert:function (session, callback) {
            db.session.insert(session, callback);
        },
        update:function (sessionId, session, callback) {
            db.session.update({_id: new ObjectID(sessionId)}, session, callback);
        },
        remove: function(sessionId, callback){
          db.session.remove({_id: new ObjectID(sessionId)}, callback);
        },
        emptySession: function(){
            return {name: "", types: ["good", "bad", "ugly"], users: [], endDate: moment().eod().toDate()}
        }


    };
};

