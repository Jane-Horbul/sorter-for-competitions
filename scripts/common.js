import {server} from "./communication.js"

export const commonStrings = {
    arrDivider: ", ",
    pairWinner(id)  {return "Winner of pair " + id;}  
}
export function refreshPage(){
    var newLink = document.location.href.split("#")[0];
    document.location.replace(newLink);
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

export function onClick(object, action){
    object.addEventListener("click", action, false);
}

export function getLinkParams(link){
    var paramsMap = new Map();
    var sectors = link.split("/");
    sectors.forEach(sect => {
        var params = sect.split("?");
        params.forEach(param => {
            param.split("&").forEach(pair => {
                var field = pair.split("=");
                if(field.length == 2){
                    paramsMap.set(field[0], field[1]);
                }
            });
        });
    });
    return paramsMap;
}

export function parseMap(str){
    var result = new Map();
    str.split(commonStrings.arrDivider).forEach(field => {
        var params =  field.split(" - ");
        if(params.length > 1){
            result.set(params[0], params[1]);
        } 
    });
    return result;
}

export function parseMapArray(str){
    var result = new Array(0);
    str.split("}, ").forEach(mapStr => {
        var resMap = parseMap(mapStr.substr(1).split("}")[0]);
        if(resMap.size > 0)
            result.push(resMap);   
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
            var array = params[1].split(commonStrings.arrDivider);
            if(array[0].length > 0)
                parseResult.set(params[0], array);
            else
                parseResult.set(params[0], new Array(0));
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

export function removeHiden(){
    document.getElementById("testSec").classList.remove("js-hidden-element");
}

export function addHiden(){
    document.getElementById("testSec").classList.add("js-hidden-element");
}

export function showAllIfAdmin(){
    var clStatus = server.getClientStatus();
    var shadows = document.querySelectorAll(".js-hidden-element");
    if(clStatus == "admin"){
        for (let shadow of shadows) {
            shadow.classList.remove("js-hidden-element");
        }
    }
}

function langLinkForm(lang){
    var indx = window.location.href.indexOf("lang=");
    if(indx < 0){
        indx = window.location.href.indexOf("pp.ua/") + 6;
        var mainLink = window.location.href.substr(0, indx);
        var afterLink =  window.location.href.substr(indx);
        return mainLink + "?lang=" + lang + "/" + afterLink;
    } else{
        indx += "?lang=".length - 1;
        var mainLink = window.location.href.substr(0, indx)
        var afterLink =  window.location.href.substr(indx + 2);
        return mainLink + lang + afterLink;
    }
}

export function languageSwitchingOn(){
    document.getElementById("lang-ua").setAttribute("href", langLinkForm("ua"))
    document.getElementById("lang-ru").setAttribute("href", langLinkForm("ru"))
    document.getElementById("lang-en").setAttribute("href", langLinkForm("en"))
}

export function createPageItem(item, values){
    var template = item.cloneNode(true);

    for (let ph in values) {
        template.innerHTML = template.innerHTML.replaceAll(ph, values[ph]);
    }
    return template.content;
}