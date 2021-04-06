import {isNumber} from "./common.js"
import {isEmptyString} from "./common.js"
import {sendForm} from "./common.js"
import {languageSwitchingOn} from "./common.js"

function createDivRow(division){
    var template = document.getElementById("div-row-template").content.cloneNode(true);
    template.getElementById("div-name").innerHTML = division;
    template.getElementById("div-dell-btn").addEventListener("click", function(){deleteDivision(division)}, false);
    return template;
}

function addDivision() {
    var el = document.getElementById("division-name");
    var table = document.getElementById("divisions-table");
    if(el.value.localeCompare("") == 0) return;
    for(var i = 2; i < table.rows.length; i++) {
        if(table.rows[i].cells[0].innerHTML.localeCompare(el.value) == 0) return;
    }
    table.append(createDivRow(el.value));
    el.value= "";
}

function deleteDivision(division){
    var table = document.getElementById("divisions-table");
    for(var i = 2; i < table.rows.length; i++) {
        if(table.rows[i].cells[0].innerHTML.localeCompare(division) == 0){
            table.deleteRow(i);
            return;
        }
    }
}

function createQualRow(value, name){
    var template = document.getElementById("qual-row-template").content.cloneNode(true);
    template.getElementById("qual-name").innerHTML = name;
    template.getElementById("qual-value").innerHTML = value;
    template.getElementById("qual-dell-btn").addEventListener("click", function(){deleteQualification(value)}, false);
    return template;
}

function addQualification() {
    var qValue = document.getElementById("qualification-value");
    var qName = document.getElementById("qualification-name");
    var table = document.getElementById("qualifications-table");

    if(!isNumber(qValue.value) || isEmptyString(qName.value)) return;
    for(var i = 2; i < table.rows.length; i++) {
        if(Number(table.rows[i].cells[0].innerHTML) == Number(qValue.value)) return;
        if(table.rows[i].cells[1].innerHTML.localeCompare(qName.value) == 0) return;
    }
    table.append(createQualRow(qValue.value, qName.value));
    qValue.value = "";
    qName.value = "";
}

function deleteQualification(qValue){
    var table = document.getElementById("qualifications-table");
    for(var i = 3; i < table.rows.length; i++) {
        if(table.rows[i].cells[0].innerHTML.localeCompare(qValue) == 0){
            table.deleteRow(i);
            return;
        }
    }
}

function sendCompetitionForm() {
    var paramsMap = new Map();
    var divisionsTable = document.getElementById("divisions-table");
    var qualificationsTable = document.getElementById("qualifications-table");
    var divisionsStr = "";
    var qualificationsStr = "";

    for(var i = 2; i < divisionsTable.rows.length; i++) {
        divisionsStr += divisionsTable.rows[i].cells[0].innerHTML + ", ";
    }
    for(var i = 3; i < qualificationsTable.rows.length; i++) {
        qualificationsStr += qualificationsTable.rows[i].cells[0].innerHTML + " - " + qualificationsTable.rows[i].cells[1].innerHTML + ", ";
    }

    paramsMap.set("competition-name", document.getElementById("competition-name").value);
    paramsMap.set("description", document.getElementById("description").value);
    paramsMap.set("divisions", divisionsStr);
    paramsMap.set("qualifications", qualificationsStr);

    sendForm('/competition-form', paramsMap);
}

function setBtnActions(){
    document.getElementById("qualification-value").addEventListener("keydown", function(event){
        if (event.defaultPrevented) return;
        if ("Enter" == event.key){
            addQualification();
            event.preventDefault();
        } 
      }, true);

    document.getElementById("qualification-name").addEventListener("keydown", function(event){
        if (event.defaultPrevented) return;
        if ("Enter" == event.key){
            addQualification();
            event.preventDefault();
        } 
      }, true);

      document.getElementById("division-name").addEventListener("keydown", function(event){
        if (event.defaultPrevented) return;
        if ("Enter" == event.key){
            addDivision();
            event.preventDefault();
        } 
      }, true);
    
    document.getElementById("add-qual-btn").addEventListener("click", addQualification, false);
    document.getElementById("add-div-btn").addEventListener("click", addDivision, false);
    document.getElementById("send-form-btn").addEventListener("click", sendCompetitionForm, false);
}

setBtnActions();
languageSwitchingOn();