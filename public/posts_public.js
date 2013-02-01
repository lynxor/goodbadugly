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
   // doPoll();

    $(".accordion-body").first().addClass('in');
});

function doPoll(){
    setTimeout(function(){
        retrieveTable();
        doPoll();
    }, 1000);
}