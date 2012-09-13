function handleResults(html){
    console.log("Some new html gottens");
    $("#table_holder").html( html);
}

function retrieveTable(){
    var url = '/posts/today';
    function success(data, textStatus, jqXHR){
        handleResults(data.html);
    }
    $.get(url, {}, success);
}

$(function(){
    doPoll();
});

function doPoll(){
    setTimeout(function(){
        retrieveTable();
        doPoll();
    }, 1000);
}