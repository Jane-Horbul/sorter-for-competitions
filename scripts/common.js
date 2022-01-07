export const commonStrings = {
    arrDivider: ", ",
    mapDivider: "-",
    pairWinner(id)  {return "Winner of pair " + id;}  
}

const errors = {
    emptyField(field)     { errorMessage("Empty field '" + field + "'"); },
    badNumber(field)      { errorMessage("Bad number in field '" + field + "'"); },
    badDate(dt)           { errorMessage("Bad date input " + dt); }
    
}
function errorMessage(mess) {
    alert(mess);
}
function dateValidate(date){
    var dt = date.split("/");
    if(dt.length < 3) return false;
    var year    = Number(dt[2]);
    var month   = Number(dt[1]) - 1;
    var day     = Number(dt[0]);
    var d       = new Date(year, month, day);
    return ((d.getFullYear() == year) && (d.getMonth() == month) && (d.getDate() == day)) ? true : false;
}

function datetimeValidate(datetime){
    var parts = datetime.split(" ");
    var date = parts[0].split("/");
    var time = parts.length > 1 ? parts[1].split(":") : undefined;

    if((time == undefined) || (date.length < 3)) return false;
    var year    = Number(date[2]);
    var month   = Number(date[1]) - 1;
    var day     = Number(date[0]);
    var hours   = Number(time[0]);
    var mins    = Number(time[1]);
    var d       = new Date(year, month, day);
    return ((d.getFullYear() == year) 
                && (d.getMonth() == month)
                && (d.getDate() == day)
                && (hours < 24) 
                && (mins < 60))
            ? true : false;
        
}

function datetimesCompare(dt1, dt2){
    var parts1 = dt1.split(" ");
    var date1 = parts1[0].split("/");
    var time1 = parts1.length > 1 ? parts1[1].split(":") : undefined;
    var parts2 = dt2.split(" ");
    var date2 = parts2[0].split("/");
    var time2 = parts2.length > 1 ? parts2[1].split(":") : undefined;

    if((time1 == undefined) || (date1.length < 3)) return -1;
    if((time2 == undefined) || (date2.length < 3)) return 1;
    for(var i = 0; i < 3; i++){
        if(Number(date1[i]) > Number(date2[i])) return 1;
        if(Number(date1[i]) < Number(date2[i])) return -1; 
    }
    for(var i = 0; i < 2; i++){
        if(Number(time1[i]) > Number(time2[i])) return 1;
        if(Number(time1[i]) < Number(time2[i])) return -1; 
    }
    return 0;
}

export const checkers = {   
    getIfDefined(val, defVal)   { return val == undefined ? defVal : val;},
    strEquals(s1, s2)           { return (s1.localeCompare(s2) == 0); },
    isNumber(num)               { return (isNaN(Number(num)) || this.strEquals(num, "")) ? false : true; },
    isEmptyString(str)          { return this.strEquals(str, "") || this.strEquals(str, "\r\n") ? true : false; },
    checkName(field, value)     { if(this.isEmptyString(value)) { errors.emptyField(field); return false; } return true; },
    checkNumber(field, value)   { if(!this.isNumber(value))     { errors.badNumber(field);  return false; } return true; },
    checkDate(date)             { if(!dateValidate(date))       { errors.badDate(date);     return false; } return true;},
    checkDateTime(dateime)      { if(!datetimeValidate(dateime)){ errors.badDate(dateime);  return false; } return true;},
    compareDateTimes(dt1, dt2)  { return datetimesCompare(dt1, dt2);}
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

export function parseBodyParams(body){
    var blocksResult = new Array(0);
    var blocks = body.split("<Option block>");
    blocks.forEach(block => {
        const parseResult = new Map();
        var options = block.split("<Option name>");
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
        if(parseResult.size > 0)
            blocksResult.push(parseResult);
    });
    return blocksResult;
}

export function unhideSubelements(elem){
    var shadows = elem.querySelectorAll(".js-hidden-element");
    for (let shadow of shadows){
        if(shadow.classList.contains("js-hiden-strict"))
            continue;
        shadow.classList.remove("js-hidden-element");
        shadow.disabled = false;
    }
}

export function showShadows(client){
    var shadows = undefined;
    if(client.isRoot())
        shadows = document.querySelectorAll(".js-root-view");
    else if(client.isAdmin())
        shadows = document.querySelectorAll(".js-admin-view");
    else if(client.isTrainer())
        shadows = document.querySelectorAll(".js-trainer-view");
    else if(client.isJudge())
        shadows = document.querySelectorAll(".js-judge-view");
    else
        return;
    for (let shadow of shadows){
        shadow.classList.remove("js-hidden-element");
        shadow.disabled = false;
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

function openTab(tabId, contentId) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    var tablinks = document.getElementsByClassName("tablinks");

    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(contentId).style.display = "block";
    document.getElementById(tabId).classList.add("active");
    window.location.href = window.location.href.split("#tab=")[0] + "#tab=" + tabId;
}

export function prepareTabs() {
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) (function(i){
        var tabId = tablinks[i].id;
        var contentId = "tabcontent" + tabId.split("tab")[1];
        document.getElementById(tabId).onclick = function(){ openTab(tabId, contentId) };
      })(i);
    var tab_parts = window.location.href.split("#tab=");
    var currentTabId = (tab_parts.length > 1) ? tab_parts[1] : tablinks[0].id;
    document.getElementById(currentTabId).click();
}