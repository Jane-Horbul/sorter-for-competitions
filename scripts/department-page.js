import {getLinkParams} from "./common.js"
import {showAllIfAdmin} from "./common.js"
import {languageSwitchingOn} from "./common.js"
import {insertElement} from "./common.js"
import {isEmptyString} from "./common.js"
import {isNumber} from "./common.js"

import {sendGetDepartment} from "./communication.js"
import {sendAddQualification} from "./communication.js"
import {sendDeleteQualification} from "./communication.js"
import {sendAddDiscipline} from "./communication.js"
import {sendDeleteDiscipline} from "./communication.js"
import {sendDepartmentInfo} from "./communication.js"
import {sendDepartmentSportsmen} from "./communication.js"
import {sendDepartmentCompetition} from "./communication.js"

var pageParams = getLinkParams(location.search);
const department = sendGetDepartment();

console.log(department);
/* ------------------- QUALIFICATIONS ----------------------------*/
var qualificationsMap = new Map();

function qualificationElementAddToPage(name, value){
    if(value == "") return "";

    var qTable =  document.getElementById("qualification-table");
    var qTableTemplate = document.getElementById("qualification-template").content.cloneNode(true);

    qTableTemplate.getElementById("qual-value").innerHTML = value;
    qTableTemplate.getElementById("qual-name").innerHTML = name;
    qTableTemplate.getElementById("qual-dell-btn").addEventListener("click", function(){deleteQualification(value)}, false);
    qTable.append(qTableTemplate);
}


function addQualification(valueId, nameId){
    var value = document.getElementById(valueId).value;
    var name = document.getElementById(nameId).value;
    if(!isNumber(value)){
        alert("Incorrect qualification value! Please, enter the number.");
        return;
    }

    var qualTable =  document.getElementById("qualification-table")
    for(var i = 1; i < qualTable.rows.length; i++){
        if(qualTable.rows[i].cells[0].innerHTML.localeCompare(value) == 0){
            alert("Qualification value already exists!");
            return; 
        } 
        if(qualTable.rows[i].cells[1].innerHTML.localeCompare(name) == 0){
            alert("Qualification name already exists!");
            return;
        }
    }
    qualificationElementAddToPage(name, value);
    toogleQualificationAdding();
    sendAddQualification(value, name);
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

function deleteQualification(value){
    var qualTable =  document.getElementById("qualification-table")
    for(var i = 1; i < qualTable.rows.length; i++){
        if(qualTable.rows[i].cells[0].innerHTML.localeCompare(String(value)) == 0){
            qualTable.rows[i].remove();
            sendDeleteQualification(value);
            return;
        }
    }
    
}

/* ------------------- DIVISIONS ----------------------------*/
var divisionsArray = new Array(0);

function divisionElementAddToPage(division){
    if(division.localeCompare("\r\n") == 0) return "";
    divisionsArray.push(division);

    var divTable = document.getElementById("divisions-table");
    var divTableTemplate = document.getElementById("division-template").content.cloneNode(true);
    divTableTemplate.getElementById("div-name").innerHTML = division;
    divTableTemplate.getElementById("div-dell-btn").addEventListener("click", function(){deleteDivision(division)}, false);
    divTable.append(divTableTemplate);
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
    sendAddDiscipline(div);
}

function deleteDivision(div){
    var divTable = document.getElementById("divisions-table");
    for(var i = 1; i < divTable.rows.length; i++){
        if(divTable.rows[i].cells[0].innerHTML.localeCompare(div) == 0){
            divTable.rows[i].remove();
            sendDeleteDiscipline(div);
            return;
        } 
    }
}



/* ------------------- COMPETITIONS ----------------------------*/
const competitionForm = {
    getName()          { return document.getElementById("competition-name-input").value;},
    getDescription()   { return document.getElementById("competition-desc-input").value;}
}

const compItem = {
    getTable()     { return document.getElementById("competitions-list");},
    getTemplate()  { return document.getElementById("competition-template")},
    phDid:      "#departmentId",
    phCid:      "#competitionId",
    phName:     "#competition-name",
    phDesc:     "#competition-desc"
}

function competitionPageElementAdd(competition){
    if(competition.get("id") == undefined) return "";
    var compParams = new Map();
    compParams.set(compItem.phDid,  department.get("Id"));
    compParams.set(compItem.phCid,  competition.get("id"));
    compParams.set(compItem.phName, competition.get("name"));
    compParams.set(compItem.phDesc, competition.get("description"));

    compItem.getTable().prepend(insertElement(compItem.getTemplate(), compParams));
}

function sendCompetitionForm() {
    var name = competitionForm.getName();
    var description = competitionForm.getDescription();
    sendDepartmentCompetition(name, description);
}

/* ------------------- SPORTSMENS ----------------------------*/
var sportsmenForm = new Map();
sportsmenForm.set( "name",           document.getElementById("new-member-name"));
sportsmenForm.set( "surname",        document.getElementById("new-member-surname"));
sportsmenForm.set( "age",            document.getElementById("new-member-age"));
sportsmenForm.set( "weight",         document.getElementById("new-member-weight"));
sportsmenForm.set( "is_male",        document.getElementById("new-member-sex-male"));
sportsmenForm.set( "team",           document.getElementById("new-member-team"));
sportsmenForm.set( "qualification",  document.getElementById("new-member-qualifications"));

function memberElementCreate(member){
    if(member.get("id") == undefined) return "";
    var template = document.getElementById("member-template").content.cloneNode(true);
    var qualName = qualificationsMap.get(member.get("qualification"))
    if(qualName == undefined)
        qualName = member.get("qualification")

    template.getElementById("member-name").innerHTML = member.get("name"); 
    template.getElementById("member-surname").innerHTML = member.get("surname"); 
    template.getElementById("member-age").innerHTML = member.get("birth");
    template.getElementById("member-weight").innerHTML = member.get("weight");
    template.getElementById("member-sex").innerHTML = member.get("sex");
    template.getElementById("member-team").innerHTML = member.get("team");
    template.getElementById("member-qual").innerHTML = qualName;

    template.getElementById("member-row").setAttribute("onclick", "window.location.href='"
                                    + window.location.href + "/member?mid=" + member.get("id") + "'; return false");
    return template;
}

function addQulificationListItem(name, value){
    if((name == "") || (value == "")) return;
    var qList =  document.getElementById("new-member-qualifications");
    var itemTemplate = document.getElementById("new-member-qual-temp").content.cloneNode(true);

    itemTemplate.getElementById("new-member-qual-item").innerHTML = name;
    itemTemplate.getElementById("new-member-qual-item").value = value;
    qList.append(itemTemplate);
}

function dateValidate(date){
    var dt = date.split(".");
    if(dt.length < 3) return false;
    dt[1] -= 1;

    var d = new Date(dt[2], dt[1], dt[0]);
    if ((d.getFullYear() == dt[2]) && (d.getMonth() == dt[1]) && (d.getDate() == dt[0]))
        return true;
    return false;
}

function isMemberParamsOk() {
    var name = sportsmenForm.get("name").value;
    var surname = sportsmenForm.get("surname").value;
    var weight = sportsmenForm.get("weight").value;
    var age = sportsmenForm.get("age").value;

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
    if(!dateValidate(age)){
        alert("Bad Date of Birth value. Enter it in format dd.mm.yy");
        return false;
    }
    return true;
}

function sendSportsmenForm() {
    if(!isMemberParamsOk()) return;
    var name = sportsmenForm.get("name").value;
    var surname = sportsmenForm.get("surname").value;
    var weight = sportsmenForm.get("weight").value;
    var age = sportsmenForm.get("age").value;
    var team = sportsmenForm.get("team").value;
    var sex = sportsmenForm.get("is_male").checked ? "male" : "female";
    var qual = sportsmenForm.get("qualification").value;
    sendDepartmentSportsmen(name, surname, weight, age, team, sex, qual);
}

/* ------------------- COMMON ----------------------------*/
function editInfo(){
    var nameInput = document.getElementById("name-info-input");
    if(nameInput == null){
        nameInput = document.createElement("input");
        nameInput.setAttribute("id", "name-info-input");
        nameInput.value = department.get("Name");
        var setName = document.getElementById("department-name-set");
        setName.innerHTML = "";
        setName.appendChild(nameInput);
    } else{
        sendDepartmentInfo(nameInput.value);
    }
}

function fillPageInfo(){
    var sportsTable = document.getElementById("members-table");
    department.get("Competitions").forEach(competition => {
        competitionPageElementAdd(competition);
    });

    department.get("Divisions").forEach(div => divisionElementAddToPage(div));

    for (var [value, name] of department.get("Qualifications")) {
        qualificationElementAddToPage(name, value);
        addQulificationListItem(name, value);
        qualificationsMap.set(value, name);
    }
    document.getElementById("department-name").innerHTML = department.get("Name");
    document.getElementById("department-name-set").innerHTML = department.get("Name");
    document.getElementById("department-id").innerHTML = department.get("Id");
    
    department.get("Sportsmens").forEach(sp => sportsTable.append(memberElementCreate(sp)));
}

function setActions(){
    document.getElementById("qual-add-btn").addEventListener("click", toogleQualificationAdding, false);
    document.getElementById("div-add-btn").addEventListener("click", toogleDivisionAdding, false);
    document.getElementById("department-edit-btn").addEventListener("click", editInfo, false);
    document.getElementById("member-form-send-btn").addEventListener("click", sendSportsmenForm, false);
    document.getElementById("send-competition-form-btn").addEventListener("click", sendCompetitionForm, false);
}
/* ------------------- MAIN CHUNK ----------------------------*/

showAllIfAdmin();
languageSwitchingOn();
fillPageInfo();
setActions();
  