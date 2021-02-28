export function isNumber(num){
    if(isNaN(Number(num)) || (num.localeCompare("") == 0)) return false;
    return true;
}

export function isEmptyString(str){
    if((str.localeCompare("") == 0)){
       return true; 
    }

    if((str.localeCompare("\r\n") == 0)){
        return true; 
    }
    return false;
}

export function getLinkParams(link){
    var paramsMap = new Map();
    var sectors = link.split("/");
    sectors.forEach(sect => {
        var params = sect.split("?");
        params.forEach(param => {
            var field = param.split("=");
            if(field.length == 2){
                paramsMap.set(field[0], field[1]);
            }
        });
    });
    return paramsMap;
}

export function parseMap(str){
    var result = new Map();
    str.split(", ").forEach(field => {
        var params =  field.split(" - ");
        if(params.length > 1){
            result.set(params[0], params[1]);
        } 
    });
    return result;
}

export function parseMapArray(str){
    var result = new Array(0);
    str.split("}, ").forEach(map => {
        result.push(parseMap(map.substr(1).split("}")[0]));
    });
    return result;
}

export function parseAnswerParams(answer){
    const parseResult = new Map();
    var options = answer.split("<Option name>");
    options.forEach(option => {
        var params = option.split("<Option value>");
        if(params.length < 2) return;
        
        if(params[1].split("<Type single>").length > 1) {
            params[1] = params[1].split("<Type single>")[1];
            parseResult.set(params[0], params[1]);
        } else if(params[1].split("<Type array>").length > 1) {
            params[1] = params[1].split("<Type array>")[1];
            parseResult.set(params[0], params[1].split(", "));
        } else if(params[1].split("<Type map>").length > 1) {
            params[1] = params[1].split("<Type map>")[1];
            parseResult.set(params[0], parseMap(params[1]));
        } else if(params[1].split("<Type mapArray>").length > 1) {
            params[1] = params[1].split("<Type mapArray>")[1];
            parseResult.set(params[0], parseMapArray(params[1]));
        }
    });
    return parseResult;
}

export function sendRequest(request) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', request, false);
    xhr.send();
    if (xhr.status != 200)   return new Map();
    return parseAnswerParams(xhr.responseText);
}

export function sendForm(formName, paramsMap) {
    var xhr = new XMLHttpRequest();
    var boundary = String(Math.random()).slice(2);
    var body = ['\r\n'];
    paramsMap.forEach(function(value, key) {
        body.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + value + '\r\n');
    });
    body = body.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';

    xhr.open('POST', formName, true);
    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return false;
        alert( this.responseText );
    }
    xhr.send(body);
    return true;
}


