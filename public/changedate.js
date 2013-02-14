$(function () {

    $(".from").datepicker({format:"yyyy/mm/dd"});
    $(".to").datepicker({format:"yyyy/mm/dd"});


    $("#getStatement").click(function () {
        var f = $(".from").val(),
            t = $(".to").val();

        var from = moment(f, "YYYY/MM/DD"),
            to = moment(t, "YYYY/MM/DD");

        var noQuery = window.location.href.split("?")[0];
        window.location.href = noQuery + "?from=" + from.format("YYYY/MM/DD") + "&to=" + to.format("YYYY/MM/DD");

    });
});

