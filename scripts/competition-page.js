
import {sendRequest} from "./common.js"
import {isNumber} from "./common.js"

var qualificationsMap = new Map();
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
    var boundary = String(Math.random()).slice(2);
    var body = ['\r\n'];
    var xhr = new XMLHttpRequest();

    body.push('Content-Disposition: form-data; name="' + name + '"\r\n\r\n' +  value + '\r\n');
    body.push('Content-Disposition: form-data; name="id"\r\n\r\n' +  location.search.split("?")[1] + '\r\n');
    body = body.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';

    xhr.open('POST', '/competition-edition', true);
    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

    xhr.onreadystatechange = function() { if (this.readyState != 4) return; }
    xhr.send(body);
}

/* ------------------- QUALIFICATIONS ----------------------------*/

function qualificationElementCreate(value, name){
    if(value == "") return "";
    var template = document.getElementById("qualification-template").content.cloneNode(true);
    template.getElementById("qual-value").innerHTML = value;
    template.getElementById("qual-name").innerHTML = name;
    template.getElementById("qual-dell-btn").addEventListener("click", function(){deleteQualification(value)}, false);
    return template;
}

function toogleQualificationAdding(){
    var row = document.getElementById("qualification-add-field");
    if(row == null){
        var row = document.getElementById("qualification-table").insertRow(1);
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
    var qualTable = document.getElementById("qualification-table")
    for(var i = 1; i < qualTable.rows.length; i++){
        if(qualTable.rows[i].cells[0].innerHTML.localeCompare(value) == 0) return;
        if(qualTable.rows[i].cells[1].innerHTML.localeCompare(name) == 0) return;
    }
    qualTable.append(qualificationElementCreate(value, name));
    toogleQualificationAdding();
    sendNotification("qualification-add", value + " - " + name);
}

function deleteQualification(value){
    var qualTable = document.getElementById("qualification-table")
    for(var i = 1; i < qualTable.rows.length; i++){
        if(qualTable.rows[i].cells[0].innerHTML.localeCompare(String(value)) == 0){
            qualTable.rows[i].remove();
            sendNotification("qualification-delete", value);
            return;
        }
    }
}

/* ------------------- DIVISIONS ----------------------------*/

function divisionElementCreate(division){
    if(division.localeCompare("\r\n") == 0) return "";
    var template = document.getElementById("division-template").content.cloneNode(true);
    template.getElementById("div-name").innerHTML = division;
    template.getElementById("div-dell-btn").addEventListener("click", function(){deleteDivision(division)}, false);
    return template;
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
    divTable.append(divisionElementCreate(div));
    sendNotification("division-add", div);
}

function deleteDivision(div){
    for(var i = 1; i < divTable.rows.length; i++){
        if(divTable.rows[i].cells[0].innerHTML.localeCompare(div) == 0){
            divTable.rows[i].remove();
            sendNotification("division-delete", div);
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
    return template;
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
    return template;
}

function fillPageInfo(params){
    var divTable = document.getElementById("divisions-table");
    var qTable = document.getElementById("qualification-table");
    var membersTable = document.getElementById("members-table");
    var groupsTable = document.getElementById("groups-table");

    for (var [key, value] of params.get("Qualifications")) {
        qTable.append(qualificationElementCreate(key, value));
        qualificationsMap.set(key, value);
    }
    document.getElementById("competition-name").innerHTML = params.get("Name");
    params.get("Divisions").forEach(div => divTable.append(divisionElementCreate(div)));
    params.get("Members").forEach(mem => membersTable.append(memberElementCreate(mem)));
    params.get("Groups").forEach(gr =>   groupsTable.append(groupElementCreate(gr)));
}

function refreshPairs(){
    var newParams = sendRequest("/refresh-group-pairs?" + "id=" + location.search.split("?")[1]);
    var groupsTable = document.getElementById("groups-table");
    groupsTable.delete
    while(groupsTable.rows.length > 2){
        groupsTable.deleteRow(groupsTable.rows.length - 1);
    }
    newParams.get("Groups").forEach(gr =>   groupsTable.append(groupElementCreate(gr)));
}

function setBtnActions(){
    document.getElementById("qual-add-btn").addEventListener("click", toogleQualificationAdding, false);
    document.getElementById("div-add-btn").addEventListener("click", toogleDivisionAdding, false);
    document.getElementById("form-pairs-btn").addEventListener("click", refreshPairs, false);

    document.getElementById("group-add-btn").setAttribute("href", window.location.href + "/group-form");
    document.getElementById("member-add-btn").setAttribute("href", window.location.href + "/member-form");

    
}


fillPageInfo(sendRequest("/competition-get?" + "id=" + location.search.split("?")[1]));
setBtnActions();
