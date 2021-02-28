import {sendRequest} from "./common.js"
import {isNumber} from "./common.js"
import {isEmptyString} from "./common.js"
import {sendForm} from "./common.js"
import {getLinkParams} from "./common.js"

var pageParams = getLinkParams(location.search);
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
    if(!isMainGroupParamsOk()) return;

    var paramsMap = new Map();
    var isOn = function(checkBoxId) { return document.getElementById(checkBoxId).checked; };

    paramsMap.set("group-name", document.getElementById("new-group-name").value);
    paramsMap.set("group-division", document.getElementById("ng-division").value);
    paramsMap.set("round-number", document.getElementById("round-number").value);
    paramsMap.set("round-duration", document.getElementById("round-duration").value);

    if(isOn("age-checkbox")){
        if(!isAgeOk()) return;
        paramsMap.set("age-min", document.getElementById("age-min").value);
        paramsMap.set("age-max", document.getElementById("age-max").value);
    }
    
    if(isOn("weight-checkbox")){
        if(!isWeightOk()) return;
        paramsMap.set("weight-min", document.getElementById("weight-min").value);
        paramsMap.set("weight-max", document.getElementById("weight-max").value);
    }
    
    if(isOn("qualification-checkbox")){
        if(!isQualificationOk()) return;
        paramsMap.set("qualification-min", qualificationsMap.get(document.getElementById("ng-members-qualification-min").value));
        paramsMap.set("qualification-max", qualificationsMap.get(document.getElementById("ng-members-qualification-max").value));
    }

    if(isOn("gender-checkbox")){
        paramsMap.set("sex", isOn("create-ng-male") ? "male" : "female");
    }
    sendForm("/new-group-form?" + "cid=" + pageParams.get("cid"), paramsMap);
}

var params = sendRequest("/competition-params-get?" + "cid=" + pageParams.get("cid"));
fillDivisions(params.get("Divisions"));
fillQualifications(params.get("Qualifications"));
document.getElementById("send-form-btn").addEventListener("click", sendGroupForm, false);
document.getElementById("priv-page-link").setAttribute("href", document.referrer)