var server = require("./js/server.js"),
    restrictedserver = require("./js/restrictedserver");

server(require("./default-instance.js"), function(s){
    s.listen();
});
