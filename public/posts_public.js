$(function(){
    var pb$ = $("#postButton"),
        postText$ = $("#post_text");
    pb$.click(function (e) {
        if (pb$.hasClass('disabled')) {
            e.preventDefault();
            return false;
        } else if (validateNewPost()) {
            pb$.addClass("disabled");
            return true;
        } else{
            return false;
        }
    });

    postText$.change(validateNewPost);
});

function validateNewPost() {
    var postValue = $("#post_text").val(),
        err$ = $("#error");
    if (postValue && postValue !== "") {
        err$.hide();
        return true;
    } else {
        err$.show();
        err$.html("<strong>Error: </strong> Please provide a post body");
        return false;
    }
}