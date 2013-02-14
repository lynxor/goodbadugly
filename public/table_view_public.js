function handleResults(html) {
    console.log("Some new html gottens");
    $("#table_holder").html(html);
}

function retrieveTable() {
    var url = '/posts/table_view/';

    function success(data, textStatus, jqXHR) {
        handleResults(data.html);
    }

    $.get(url, {}, success);
}

$(function () {
    if ( window.location.search === ""){
        doPoll();
    }
});

function doPoll() {
    setTimeout(function () {
        retrieveTable();
        doPoll();
    }, 5000);
}