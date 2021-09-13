
import {isNumber, isEmptyString, getLinkParams, showAllIfAdmin, languageSwitchingOn, onClick} from "./common.js"
import {ops, server} from "./communication.js"

const pageParams        = getLinkParams(location.search);
const page = {
    cid: pageParams.get("cid"),
    gid: pageParams.get("gid"),
    sid: pageParams.get("sid")
}

const departmentInfo    = server.getDepartment();
const qualificationsMap = ops.department.getQualifications(departmentInfo);
var departmentLink      = "";   
var competitionLink     = undefined;
var competitionInfo     = undefined;
var sportsmanInfo       = undefined;

if(page.cid != undefined){
    competitionLink   = window.location.href.substr(0, window.location.href.lastIndexOf("/"));   
    departmentLink    = competitionLink.substr(0, competitionLink.lastIndexOf("/"));
    competitionInfo   = server.getCompetition(page.cid);
    sportsmanInfo     = server.getCompetitionSportsman(page.cid, page.sid);
} else{
    departmentLink  = window.location.href.substr(0, window.location.href.lastIndexOf("/"));   
    sportsmanInfo   = server.getDepartmentSportsman(page.sid);
}
console.log(sportsmanInfo);

sportsmanInfo = ops.createSportsman(sportsmanInfo);


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

    sendForm("/member-edit?cid=" + pageParams.get("cid") + "&mid=" + pageParams.get("mid"), paramsMap, true);
}

function sendNotification(name, value) {
    var paramsMap = new Map();
    paramsMap.set(name, value);
    sendForm('/member-edit?cid=' + pageParams.get("cid") + "&mid=" + pageParams.get("mid"), paramsMap, false);
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
                                    + prevPage + "/group?gid=" + group.get("id") + "'; return false");
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

    sendForm("/member-edit?cid=" + pageParams.get("cid") + "&mid=" + pageParams.get("mid"), paramsMap, true);
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

/* ------------------- COMMON ----------------------------*/

const sportsmanObjects = {
    pageNameId:         "page-name",
    pageNameLinkId:     "page-name-link",
    compLinkId:         "competition-link",
    depLinkId:          "department-link",
    sportsLinkId:       "sportsman-link",
    sportsHeaderId:     "sportsman-header",
    compBreadCrumb:     "competition-bread-crumb",
    arrowBreadCrumb:    "arrow-bread-crumb",

    setPageName(name)           {document.getElementById(this.pageNameId).innerHTML = name;},
    setPageNameLink(link)       {document.getElementById(this.pageNameLinkId).setAttribute("href", link);},
    setDepartmentName(name)     {document.getElementById(this.depLinkId).innerHTML = name;},
    setDepartmentLink(link)     {document.getElementById(this.depLinkId).setAttribute("href", link);},
    setCompetitionName(name)    {document.getElementById(this.compLinkId).innerHTML = name;},
    setCompetitionLink(link)    {document.getElementById(this.compLinkId).setAttribute("href", link);},
    setSportsmanName(name)      {document.getElementById(this.sportsLinkId).innerHTML = name;},
    setSportsmanLink(link)      {document.getElementById(this.sportsLinkId).setAttribute("href", link);},
    setSportsmanHeader(name)    {document.getElementById(this.sportsHeaderId).innerHTML = name;},
    removeCompetitionBrCrumb()  {document.getElementById(this.compBreadCrumb).remove(); document.getElementById(this.arrowBreadCrumb).remove();},

    infoIdId:           "sportsman-info-id",
    infoNameId:         "sportsman-info-name",
    infoSurnameId:      "sportsman-info-surname",
    infoSexId:          "sportsman-info-sex",
    infoAgeId:          "sportsman-info-age",
    infoWeightId:       "sportsman-info-weight",
    infoQualId:         "sportsman-info-qual",
    infoTeamId:         "sportsman-info-team",

    setInfoId(val)              {document.getElementById(this.infoIdId).innerHTML = val;},
    setInfoName(val)            {document.getElementById(this.infoNameId).innerHTML = val;},
    setInfoSurname(val)         {document.getElementById(this.infoSurnameId).innerHTML = val;},
    setInfoSex(val)             {document.getElementById(this.infoSexId).innerHTML = val;},
    setInfoAge(val)             {document.getElementById(this.infoAgeId).innerHTML = val;},
    setInfoWeight(val)          {document.getElementById(this.infoWeightId).innerHTML = val;},
    setInfoQual(val)            {document.getElementById(this.infoQualId).innerHTML = val;},
    setInfoTeam(val)            {document.getElementById(this.infoTeamId).innerHTML = val;},

    inputNameId:         "sports-input-name",
    inputSurnameId:      "sports-input-surname",
    inputSexId:          "sports-input-sex",
    inputAgeId:          "sports-input-age",
    inputWeightId:       "sports-input-weight",
    inputQualId:         "sports-input-qulification",
    inputTeamId:         "sports-input-team",

    getNameInput()          { return document.getElementById(this.inputNameId);},
    getSurnameInput()       { return document.getElementById(this.inputSurnameId);},
    getSexInput()           { return document.getElementById(this.inputSexId);},
    getAgeInput()           { return document.getElementById(this.inputAgeId);},
    getWeightInput()        { return document.getElementById(this.inputWeightId);},
    getQualInput()          { return document.getElementById(this.inputQualId);},
    getTeamInput()          { return document.getElementById(this.inputTeamId);},

    createInput(id)             { return document.getElementById((id + "-template")).cloneNode(true).content;},
    createOption(id, name, val) { var res = document.createElement("option");
                                    res.setAttribute("id", id);
                                    res.value = val;
                                    res.innerHTML = name;
                                    return res;
                                },
    getAndCleanPlace(id)        { var pl= document.getElementById(id); pl.innerHTML = ""; return pl;},

    delBtnId:           "del-btn-link",
    editBtnId:          "group-edit-btn",

    setDelBtnLink(link)         {this.getDelBtn().setAttribute("href", link);},
    getDelBtn()                 { return document.getElementById(this.delBtnId);},
    getEditBtn()                { return document.getElementById(this.editBtnId);},
}

function sportsmanInfoEdit(){
    var nameInput = sportsmanObjects.getNameInput();
    
    if(nameInput != null){
        var name    = sportsmanObjects.getNameInput().value;
        var surname = sportsmanObjects.getSurnameInput().value;
        var sex     = sportsmanObjects.getSexInput().value;
        var age     = sportsmanObjects.getAgeInput().value;
        var weight  = sportsmanObjects.getWeightInput().value;
        var qual    = sportsmanObjects.getQualInput().value;
        var team    = sportsmanObjects.getTeamInput().value;

       // server.editSportsman();
        return;
    }

    var namePlace       = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoNameId);
    var surnamePlace    = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoSurnameId);
    var sexPlace        = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoSexId);
    var agePlace        = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoAgeId);
    var weightPlace     = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoWeightId);
    var qualPlace       = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoQualId);
    var teamPlace       = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoTeamId);

    namePlace.appendChild(      sportsmanObjects.createInput(sportsmanObjects.inputNameId));
    surnamePlace.appendChild(   sportsmanObjects.createInput(sportsmanObjects.inputSurnameId));
    sexPlace.appendChild(       sportsmanObjects.createInput(sportsmanObjects.inputSexId));
    agePlace.appendChild(       sportsmanObjects.createInput(sportsmanObjects.inputAgeId));
    weightPlace.appendChild(    sportsmanObjects.createInput(sportsmanObjects.inputWeightId));
    qualPlace.appendChild(      sportsmanObjects.createInput(sportsmanObjects.inputQualId));
    teamPlace.appendChild(      sportsmanObjects.createInput(sportsmanObjects.inputTeamId));

    sportsmanObjects.getNameInput().value       = sportsmanInfo.getName();
    sportsmanObjects.getSurnameInput().value    = sportsmanInfo.getSurname();
    sportsmanObjects.getAgeInput().value        = sportsmanInfo.getAge();
    sportsmanObjects.getWeightInput().value     = sportsmanInfo.getWeight();
    sportsmanObjects.getTeamInput().value       = sportsmanInfo.getTeam();
    
    if(sportsmanInfo.getSex() != "")
        sportsmanObjects.getSexInput().value = sportsmanInfo.getSex();

    var qualList = sportsmanObjects.getQualInput();

    qualificationsMap.forEach(function(name, value) {
        var optMin = sportsmanObjects.createOption(name + "-id", name, value);
        qualList.appendChild(optMin);
        if(sportsmanInfo.getQualification() == value)
            qualList.value = value;
    });
}

function fillPageInfo(){
    var sportsName = sportsmanInfo.getSurname() + " " + sportsmanInfo.getName();
    if(competitionInfo != undefined){
        sportsmanObjects.setPageName(ops.competition.getName(competitionInfo));
        sportsmanObjects.setPageNameLink(competitionLink);
        sportsmanObjects.setCompetitionName(ops.competition.getName(competitionInfo));
        sportsmanObjects.setCompetitionLink(competitionLink)
    } else{
        sportsmanObjects.removeCompetitionBrCrumb();
        sportsmanObjects.setPageName(ops.department.getName(departmentInfo));
        sportsmanObjects.setPageNameLink(departmentLink);
    }
    sportsmanObjects.setDepartmentName(ops.department.getName(departmentInfo));
    sportsmanObjects.setDepartmentLink(departmentLink);
    sportsmanObjects.setSportsmanHeader(sportsName);
    sportsmanObjects.setSportsmanName(sportsName);
    sportsmanObjects.setSportsmanLink(window.location.href);
    
    sportsmanObjects.setInfoId(     sportsmanInfo.getId());
    sportsmanObjects.setInfoName(   sportsmanInfo.getName());
    sportsmanObjects.setInfoSurname(sportsmanInfo.getSurname());
    sportsmanObjects.setInfoSex(    sportsmanInfo.getSex());
    sportsmanObjects.setInfoAge(    sportsmanInfo.getAge());
    sportsmanObjects.setInfoWeight( sportsmanInfo.getWeight());
    sportsmanObjects.setInfoQual(   sportsmanInfo.getQualification());
    sportsmanObjects.setInfoTeam(   sportsmanInfo.getTeam());

    /*
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
    */
    /*--------------------------------Adding groups params--------------------------------------------------------------------------------*/
    /*competitionParams.get("Groups").forEach(compGroup => {
        if(params.get("Groups").find( memberGroup => memberGroup.get("id") == compGroup.get("id")) == undefined){
            competitionListGroupsAdd(compGroup);
        }
    });*/
}

function setBtnActions(){
    onClick(sportsmanObjects.getEditBtn(), sportsmanInfoEdit);
}

fillPageInfo();
setBtnActions();

showAllIfAdmin();
languageSwitchingOn();