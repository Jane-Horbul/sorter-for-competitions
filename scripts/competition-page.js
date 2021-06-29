
import {sendRequest} from "./common.js"
import {isNumber} from "./common.js"
import {isEmptyString} from "./common.js"
import {getLinkParams} from "./common.js"
import {sendForm} from "./common.js"
import {showAllIfAdmin} from "./common.js"
import {languageSwitchingOn} from "./common.js"

var pageParams = getLinkParams(location.search);
var qualificationsMap = new Map();

var memberForm = new Map();
memberForm.set( "name",           document.getElementById("new-member-name"));
memberForm.set( "surname",        document.getElementById("new-member-surname"));
memberForm.set( "age",            document.getElementById("new-member-age"));
memberForm.set( "weight",         document.getElementById("new-member-weight"));
memberForm.set( "is_male",        document.getElementById("new-member-sex-male"));
memberForm.set( "team",           document.getElementById("new-member-team"));
memberForm.set( "qualification",  document.getElementById("create-member-qualifications"));
memberForm.set( "divisionPrefix", "member-create-");
memberForm.set( "permit",         document.getElementById("new-member-permit-yes"));

var groupForm = new Map();
groupForm.set( "name",           document.getElementById("new-group-name"));
groupForm.set( "division",       document.getElementById("create-group-division"));
groupForm.set( "sexIsOn",        document.getElementById("gender-checkbox"));
groupForm.set( "sexIsMale",      document.getElementById("create-ng-male"));
groupForm.set( "ageIsOn",        document.getElementById("age-checkbox"));
groupForm.set( "ageMin",         document.getElementById("age-min"));
groupForm.set( "ageMax",         document.getElementById("age-max"));
groupForm.set( "weightIsOn",     document.getElementById("weight-checkbox"));
groupForm.set( "weightMin",      document.getElementById("weight-min"));
groupForm.set( "weightMax",      document.getElementById("weight-max"));
groupForm.set( "qualIsOn",       document.getElementById("qualification-checkbox"));
groupForm.set( "qualMin",        document.getElementById("ng-members-qualification-min"));
groupForm.set( "qualMax",        document.getElementById("ng-members-qualification-max"));
groupForm.set( "formSystem",     document.getElementById("pairs-form-system"));

function getQualificationInterval(qMin, qMax){
    var qMinName;
    var qMaxName;
    console.log("qMin -> " + qMin);
    console.log("qMax -> " + qMax);
    for (var [key, value] of qualificationsMap) {
        console.log(key + " -> " + value);
    }

    if(!isNumber(qMin) || (Number(qMin) < 0) || (qualificationsMap.get(qMin) == undefined)){
        qMinName = "";
    } else {
        qMinName = qualificationsMap.get(qMin);
    }
    if(!isNumber(qMax) || (Number(qMax) < 0) || (qualificationsMap.get(qMax) == undefined)){
        qMaxName = "";
    } else {
        qMaxName = qualificationsMap.get(qMax);
    }
    if(Number(qMax) == Number(qMin)) return qMinName;
    return qMinName + " - " + qMaxName;
}

/* ------------------- MEMBERS ----------------------------*/

function memberElementCreate(member){
    if(member.get("id") == undefined) return "";
    var template = document.getElementById("member-template").content.cloneNode(true);
    template.getElementById("member-name").innerHTML = member.get("name") + " " + member.get("surname"); 
    template.getElementById("member-age").innerHTML = member.get("age");
    template.getElementById("member-weight").innerHTML = member.get("weight");
    template.getElementById("member-sex").innerHTML = member.get("sex");
    template.getElementById("member-team").innerHTML = member.get("team");
    template.getElementById("member-qualification").innerHTML = qualificationsMap.get(member.get("qualification"));
    template.getElementById("member-admited").innerHTML = member.get("admited");
    template.getElementById("member-groups-num").innerHTML = member.get("groups_num");

    template.getElementById("member-row").setAttribute("onclick", "window.location.href='"
                                    + window.location.href + "/member?mid=" + member.get("id") + "'; return false");
    return template;
}

function resortMembers(){
    var newParams = sendRequest("/competition-members-sort?" + "cid=" + pageParams.get("cid"));
    var membersTable = document.getElementById("members-table");
    
    while(membersTable.rows.length > 2){
        membersTable.deleteRow(membersTable.rows.length - 1);
    }
    newParams.get("Members").forEach(mem => membersTable.append(memberElementCreate(mem)));
}

function isMemberParamsOk() {
    var name = memberForm.get("name").value;
    var surname = memberForm.get("surname").value;
    var weight = memberForm.get("weight").value;
    var age = memberForm.get("age").value;

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
    var divisions = "";
    var qualification = memberForm.get("qualification").value;

    divisionsArray.forEach(div => {
        if(document.getElementById(memberForm.get("divisionPrefix") + div).checked){
            divisions += div + ", "
        }
    });
    
    paramsMap.set("member-name",    memberForm.get("name").value);
    paramsMap.set("member-surname", memberForm.get("surname").value);
    paramsMap.set("member-weight",  memberForm.get("weight").value);
    paramsMap.set("member-age",     memberForm.get("age").value);
    paramsMap.set("member-team",    memberForm.get("team").value);
    paramsMap.set("member-sex",     memberForm.get("is_male").checked ? "male" : "female");
    paramsMap.set("admission",      memberForm.get("permit").checked ? "yes" : "no");
    paramsMap.set("member-qual",    qualification);
    paramsMap.set("member-divisions", divisions);

    paramsMap.forEach(function(value, key) {
        console.log(`${key} => ${value}`);
      });

    sendForm("/new-member-form?" + "cid=" + pageParams.get("cid"), paramsMap, true);
}
/* ------------------- GROUPS ----------------------------*/

function groupElementCreate(group){
    if(group.get("id") == undefined) return "";
    var template = document.getElementById("group-template").content.cloneNode(true);
    template.getElementById("group-name").innerHTML = group.get("name"); 
    template.getElementById("group-age").innerHTML = group.get("age_min") + " - " + group.get("age_max");
    template.getElementById("group-weight").innerHTML = group.get("weight_min") + " - " + group.get("weight_max");
    template.getElementById("group-sex").innerHTML = group.get("sex");
    template.getElementById("group-division").innerHTML = group.get("division"); 
    template.getElementById("group-qualification").innerHTML = getQualificationInterval(group.get("qualification_min"), group.get("qualification_max"));
    template.getElementById("group-members-num").innerHTML = group.get("members_num"); 
    template.getElementById("group-row").setAttribute("onclick", "window.location.href='"
                                    + window.location.href + "/group?gid=" + group.get("id") + "'; return false"); 
    return template;
}

function isMainGroupParamsOk(){
    if(isEmptyString(groupForm.get("name").value)){
        alert("Empty group name!");
        return false;
    }
    return true;
}

function isAgeOk(){
    var ageMin = groupForm.get("ageMin").value;
    var ageMax = groupForm.get("ageMax").value;
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
    var weightMin = groupForm.get("weightMin").value;
    var weightMax = groupForm.get("weightMax").value;
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
    var qualMinVal = groupForm.get("qualMin").value;
    var qualMaxVal = groupForm.get("qualMax").value;
    
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
    
    paramsMap.set("group-name",     groupForm.get("name").value);
    paramsMap.set("group-division", groupForm.get("division").value);
    paramsMap.set("form-system",    groupForm.get("formSystem").value);
    
    if(groupForm.get("ageIsOn").checked){
        if(!isAgeOk()) return;
        paramsMap.set("age-min", groupForm.get("ageMin").value);
        paramsMap.set("age-max", groupForm.get("ageMax").value);
    }
    
    if(groupForm.get("weightIsOn").checked){
        if(!isWeightOk()) return;
        paramsMap.set("weight-min", groupForm.get("weightMin").value);
        paramsMap.set("weight-max", groupForm.get("weightMax").value);
    }
    
    if(groupForm.get("qualIsOn").checked){
        if(!isQualificationOk()) return;
        paramsMap.set("qualification-min", groupForm.get("qualMin").value);
        paramsMap.set("qualification-max", groupForm.get("qualMax").value);
    }

    if(groupForm.get("sexIsOn").checked){
        paramsMap.set("sex", groupForm.get("sexIsMale").checked ? "male" : "female");
    }
    sendForm("/new-group-form?" + "cid=" + pageParams.get("cid"), paramsMap, true);
}
/* ------------------- COMMON ----------------------------*/

function fillPageInfo(params){
    var membersTable = document.getElementById("members-table");
    var groupsTable = document.getElementById("groups-table");

    document.getElementById("competition-name").innerHTML = params.get("Name");
    params.get("Members").forEach(mem => membersTable.append(memberElementCreate(mem)));
    params.get("Groups").forEach(gr =>   groupsTable.append(groupElementCreate(gr)));
}

function refreshPairs(){
    var newParams = sendRequest("/competition-pairs-refresh?" + "cid=" + pageParams.get("cid"));
    var groupsTable = document.getElementById("groups-table");
    
    while(groupsTable.rows.length > 2){
        groupsTable.deleteRow(groupsTable.rows.length - 1);
    }
    newParams.get("Groups").forEach(gr =>   groupsTable.append(groupElementCreate(gr)));
}

function setBtnActions(){
    document.getElementById("form-pairs-btn").addEventListener("click", refreshPairs, false);
    document.getElementById("sort-members-btn").addEventListener("click", resortMembers, false);
    document.getElementById("member-form-send-btn").addEventListener("click", sendMemberForm, false);
    document.getElementById("group-form-send-btn").addEventListener("click", sendGroupForm, false);
}

showAllIfAdmin();
fillPageInfo(sendRequest("/competition-get?" + "cid=" + pageParams.get("cid")));
setBtnActions();
languageSwitchingOn();