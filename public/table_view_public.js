function handleResults(html) {
    console.log("Some new html gottens");
    $("#table_holder").html(html);
}

function retrieveTable() {
    var session = _.last((window.location.pathname).split("/")),
        url = '/post/table-view/' + session;

    function success(data, textStatus, jqXHR) {
        handleResults(data.html);
    }

    $.get(url, {}, success);
}

$(function () {
    doPoll();
});

function doPoll() {
    setTimeout(function () {
        retrieveTable();
        doPoll();
    }, 5000);
}