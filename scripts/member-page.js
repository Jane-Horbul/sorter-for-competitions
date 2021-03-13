
import {sendRequest} from "./common.js"
import {isNumber} from "./common.js"
import {isEmptyString} from "./common.js"
import {getLinkParams} from "./common.js"
import {sendForm} from "./common.js"
import {refreshPage} from "./common.js"

var pageParams = getLinkParams(location.search);
var pageInfo = sendRequest("/member-get?cid=" + pageParams.get("cid") + "&mid=" + pageParams.get("mid"));
var competitionParams = sendRequest("/competition-get?" + "cid=" + pageParams.get("cid"));
var qualsMap = competitionParams.get("Qualifications");
var groupsToAdd = new Array(0);

var memberInfo = new Map();
memberInfo.set( "name",         document.getElementById("member-name"));
memberInfo.set( "divisions",    document.getElementById("member-division"));
memberInfo.set( "age",          document.getElementById("member-age"));
memberInfo.set( "weight",       document.getElementById("member-weight"));
memberInfo.set( "sex",          document.getElementById("member-sex"));
memberInfo.set( "qulification", document.getElementById("member-qulification"));
memberInfo.set( "team",         document.getElementById("member-team"));
memberInfo.set( "id",           document.getElementById("member-id"));
memberInfo.set( "admit",        document.getElementById("member-admit"));

var memberForm = new Map();
memberForm.set( "name",           document.getElementById("new-member-name"));
memberForm.set( "surname",        document.getElementById("new-member-surname"));
memberForm.set( "age",            document.getElementById("new-member-age"));
memberForm.set( "weight",         document.getElementById("new-member-weight"));
memberForm.set( "is_male",        document.getElementById("new-member-sex-male"));
memberForm.set( "is_female",        document.getElementById("new-member-sex-female"));
memberForm.set( "team",           document.getElementById("new-member-team"));
memberForm.set( "qualification",  document.getElementById("create-member-qualifications"));
memberForm.set( "divisionPrefix", "member-create-");
memberForm.set( "permit",         document.getElementById("new-member-permit-yes"));

function divisionElementAddToPage(division , isOn){
    if(division.localeCompare("\r\n") == 0) return "";

    var memberDivs = document.getElementById("create-member-divisions");
    var memberDivsTemplate = document.getElementById("create-member-division-template").content.cloneNode(true);
    var membDivId = memberDivsTemplate.getElementById("div-input");
    membDivId.setAttribute("id", memberForm.get("divisionPrefix") + division);
    membDivId.setAttribute("name", division);
    membDivId.setAttribute("value", division);
    memberDivsTemplate.getElementById("div-label").setAttribute("for", division);
    memberDivsTemplate.getElementById("div-label").innerHTML = division;
    if(isOn) membDivId.checked = true;
    memberDivs.append(memberDivsTemplate);
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

function getQualificationInterval(qMin, qMax){
    var qMinName;
    var qMaxName;
    if((Number(qMin) < 0) && (Number(qMax) < 0)) return "-";

    if(!isNumber(qMin) || (Number(qMin) < 0) || (qualsMap.get(qMin) == undefined)){
        qMinName = "";
    } else {
        qMinName = qualsMap.get(qMin);
    }
    if(!isNumber(qMax) || (Number(qMax) < 0) || (qualsMap.get(qMax) == undefined)){
        qMaxName = "";
    } else {
        qMaxName = qualsMap.get(qMax);
    }
    
    if(Number(qMax) == Number(qMin)) return qMinName;
    return qMinName + " - " + qMaxName;
}

function getNumberInterval(min, max){
    if(!isNumber(min) || (Number(min) < 0)){
        min = -1;
    }
    if(!isNumber(max) || (Number(max) < 0)){
        max = -1;
    }
    if((min < 0) && (max < 0)) return "-";
    if(max < 0) return min + "+";
    if(min < 0) return "-" + max;
    return min + " - " + max;
}

function sendMemberForm() {
    if(!isMemberParamsOk()) return;

    var paramsMap = new Map();
    var divisions = "";
    var qualification = memberForm.get("qualification").value;

    competitionParams.get("Divisions").forEach(div => {
        if(isEmptyString(div)) return;
        if(document.getElementById(memberForm.get("divisionPrefix") + div).checked){
            divisions += div + ", "
        }
    });

    paramsMap.set("member-edit",    pageParams.get("mid"));
    paramsMap.set("cid",            pageParams.get("cid"));    
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

    sendForm("/competition-edition", paramsMap);
    location.reload();
}

function sendNotification(name, value) {
    var paramsMap = new Map();
    paramsMap.set(name, value);
    paramsMap.set("cid", pageParams.get("cid"));
    paramsMap.set("mid", pageParams.get("mid"));
    sendForm('/competition-edition', paramsMap);
}

function groupNameGet(id){
    var group = pageInfo.get("Groups").find( gr => gr.get("id") == id );
    return (group == undefined) ? "" : group.get("name");
}

function groupDelete(id){
    var table = document.getElementById("groups-table");
    var groupName = groupNameGet(id);

    for(var i = 2; i < table.rows.length; i++) {
        if(table.rows[i].cells[0].innerHTML.localeCompare(groupName) == 0){
            table.deleteRow(i);
            sendNotification("member-group-delete", id);
            return;
        }
    }
}

function groupElementCreate(group){
    if(group.get("id") == undefined) return "";
    var template = document.getElementById("group-template").content.cloneNode(true);
    console.log(group);
    template.getElementById("group-name").innerHTML          = group.get("name"); 
    template.getElementById("group-sex").innerHTML           = group.get("sex");
    template.getElementById("group-division").innerHTML      = group.get("division");
    template.getElementById("group-age").innerHTML           = getNumberInterval(group.get("ageMin"), group.get("ageMax"));
    template.getElementById("group-weight").innerHTML        = getNumberInterval(group.get("weightMin"), group.get("weightMax"));
    template.getElementById("group-qualification").innerHTML = getQualificationInterval(group.get("qualificationMin"), group.get("qualificationMax"));
    template.getElementById("group-members-num").innerHTML     = group.get("membersNum");
    
    template.getElementById("group-name").setAttribute("onclick", "window.location.href='"
                                    + document.referrer + "/group?gid=" + group.get("id") + "'; return false");
    template.getElementById("group-dell-btn").addEventListener("click", function(){groupDelete(group.get("id"))}, false);
    return template;
}

function deleteMember(){
    sendNotification("member-delete", pageParams.get("mid"));
}

function putGroupToAdd(id){
    var group = competitionParams.get("Groups").find( gr => gr.get("id") == id);
    var groupRow = document.getElementById("comp-group-" + id);
    if(group == undefined) return;

    if(groupsToAdd.find( gr => gr.get("id") == id) == undefined){
        groupsToAdd.push(group);
        groupRow.setAttribute("class", "selected-row");
    } else {
        var pos = groupsToAdd.indexOf(group);
        groupsToAdd.splice(pos, 1);
        groupRow.setAttribute("class", "non-selected-row");
    }
}

function addMemberToGroups()
{
    if(groupsToAdd.length < 1)
        return;
        
    var paramsMap = new Map();
    var first = true;
    var groupsIds = "";

    groupsToAdd.forEach(gr => {
        groupsIds += (first ? gr.get("id") : ("," + gr.get("id")));
        first = false;
    });
    paramsMap.set("member-groups-add",  groupsIds);
    paramsMap.set("mid",                pageParams.get("mid"));
    paramsMap.set("cid",                pageParams.get("cid"));  

    sendForm("/competition-edition", paramsMap);
    setTimeout(refreshPage, 1000);
}

function competitionListGroupsAdd(group){
    if(group.get("id") == undefined) return "";
    var groupsTable = document.getElementById("groups-adding-table");
    var template = document.getElementById("group-adding-template").content.cloneNode(true);

    template.getElementById("group-name").innerHTML          = group.get("name"); 
    template.getElementById("group-sex").innerHTML           = group.get("sex");
    template.getElementById("group-division").innerHTML      = group.get("division");
    template.getElementById("group-age").innerHTML           = getNumberInterval(group.get("age_min"), group.get("age_max"));
    template.getElementById("group-weight").innerHTML        = getNumberInterval(group.get("weight_min"), group.get("weight_max"));
    template.getElementById("group-qualification").innerHTML = getQualificationInterval(group.get("qualification_min"), group.get("qualification_max"));
    template.getElementById("group-members-num").innerHTML     = group.get("members_num");

    template.getElementById("group-row").addEventListener("click", function(){putGroupToAdd(group.get("id"))}, false);
    template.getElementById("group-row").setAttribute("id", "comp-group-" + group.get("id"));
    groupsTable.append(template);
}

function fillPageInfo(params){
    console.log(params);
    var groupsTable = document.getElementById("groups-table");
    
    memberInfo.get("name").innerHTML            = params.get("Name") + " " + params.get("Surname");
    memberInfo.get("id").innerHTML              = params.get("Id");
    memberInfo.get("sex").innerHTML             = params.get("Sex");
    memberInfo.get("age").innerHTML             = params.get("Age");
    memberInfo.get("weight").innerHTML          = params.get("Weight");
    memberInfo.get("team").innerHTML            = params.get("Team");
    memberInfo.get("qulification").innerHTML    = qualsMap.get(params.get("Qualification"));
    memberInfo.get("divisions").innerHTML       = params.get("Divisions");
    memberInfo.get("admit").innerHTML           = params.get("Admit");

    memberForm.get("name").value    = params.get("Name");
    memberForm.get("surname").value = params.get("Surname");
    memberForm.get("age").value     = params.get("Age");
    memberForm.get("weight").value  = params.get("Weight");
    memberForm.get("team").value    = params.get("Team");
    if(params.get("Sex") == "Female")   memberForm.get("is_female").checked = true;
    if(params.get("Sex") == "Male")     memberForm.get("is_male").checked = true;

    for (var [key, value] of qualsMap) {
        var memberQualsTemplate = document.getElementById("create-member-qual-temp").content.cloneNode(true).getElementById("create-member-qual-item");
        memberQualsTemplate.setAttribute("value", key);
        memberQualsTemplate.innerHTML = value;
        memberForm.get("qualification").append(memberQualsTemplate);
        if(key == params.get("Qualification")){
            memberQualsTemplate.selected = true;
        }
    }
    competitionParams.get("Divisions").forEach(division => {
    divisionElementAddToPage(division , (params.get("Divisions").find( div => div == division) == undefined) ? false : true);
    });
    params.get("Groups").forEach(gr => groupsTable.append(groupElementCreate(gr)));

    /*--------------------------------Adding groups params--------------------------------------------------------------------------------*/
    competitionParams.get("Groups").forEach(compGroup => {
        if(params.get("Groups").find( memberGroup => memberGroup.get("id") == compGroup.get("id")) == undefined){
            competitionListGroupsAdd(compGroup);
        }
    });
}

fillPageInfo(pageInfo);
document.getElementById("groups-add-btn").addEventListener("click", addMemberToGroups, false);
document.getElementById("member-form-send-btn").addEventListener("click", sendMemberForm, false);
document.getElementById("delete-member-btn").addEventListener("click", deleteMember, false);
document.getElementById("priv-page-link").setAttribute("href", document.referrer)