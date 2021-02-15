import {sendRequest} from "./common.js"
import {isNumber} from "./common.js"
import {isEmptyString} from "./common.js"
import {sendForm} from "./common.js"

var qualificationsMap = new Map();

function fillDivisions(divisions){
    var divisionsList = document.getElementById("ng-division");
    divisions.forEach(div => {
        if(div == "\r\n") return;
        var opt = document.createElement('option');
        opt.value = div;
        opt.innerHTML = div;
        divisionsList.appendChild(opt);
    });
}

function fillQualifications(qualifications){
    var qualsListMin = document.getElementById("ng-members-qualification-min");
    var qualsListMax = document.getElementById("ng-members-qualification-max");
    qualifications.forEach(function(value, key) {
        var opt = document.createElement('option');
        opt.value = value;
        opt.innerHTML = value;
        qualsListMin.appendChild(opt.cloneNode(true));
        qualsListMax.appendChild(opt);
        qualificationsMap.set(value, key);
    });
}

function isMainGroupParamsOk(){
    if(isEmptyString(document.getElementById("new-group-name").value)){
        alert("Empty group name!");
        return false;
    }
    if(!isNumber(document.getElementById("round-number").value)){
        alert("Bad rounds number!");
        return false;
    }
    if(!isNumber(document.getElementById("round-duration").value)){
        alert("Bad rounds duration!");
        return false;
    }
    return true;
}

function isAgeOk(){
    var ageMin = document.getElementById("age-min").value;
    var ageMax = document.getElementById("age-max").value;
    if(!isNumber(ageMin)){
        alert("Bad minimal age!");
        return false;
    }
    if(!isNumber(ageMax)){
        alert("Bad maximal age!");
        return false;
    }
    if((Number(ageMax) - Number(ageMin)) < 0){
        alert("Maximal age must be greater than minimal!");
        return false;
    }
    return true;
}

function isWeightOk(){
    var weightMin = document.getElementById("weight-min").value;
    var weightMax = document.getElementById("weight-max").value;
    if(!isNumber(weightMin)){
        alert("Bad minimal weight!");
        return false;
    }
    if(!isNumber(weightMax)){
        alert("Bad maximal weight!");
        return false;
    }
    if((Number(weightMax) - Number(weightMin)) < 0){
        alert("Maximal weight must be greater than minimal!");
        return false;
    }
    return true;
}

function isQualificationOk(){
    var qualMin = document.getElementById("ng-members-qualification-min").value;
    var qualMax = document.getElementById("ng-members-qualification-max").value;
    var qualMinVal = qualificationsMap.get(qualMin);
    var qualMaxVal = qualificationsMap.get(qualMax);
    
    if(qualMinVal == undefined || qualMaxVal == undefined){
        alert("Undefined qualifications value!");
        return false;
    }
    if(qualMinVal > qualMaxVal){
        alert("Maximal value must greater than minimal!");
        return false;
    }

    return true;
}

function sendGroupForm() {
    var boundary = String(Math.random()).slice(2);
    var body = ['\r\n'];
    var isOn = function(checkBoxId) { return document.getElementById(checkBoxId).checked; };
    var pushField = function(name, valId) { 
        body.push('Content-Disposition: form-data; name="' + name + '"\r\n\r\n' 
        + document.getElementById(valId).value + '\r\n'); 
    };

    if(!isMainGroupParamsOk()) return;
    pushField("group-name", "new-group-name");
    pushField("group-division", "ng-division");
    pushField("round-number", "round-number");
    pushField("round-duration", "round-duration");

    if(isOn("age-checkbox")){
        if(!isAgeOk()) return;
        pushField("age-min", "age-min");
        pushField("age-max", "age-max");
    }
    
    if(isOn("weight-checkbox")){
        if(!isWeightOk()) return;
        pushField("weight-min", "weight-min");
        pushField("weight-max", "weight-max");
    }
    
    if(isOn("qualification-checkbox")){
        if(!isQualificationOk()) return;
        var qualMin = document.getElementById("ng-members-qualification-min").value;
        var qualMax = document.getElementById("ng-members-qualification-max").value;
        body.push('Content-Disposition: form-data; name="qualification-min"\r\n\r\n' 
        + qualificationsMap.get(qualMin) + '\r\n'); 
        body.push('Content-Disposition: form-data; name="qualification-max"\r\n\r\n' 
        + qualificationsMap.get(qualMax) + '\r\n');
    }

    if(isOn("gender-checkbox") && isOn("create-ng-male")){
        pushField("sex", "create-ng-male");
    } else if(isOn("gender-checkbox")){
        pushField("sex", "create-ng-female");
    }
    body = body.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';

    if(!sendForm("/new-group-form?" + "id=" + location.search.split("/")[0].split("?")[1], boundary, body)){
        return 255;
    }
   return 0;
}

var params = sendRequest("/group-params-get?" + "id=" + location.search.split("/")[0].split("?")[1]);
fillDivisions(params.get("Divisions"));
fillQualifications(params.get("Qualifications"));
document.getElementById("send-form-btn").addEventListener("click", sendGroupForm, false);
document.getElementById("priv-page-link").setAttribute("href", document.referrer)