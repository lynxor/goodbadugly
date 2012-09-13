var createParamString = function(params){
    var item, result = "?";
    for ( item in params ){
        result += item + "=" + encodeURIComponent(params[item]) + "&";
    }
    return result;
};

exports.createParamString = createParamString;