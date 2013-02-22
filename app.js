var server = require("./js/server.js"),
    restrictedserver = require("./js/restrictedserver");

//require("./setup.js");
server(require("./default-instance.js"), function(s){
    s.listen();
});
