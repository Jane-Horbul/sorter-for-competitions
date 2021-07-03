import {getLinkParams} from "./common.js"
import {showAllIfAdmin} from "./common.js"
import {languageSwitchingOn} from "./common.js"
import {insertElement} from "./common.js"

import {sendGetDepartment} from "./communication.js"
import {sendAddQualification} from "./communication.js"
import {sendDeleteQualification} from "./communication.js"
import {sendAddDiscipline} from "./communication.js"
import {sendDeleteDiscipline} from "./communication.js"
import {sendDepartmentInfo} from "./communication.js"

var pageParams = getLinkParams(location.search);
const department = sendGetDepartment();

console.log(department);
/* ------------------- QUALIFICATIONS ----------------------------*/
var qualificationsMap = new Map();

function qualificationElementAddToPage(value, name){
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
    var qualTable =  document.getElementById("qualification-table")
    for(var i = 1; i < qualTable.rows.length; i++){
        if(qualTable.rows[i].cells[0].innerHTML.localeCompare(value) == 0) return;
        if(qualTable.rows[i].cells[1].innerHTML.localeCompare(name) == 0) return;
    }
    qualificationElementAddToPage(value, name);
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

function competitionElementCreate(competition){
    if(competition.get("id") == undefined) return "";
    
    var compParams = new Map();
    compParams.set("#competition-link", "competition?clist=" + pageParams.get("clist") + "&cid=" + competition.get("id"));
    compParams.set("#competition-name", competition.get("name"));
    compParams.set("#competition-desc", competition.get("description"));

    return insertElement("competition-template", compParams);
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
    var list = document.getElementById("competitions-list");
    department.get("Competitions").forEach(competition => {
        list.prepend(competitionElementCreate(competition));
    });

    department.get("Divisions").forEach(div => divisionElementAddToPage(div));

    for (var [key, value] of department.get("Qualifications")) {
        qualificationElementAddToPage(key, value);
        qualificationsMap.set(key, value);
    }
    document.getElementById("department-name").innerHTML = department.get("Name");
    document.getElementById("department-name-set").innerHTML = department.get("Name");
    document.getElementById("department-id").innerHTML = department.get("Id");
}

function setActions(){
    document.getElementById("qual-add-btn").addEventListener("click", toogleQualificationAdding, false);
    document.getElementById("div-add-btn").addEventListener("click", toogleDivisionAdding, false);
    document.getElementById("department-edit-btn").addEventListener("click", editInfo, false);
    
}
/* ------------------- MAIN CHUNK ----------------------------*/

showAllIfAdmin();
languageSwitchingOn();
fillPageInfo();
setActions();