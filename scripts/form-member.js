import {sendRequest} from "./common.js"
import {isNumber} from "./common.js"
import {isEmptyString} from "./common.js"
import {sendForm} from "./common.js"
import {getLinkParams} from "./common.js"

var pageParams = getLinkParams(location.search);
var qualificationsMap = new Map();
var divisionsArray = new Array(0);

function fillDivisions(divisions){
    var divisionsList = document.getElementById("members-divisions");
    var template = document.getElementById("division-template").content.cloneNode(true);
    var divName = template.getElementById("div-name");
    var divInput = template.getElementById("div-input");

    divisions.forEach(div => {
        if(isEmptyString(div)) return;
        divName.innerHTML = div;
        divInput.setAttribute("id", div);
        divisionsList.appendChild(template.cloneNode(true));
        divisionsArray.push(div);
    });
}

function fillQualifications(qualifications){
    var qualsList = document.getElementById("member-qualification");
    qualifications.forEach(function(value, key) {
        var opt = document.createElement('option');
        opt.value = value;
        opt.innerHTML = value;
        qualsList.appendChild(opt);
        qualificationsMap.set(value, key);
    });
}

function isMemberParamsOk() {
    var name = document.getElementById("user-name").value;
    var surname = document.getElementById("user-surname").value;
    var weight = document.getElementById("user-weight").value;
    var age = document.getElementById("user-age").value;

    if(isEmptyString(name)){
        alert("Empty member name!");
        return false;
    }
    if(isEmptyString(surname)){
        alert("Empty member surname!");
        return false;
    }
    if(!isNumber(weight)){
        alert("Bad weight value. Enter number only.");
        return false;
    }
    if(!isNumber(age)){
        alert("Bad age value. Enter number only.");
        return false;
    }
    return true;
}

function sendMemberForm() {
    if(!isMemberParamsOk()) return;

    var paramsMap = new Map();
    var isOn = function(checkBoxId) { return document.getElementById(checkBoxId).checked; };
    var qualification = document.getElementById("member-qualification").value;
    var divisions = "";
    divisionsArray.forEach(div => {
        if(document.getElementById(div).checked){
            divisions += div + ", "
        }
    });

    paramsMap.set("member-name", document.getElementById("user-name").value);
    paramsMap.set("member-surname", document.getElementById("user-surname").value);
    paramsMap.set("member-weight", document.getElementById("user-weight").value);
    paramsMap.set("member-age", document.getElementById("user-age").value);
    paramsMap.set("member-team", document.getElementById("user-team-name").value);
    paramsMap.set("member-qual", qualificationsMap.get(qualification));
    paramsMap.set("member-divisions", divisions);
    paramsMap.set("member-sex", isOn("user-sex-male") ? "male" : "female");
    paramsMap.set("admission", isOn("user-admission-y") ? "yes" : "no");

    sendForm("/new-member-form?" + "cid=" + pageParams.get("cid"), paramsMap);
}

var params = sendRequest("/competition-params-get?" + "cid=" + pageParams.get("cid"));
fillDivisions(params.get("Divisions"));
fillQualifications(params.get("Qualifications"));
document.getElementById("send-form-btn").addEventListener("click", sendMemberForm, false);
document.getElementById("priv-page-link").setAttribute("href", document.referrer)