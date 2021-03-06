
import {sendRequest} from "./common.js"
import {isNumber} from "./common.js"
import {isEmptyString} from "./common.js"
import {getLinkParams} from "./common.js"
import {sendForm} from "./common.js"

var pageParams = getLinkParams(location.search);
var qualificationsMap = new Map();
var divisionsArray = new Array(0);

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

function sendNotification(name, value) {
    var paramsMap = new Map();

    paramsMap.set(name, value);
    paramsMap.set("cid", pageParams.get("cid"));
    sendForm('/competition-edition', paramsMap);
}

/* ------------------- QUALIFICATIONS ----------------------------*/

function qualificationElementAddToPage(value, name){
    if(value == "") return "";

    var qTable =  document.getElementById("qualification-table");
    var qTableTemplate = document.getElementById("qualification-template").content.cloneNode(true);

    qTableTemplate.getElementById("qual-value").innerHTML = value;
    qTableTemplate.getElementById("qual-name").innerHTML = name;
    qTableTemplate.getElementById("qual-dell-btn").addEventListener("click", function(){deleteQualification(value)}, false);
    qTable.append(qTableTemplate);

    var memberQualsTemplate = document.getElementById("create-member-qual-temp").content.cloneNode(true).getElementById("create-member-qual-item");
    memberQualsTemplate.setAttribute("value", value);
    memberQualsTemplate.innerHTML = name;
    document.getElementById("create-member-qualifications").append(memberQualsTemplate);

    var groupQualsTemplate = document.getElementById("create-group-qual-temp").content.cloneNode(true).getElementById("create-group-qual-item");
    groupQualsTemplate.setAttribute("value", value);
    groupQualsTemplate.innerHTML = name;
    document.getElementById("ng-members-qualification-min").append(groupQualsTemplate.cloneNode(true));
    document.getElementById("ng-members-qualification-max").append(groupQualsTemplate);
}

function toogleQualificationAdding(){
    var row = document.getElementById("qualification-add-field");
    if(row == null){
        var row =  document.getElementById("qualification-table").insertRow(1);
        row.innerHTML =  document.getElementById("qualification-adding-template").innerHTML;
        row.setAttribute("id", "qualification-add-field");
        document.getElementById("qual-ok-btn").
        addEventListener("click", function(){addQualification("add-qualification-value", "add-qualification-name")}, false);
    } else {
        row.remove();
    }
}

function addQualification(valueId, nameId){
    var value = document.getElementById(valueId).value;
    var name = document.getElementById(nameId).value;
    var qualTable =  document.getElementById("qualification-table")
    for(var i = 1; i < qualTable.rows.length; i++){
        if(qualTable.rows[i].cells[0].innerHTML.localeCompare(value) == 0) return;
        if(qualTable.rows[i].cells[1].innerHTML.localeCompare(name) == 0) return;
    }
    qualificationElementAddToPage(value, name);
    toogleQualificationAdding();
    sendNotification("qualification-add", value + " - " + name);
}

function deleteQualification(value){
    var qualTable =  document.getElementById("qualification-table")
    for(var i = 1; i < qualTable.rows.length; i++){
        if(qualTable.rows[i].cells[0].innerHTML.localeCompare(String(value)) == 0){
            qualTable.rows[i].remove();
            sendNotification("qualification-delete", value);
            location.reload();
            return;
        }
    }
    
}

/* ------------------- DIVISIONS ----------------------------*/

function divisionElementAddToPage(division){
    if(division.localeCompare("\r\n") == 0) return "";
    divisionsArray.push(division);

    var divTable = document.getElementById("divisions-table");
    var divTableTemplate = document.getElementById("division-template").content.cloneNode(true);
    divTableTemplate.getElementById("div-name").innerHTML = division;
    divTableTemplate.getElementById("div-dell-btn").addEventListener("click", function(){deleteDivision(division)}, false);
    divTable.append(divTableTemplate);

    var memberDivs = document.getElementById("create-member-divisions");
    var memberDivsTemplate = document.getElementById("create-member-division-template").content.cloneNode(true);
    var membDivId = memberDivsTemplate.getElementById("div-input");
    membDivId.setAttribute("id", memberForm.get("divisionPrefix") + division);
    membDivId.setAttribute("name", division);
    membDivId.setAttribute("value", division);
    memberDivsTemplate.getElementById("div-label").setAttribute("for", division);
    memberDivsTemplate.getElementById("div-label").innerHTML = division;
    memberDivs.append(memberDivsTemplate);

    var groupDivsTemplate = document.getElementById("create-group-div-temp").content.cloneNode(true).getElementById("create-group-div-item");
    groupDivsTemplate.setAttribute("value", division);
    groupDivsTemplate.innerHTML = division;
    groupForm.get("division").append(groupDivsTemplate);  
}

function toogleDivisionAdding(){
    var rowId = "division-add-field";
    var row = document.getElementById(rowId);
    if(row == null){
        var row = document.getElementById("divisions-table").insertRow(1);
        row.innerHTML =  document.getElementById("division-adding-template").innerHTML;
        row.setAttribute("id", rowId);
        document.getElementById("div-ok-btn").
        addEventListener("click", function(){addDivision("add-division")}, false);
    } else {
        row.remove();
    }
}

function addDivision(divId){
    var divTable = document.getElementById("divisions-table");
    var div = document.getElementById(divId).value;
    for(var i = 1; i < divTable.rows.length; i++){
        if(divTable.rows[i].cells[0].innerHTML.localeCompare(div) == 0) return;
    }
    toogleDivisionAdding();
    divisionElementAddToPage(div);
    sendNotification("division-add", div);
}

function deleteDivision(div){
    var divTable = document.getElementById("divisions-table");
    for(var i = 1; i < divTable.rows.length; i++){
        if(divTable.rows[i].cells[0].innerHTML.localeCompare(div) == 0){
            divTable.rows[i].remove();
            sendNotification("division-delete", div);
            location.reload();
            return;
        } 
    }
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
                                    + document.referrer + "/member?mid=" + member.get("id") + "'; return false");
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

    sendForm("/new-member-form?" + "cid=" + pageParams.get("cid"), paramsMap);
    location.reload();
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
    template.getElementById("group-pairs-num").innerHTML = group.get("pairs_num"); 
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

    if(groupForm.get("ageIsOn").checked){
        if(!isAgeOk()) return;
        paramsMap.set("age-min", groupForm.get("ageMin").value);
        paramsMap.set("age-max", groupForm.get("ageMax").value);
    }
    
    if(groupForm.get("weightIsOn").checked){
        if(!isWeightOk()) return;
        paramsMap.set("weight-min", groupForm.get("weightMin").value);
        paramsMap.set("weight-max", groupForm.get("weightMin").value);
    }
    
    if(groupForm.get("qualIsOn").checked){
        if(!isQualificationOk()) return;
        paramsMap.set("qualification-min", groupForm.get("qualMin").value);
        paramsMap.set("qualification-max", groupForm.get("qualMax").value);
    }

    if(groupForm.get("sexIsOn").checked){
        paramsMap.set("sex", groupForm.get("sexIsMale").checked ? "male" : "female");
    }
    sendForm("/new-group-form?" + "cid=" + pageParams.get("cid"), paramsMap);
    location.reload();
}
/* ------------------- COMMON ----------------------------*/

function fillPageInfo(params){
    var membersTable = document.getElementById("members-table");
    var groupsTable = document.getElementById("groups-table");

    for (var [key, value] of params.get("Qualifications")) {
        qualificationElementAddToPage(key, value);
        qualificationsMap.set(key, value);
    }
    document.getElementById("competition-name").innerHTML = params.get("Name");
    params.get("Divisions").forEach(div => divisionElementAddToPage(div));
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
    document.getElementById("qual-add-btn").addEventListener("click", toogleQualificationAdding, false);
    document.getElementById("div-add-btn").addEventListener("click", toogleDivisionAdding, false);
    document.getElementById("form-pairs-btn").addEventListener("click", refreshPairs, false);
    document.getElementById("sort-members-btn").addEventListener("click", resortMembers, false);
    document.getElementById("member-form-send-btn").addEventListener("click", sendMemberForm, false);
    document.getElementById("group-form-send-btn").addEventListener("click", sendGroupForm, false);
}


fillPageInfo(sendRequest("/competition-get?" + "cid=" + pageParams.get("cid")));
setBtnActions();
