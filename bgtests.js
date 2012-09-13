var exec = require("child_process").exec,
    spawn = require("child_process").spawn,
    command = "mocha -R json tests/*-test.js",
    _ = require("underscore");

var child = exec(command, function (error, stdout, stderr) {
    var output, STATUS, ICON, status;

    if (stderr) {
        STATUS="BROKEN";
        ICON="/usr/share/icons/gnome/32x32/actions/gtk-close.png";
        output = "Command run failure: " + error + "\n" + stderr;
    } else {
        try {
            var results = JSON.parse(stdout);
            output = "<b>Failures: " + results.stats.failures + "</b>\n";
            output += "Successes: " + results.stats.passes + "\n";

            if (results.stats.failures > 0) {
                STATUS="FAILURE";
                ICON="/usr/share/icons/gnome/32x32/actions/gtk-close.png";
                output += "\n\n<b>Failure details</b>\n-----------\n";
                output +=  _(results.failures).map(function (f) { return f.fullTitle + "\n"; });

            } else {
                STATUS="Success";
                ICON="/usr/share/icons/gnome/32x32/actions/add.png";
            }
        } catch (e) {
            output = stdout;
            STATUS="BROKEN";
            ICON="/usr/share/icons/gnome/32x32/actions/gtk-close.png";
        }
    }
    spawn("notify-send", [STATUS, output, "-i", ICON, "-t", "10000"]);
    
});