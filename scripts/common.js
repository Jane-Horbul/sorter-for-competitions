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

        if(params[0].localeCompare("Divisions") == 0){
            parseResult.set(params[0], params[1].split(", "));
        } else if(params[0].localeCompare("Qualifications") == 0){
            parseResult.set(params[0], parseMap(params[1]));
        } else if(params[0].localeCompare("Members") == 0){
            parseResult.set(params[0], parseMapArray(params[1]));
        } else if(params[0].localeCompare("Groups") == 0){
            parseResult.set(params[0], parseMapArray(params[1]));
        } else if(params[0].localeCompare("Name") == 0){
            parseResult.set(params[0], params[1]);
        } else if(params[0].localeCompare("Description") == 0){
            parseResult.set(params[0], params[1]);
        } else if(params[0].localeCompare("Competitions") == 0){
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

export function sendForm(formName, boundary, body) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', formName, true);
    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

    xhr.onreadystatechange = function() {
        if (this.readyState != 4) return false;
        alert( this.responseText );
    }
    xhr.send(body);
    return true;
}


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