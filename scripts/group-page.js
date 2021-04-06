


import {sendRequest} from "./common.js"
import {isNumber} from "./common.js"
import {isEmptyString} from "./common.js"
import {getLinkParams} from "./common.js"
import {sendForm} from "./common.js"
import {refreshPage} from "./common.js"
import {showAllIfAdmin} from "./common.js"
import {languageSwitchingOn} from "./common.js"

var prevPage = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
var pageParams = getLinkParams(location.search);
var pageInfo = sendRequest("/group-get?cid=" + pageParams.get("cid") + "&gid=" + pageParams.get("gid"));
var competitionParams = sendRequest("/competition-get?" + "cid=" + pageParams.get("cid"));
var qualsMap = competitionParams.get("Qualifications");
var membersToAdd = new Array(0);


var groupForm = new Map();
groupForm.set( "name",           document.getElementById("new-group-name"));
groupForm.set( "division",       document.getElementById("create-group-division"));
groupForm.set( "sexIsOn",        document.getElementById("gender-checkbox"));
groupForm.set( "sexIsMale",      document.getElementById("create-ng-male"));
groupForm.set( "sexIsFemale",    document.getElementById("create-ng-female"));
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

function getQualificationInterval(qMin, qMax){
    var qMinName;
    var qMaxName;
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
    if(Number(qMax) == Number(qMin) && (Number(qMin) > 0)) return qMinName;
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

function memberNameGet(id){
    console.log(id);
    if(!isNumber(id)){
        return "Winner of " + id;
    }
    var member = pageInfo.get("Members").find( memb => memb.get("id") == id );
    if(member == undefined){
        return "";
    }
    return member.get("name") + " " + member.get("surname");
}

function sendNotification(name, value) {
    var header = (name == "group-delete") ? '/competition-edition' : '/group-edit';
    var paramsMap = new Map();
    paramsMap.set(name, value);
    paramsMap.set("cid", pageParams.get("cid"));
    paramsMap.set("gid", pageParams.get("gid"));
    sendForm(header, paramsMap);
}

function sendGroupForm() {
    if(!isMainGroupParamsOk()) return;

    var paramsMap = new Map();
    
    paramsMap.set("group-edit",    pageParams.get("gid"));
    paramsMap.set("cid",            pageParams.get("cid"));  
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
    sendForm("/group-edit", paramsMap);
    location.reload();
}

function deleteGroup(){
    sendNotification("group-delete", pageParams.get("gid"));
}

function memberDelete(id){
    var table = document.getElementById("members-table");
    var memberName = memberNameGet(id);

    for(var i = 2; i < table.rows.length; i++) {
        if(table.rows[i].cells[0].innerHTML.localeCompare(memberName) == 0){
            table.deleteRow(i);
            sendNotification("group-member-delete", id);
            setTimeout(refreshPairs, 1000);
            return;
        }
    }
    
}

function putMemberToAdd(id){
    var member = competitionParams.get("Members").find( memb => memb.get("id") == id);
    var memberRow = document.getElementById("comp-member-" + id);
    if(member == undefined) return;

    if(membersToAdd.find( memb => memb.get("id") == id) == undefined){
        membersToAdd.push(member);
        memberRow.setAttribute("class", "selected-row");
    } else {
        var pos = membersToAdd.indexOf(member);
        membersToAdd.splice(pos, 1);
        memberRow.setAttribute("class", "non-selected-row");
    }
    console.log(membersToAdd);
}

function pairSetWinner(id, color) {
    var paramsMap = new Map();
    paramsMap.set("color", color);
    sendForm(window.location.href + '/pair-member-win?pid=' + id, paramsMap);
    setTimeout(refreshPage, 1000);
}

function pairWinnerElementCreate(pair, template){
    
    if(!isEmptyString(pair.get("winner"))){
        console.log("Set winner: " + pair.get("winner"));
        template.getElementById("pair-winner").innerHTML = memberNameGet(pair.get("winner"));
        template.getElementById("pair-winner").setAttribute("class",
            (pair.get("winner") == pair.get("member_red")) ? "red-cell-style" : "blue-cell-style");
        return;
    }
    template.getElementById("red-member-win")
        .addEventListener("click", function(){pairSetWinner(pair.get("id"), "red")}, false);
        template.getElementById("blue-member-win")
        .addEventListener("click", function(){pairSetWinner(pair.get("id"), "blue")}, false);
}

function pairElementCreate(pair){
    if(pair.get("id") == undefined){
        return "";
    }
    var template = document.getElementById("pair-template").content.cloneNode(true);
    var memberRedId = pair.get("member_red");
    var memberBlueId = pair.get("member_blue");
    var redLink = prevPage + "/member?mid=" + memberRedId;
    var blueLink = prevPage + "/member?mid=" + memberBlueId;

    template.getElementById("pair-id").innerHTML = pair.get("id"); 
    template.getElementById("pair-red").innerHTML = memberNameGet(memberRedId);
    template.getElementById("pair-blue").innerHTML = memberNameGet(memberBlueId);
    pairWinnerElementCreate(pair, template);

    if(Number(memberRedId) >= 0){
        template.getElementById("pair-red")
            .setAttribute("onclick", "window.location.href='" + redLink + "'; return false"); 
    }
    if(Number(memberBlueId) >= 0){
        template.getElementById("pair-blue")
            .setAttribute("onclick", "window.location.href='" + blueLink + "'; return false"); 
    }
    return template;
}

function divisionElementAddToPage(division ){
    if(division.localeCompare("\r\n") == 0) return "";

    var groupDivsTemplate = document.getElementById("create-group-div-temp").content.cloneNode(true).getElementById("create-group-div-item");
    groupDivsTemplate.setAttribute("value", division);
    groupDivsTemplate.innerHTML = division;
    groupForm.get("division").append(groupDivsTemplate); 
}

function qualificationElementAddToPage(value, name){
    if(value == "") return "";

    var groupQualsTemplate = document.getElementById("create-group-qual-temp").content.cloneNode(true).getElementById("create-group-qual-item");
    groupQualsTemplate.setAttribute("value", value);
    groupQualsTemplate.innerHTML = name;
    document.getElementById("ng-members-qualification-min").append(groupQualsTemplate.cloneNode(true));
    document.getElementById("ng-members-qualification-max").append(groupQualsTemplate);
}

function competitionListMembersAdd(member){
    if(member.get("id") == undefined) return "";
    var membersTable = document.getElementById("members-adding-table");
    var template = document.getElementById("competition-member-template").content.cloneNode(true);

    template.getElementById("member-name").innerHTML = member.get("name") + " " + member.get("surname"); 
    template.getElementById("member-age").innerHTML = member.get("age");
    template.getElementById("member-weight").innerHTML = member.get("weight");
    template.getElementById("member-sex").innerHTML = member.get("sex");
    template.getElementById("member-team").innerHTML = member.get("team");
    template.getElementById("member-qualification").innerHTML = qualsMap.get(member.get("qualification"));
    template.getElementById("member-admited").innerHTML = member.get("admited");
    template.getElementById("member-row").addEventListener("click", function(){putMemberToAdd(member.get("id"))}, false);
    template.getElementById("member-row").setAttribute("id", "comp-member-" + member.get("id"));
    membersTable.append(template);
}

function memberElementCreate(member){
    if(member.get("id") == undefined) return "";
    var template = document.getElementById("group-member-template").content.cloneNode(true);
    template.getElementById("member-name").innerHTML = member.get("name") + " " + member.get("surname"); 
    template.getElementById("member-age").innerHTML = member.get("age");
    template.getElementById("member-weight").innerHTML = member.get("weight");
    template.getElementById("member-sex").innerHTML = member.get("sex");
    template.getElementById("member-team").innerHTML = member.get("team");
    template.getElementById("member-qualification").innerHTML = qualsMap.get(member.get("qualification"));
    template.getElementById("member-admited").innerHTML = member.get("admited");
    template.getElementById("member-name").setAttribute("onclick", "window.location.href='"
                                    + prevPage + "/member?mid=" + member.get("id") + "'; return false");
    template.getElementById("member-dell-btn").addEventListener("click", function(){memberDelete(member.get("id"))}, false);
    return template;
}


function fillPageInfo(params){
    /*--------------------------------Main tables params--------------------------------------------------------------------------------*/
    var membersTable = document.getElementById("members-table");
    var pairsTable = document.getElementById("pairs-table");

    document.getElementById("group-name").innerHTML         = params.get("Name");
    document.getElementById("group-form-system").innerHTML   = params.get("FormSys");
    document.getElementById("group-division").innerHTML     = params.get("Division");
    document.getElementById("group-sex").innerHTML          = params.get("Sex");
    document.getElementById("group-age").innerHTML          = getNumberInterval(params.get("Age_min"), params.get("Age_max"));
    document.getElementById("group-weight").innerHTML       = getNumberInterval(params.get("Weight_min"), params.get("Weight_max"));
    document.getElementById("group-qulification").innerHTML = getQualificationInterval(params.get("Qualification_min"), params.get("Qualification_max"));
    params.get("Members").forEach(mem => membersTable.append(memberElementCreate(mem)));
    params.get("Pairs").forEach(pair =>   pairsTable.append(pairElementCreate(pair)));

    /*--------------------------------Edit window params--------------------------------------------------------------------------------*/
    competitionParams.get("Divisions").forEach(division => {
        divisionElementAddToPage(division);
    });
    qualsMap.forEach(function(value, key) {
        qualificationElementAddToPage(key, value);
    });
    
    groupForm.get("name").value    = params.get("Name");
    groupForm.get("division").value    = params.get("Division");

    if(params.get("Sex") == "Male"){
        groupForm.get("sexIsOn").checked = true;
        groupForm.get("sexIsMale").checked = true;
    } else if(params.get("Sex") == "Female"){
        groupForm.get("sexIsOn").checked = true;
        groupForm.get("sexIsFemale").checked = true;
    }
    
    if((Number(params.get("Age_min")) >= 0) || (Number(params.get("Age_max")) >= 0)){
        groupForm.get("ageIsOn").checked = true;
        groupForm.get("ageMin").value = (Number(params.get("Age_min")) < 0) ? "" : params.get("Age_min");
        groupForm.get("ageMax").value = (Number(params.get("Age_max")) < 0) ? "" : params.get("Age_max");
    }
    
    if((Number(params.get("Weight_min")) >= 0) || (Number(params.get("Weight_max")) >= 0)){
        groupForm.get("weightIsOn").checked = true;
        groupForm.get("weightMin").value = (Number(params.get("Weight_min")) < 0) ? "" : params.get("Weight_min");
        groupForm.get("weightMax").value = (Number(params.get("Weight_max")) < 0) ? "" : params.get("Weight_max");
    }
    
    var qmin = Number(params.get("Qualification_min"));
    var qmax = Number(params.get("Qualification_max"));
    
    if((qmin >= 0) || (qmax >= 0)){
        groupForm.get("qualIsOn").checked = true;
        groupForm.get("qualMin").value = (qmin < 0) ? "" : params.get("Qualification_min");
        groupForm.get("qualMax").value = (qmax < 0) ? "" : params.get("Qualification_max");
    }

    /*--------------------------------Adding members params--------------------------------------------------------------------------------*/
    competitionParams.get("Members").forEach(compMember => {
        if(params.get("Members").find( grMember => grMember.get("id") == compMember.get("id")) == undefined){
            competitionListMembersAdd(compMember);
        }
    });
}

function refreshPairs(){
    var pairsTable = document.getElementById("pairs-table");
    pageInfo = sendRequest("/group-pairs-refresh?cid=" + pageParams.get("cid") + "&gid=" + pageParams.get("gid"));
    while(pairsTable.rows.length > 2){
        pairsTable.deleteRow(pairsTable.rows.length - 1);
    }
    pageInfo.get("Pairs").forEach(pair =>   pairsTable.append(pairElementCreate(pair)));
    showAllIfAdmin();
}

function addMembersToGroup()
{
    if(membersToAdd.length < 1)
        return;
        
    var paramsMap = new Map();
    var first = true;
    var membersIds = "";

    membersToAdd.forEach(memb => {
        membersIds += (first ? memb.get("id") : ("," + memb.get("id")));
        first = false;
    });
    paramsMap.set("group-members-add",  membersIds);
    paramsMap.set("gid",                pageParams.get("gid"));
    paramsMap.set("cid",                pageParams.get("cid"));  

    sendForm("/group-edit", paramsMap);
    setTimeout(refreshPage, 1000);
}


fillPageInfo(pageInfo);
document.getElementById("members-add-btn").addEventListener("click", addMembersToGroup, false);
document.getElementById("group-form-send-btn").addEventListener("click", sendGroupForm, false);
document.getElementById("update-pairs-btn").addEventListener("click", refreshPairs, false);
document.getElementById("delete-group-btn").addEventListener("click", deleteGroup, false);
document.getElementById("priv-page-link").setAttribute("href", prevPage);
document.getElementById("group-grid").setAttribute("href", window.location.href + "/group-grid");
showAllIfAdmin();
languageSwitchingOn();
