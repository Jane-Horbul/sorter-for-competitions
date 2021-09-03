import {getLinkParams, onClick, showAllIfAdmin, languageSwitchingOn, createPageItem, isEmptyString, isNumber} from "./common.js"
import {ops, server} from "./communication.js"

var pageParams = getLinkParams(location.search);
const department = server.getDepartment();
console.log(department);

/* ------------------- QUALIFICATIONS ----------------------------*/
var qualificationsMap = new Map();

const qualificationObjects = {
    getNameInput()                  { return document.getElementById("add-qualification-name").value;},
    getValueInput()                 { return document.getElementById("add-qualification-value").value;},
    getTable()                      { return document.getElementById("qualification-table");},
    getTemplate()                   { return document.getElementById("qualification-template");},
    getDelBtn(item)                 { return item.getElementById("qual-dell-btn");},
    getAddBtn()                     { return document.getElementById("qual-add-btn");},

    getPlaceholders(name, value)    { return {
                                            "#qualification-value": value,
                                            "#qualification-name":  name,
                                            };
                                    },
    getAddingRow()                  { return document.getElementById("qualification-add-row");},
    setAddingRowId(row)             { return row.setAttribute("id", "qualification-add-row");},
    getAddingRowOkBtn()             { return document.getElementById("qual-ok-btn");},
    getAddingRowTemplate()          { return document.getElementById("qualification-adding-template");},

    getName(value)                  { return qualificationsMap.get(value) == undefined ? value : qualificationsMap.get(value)},

    nameExistAlert()                     {alert("Qualification name already exists!");},
    valueExistAlert()                    {alert("Qualification value already exists!");},
    valueFormatAlert()                   {alert("Incorrect qualification value! Please, enter the number.");},
}

function qualificationElementAddToPage(name, value){
    if(!isEmptyString(value)){
        var template = qualificationObjects.getTemplate();
        var placeholders = qualificationObjects.getPlaceholders(name, value);
        var newItem = createPageItem(template, placeholders);
        onClick(qualificationObjects.getDelBtn(newItem), function(){deleteQualification(value)});
        qualificationObjects.getTable().append(newItem); 

        template = sportsmanObjects.getQualTemplate();
        placeholders = sportsmanObjects.getQualPlaceholders(name, value)
        sportsmanObjects.getQualList().append(createPageItem(template, placeholders));
    }
}

function addQualification(){
    var value = qualificationObjects.getValueInput();
    var name = qualificationObjects.getNameInput();
    var qTable =  qualificationObjects.getTable();

    if(!isNumber(value)){
        qualificationObjects.valueFormatAlert();
        return;
    }
    for(var i = 1; i < qTable.rows.length; i++){
        if(value == qTable.rows[i].cells[0].innerHTML){
            qualificationObjects.valueExistAlert();
            return; 
        } 
        if(name == qTable.rows[i].cells[1].innerHTML){
            qualificationObjects.nameExistAlert();
            return;
        }
    }
    qualificationElementAddToPage(name, value);
    toogleQualificationAdding();
    server.addQualification(value, name);
}

function toogleQualificationAdding(){
    var addingRow = qualificationObjects.getAddingRow();
    if(addingRow == null){
        var template = qualificationObjects.getAddingRowTemplate();
        addingRow =  qualificationObjects.getTable().insertRow(1);
        addingRow.append(template.cloneNode(true).content);
        qualificationObjects.setAddingRowId(addingRow);
        onClick(qualificationObjects.getAddingRowOkBtn(), addQualification);
    } else {
        addingRow.remove();
    }
}

function deleteQualification(value){
    var qualTable =  qualificationObjects.getTable();
    for(var i = 1; i < qualTable.rows.length; i++){
        if(qualTable.rows[i].cells[0].innerHTML.localeCompare(String(value)) == 0){
            qualTable.rows[i].remove();
            server.deleteQualification(value);
            return;
        }
    }
}

/* ------------------- DIVISIONS ----------------------------*/

const disciplinesObjects = {
    getDisciplineInput()            { return document.getElementById("add-division").value;},
    getTable()                      { return document.getElementById("divisions-table");},
    getTemplate()                   { return document.getElementById("division-template");},
    getDelBtn(item)                 { return item.getElementById("div-dell-btn");},
    getAddBtn()                     { return document.getElementById("div-add-btn")},
    getPlaceholders(div)            { return {"#division-name": div};},

    getAddingRow()                  { return document.getElementById("division-add-field");},
    setAddingRowId(row)             { return row.setAttribute("id", "division-add-field");},
    getAddingRowOkBtn()             { return document.getElementById("div-ok-btn");},
    getAddingRowTemplate()          { return document.getElementById("division-adding-template");},
}

function disciplineAddToPage(division){
    if(!isEmptyString(division))
    {
        var template = disciplinesObjects.getTemplate();
        var placeholders = disciplinesObjects.getPlaceholders(division);
        var newItem = createPageItem(template, placeholders);
        onClick(disciplinesObjects.getDelBtn(newItem), function(){deleteDiscipline(division)});
        disciplinesObjects.getTable().append(newItem);
    }
}

function toogleDisciplineAdding(){
    var addingRow = disciplinesObjects.getAddingRow();
    if(addingRow == null){
        var template = disciplinesObjects.getAddingRowTemplate();

        addingRow = disciplinesObjects.getTable().insertRow(1);
        addingRow.append(template.cloneNode(true).content);
        disciplinesObjects.setAddingRowId(addingRow);
        onClick(disciplinesObjects.getAddingRowOkBtn(), addDiscipline);
    } else {
        addingRow.remove();
    }
}

function addDiscipline(){
    var divTable = disciplinesObjects.getTable();
    var div = disciplinesObjects.getDisciplineInput();

    for(var i = 1; i < divTable.rows.length; i++){
        console.log(i);
        if(divTable.rows[i].cells[0].innerHTML.localeCompare(div) == 0) return;
    }
    toogleDisciplineAdding();
    disciplineAddToPage(div);
    server.addDiscipline(div);
}

function deleteDiscipline(div){
    var divTable = disciplinesObjects.getTable();
    for(var i = 1; i < divTable.rows.length; i++){
        if(divTable.rows[i].cells[0].innerHTML.localeCompare(div) == 0){
            divTable.rows[i].remove();
            server.deleteDiscipline(div);
            return;
        }
    }
}



/* ------------------- COMPETITIONS ----------------------------*/
const competitionObjects = {
    getNameInput()          { return document.getElementById("competition-name-input").value;},
    getDescriptionInput()   { return document.getElementById("competition-desc-input").value;},
    getTable()              { return document.getElementById("competitions-list");},
    getTemplate()           { return document.getElementById("competition-template");},
    getAddBtn()             { return document.getElementById("send-competition-form-btn");},

    getPlaceholders(comp)   { return {
                                    "#departmentId":        ops.department.getId(department),
                                    "#competitionId":       ops.competition.getId(comp),
                                    "#competition-name":    ops.competition.getName(comp),
                                    "#competition-desc":    ops.competition.getDescription(comp)
                                    };
                            }
}

function competitionPageElementAdd(competition){
    if(ops.competition.getId(competition) != undefined){
        var template = competitionObjects.getTemplate();
        var placeholders = competitionObjects.getPlaceholders(competition);
        competitionObjects.getTable().prepend(createPageItem(template, placeholders)); 
    }
}

function sendCompetitionForm() {
    var name = competitionObjects.getNameInput();
    var description = competitionObjects.getDescriptionInput();
    server.addCompetition(name, description);
}

/* ------------------- SPORTSMANS ----------------------------*/
const sportsmanObjects = {
    getNameInput()              { return document.getElementById("new-member-name").value;},
    getSurnameInput()           { return document.getElementById("new-member-surname").value;},
    getAgeInput()               { return document.getElementById("new-member-age").value;},
    getWeightInput()            { return document.getElementById("new-member-weight").value;},
    getSexInput()               { return document.getElementById("new-member-sex-male").checked ? "male" : "female";},
    getTeamInput()              { return document.getElementById("new-member-team").value;},
    getQualificationInput()     { return document.getElementById("new-member-qualifications").value;},
    
    getQualList()               { return document.getElementById("new-member-qualifications");},
    getQualTemplate()           { return document.getElementById("new-member-qual-temp");},
    getQualPlaceholders(n, v)   { return {
                                        "#sports-qual-value":      v,
                                        "#sports-qual-name":       n
                                        };
                                },

    getTable()                  { return document.getElementById("members-table");},
    getTemplate()               { return document.getElementById("member-template");},
    getAddBtn()                 { return document.getElementById("member-form-send-btn");},

    getPlaceholders(sp)         { return {
                                        "#sp-surname":      ops.sportsman.getSurname(sp),
                                        "#sp-name":         ops.sportsman.getName(sp),
                                        "#sp-age":          ops.sportsman.getAge(sp),
                                        "#sp-weight":       ops.sportsman.getWeight(sp),
                                        "#sp-sex":          ops.sportsman.getSex(sp),
                                        "#sp-team":         ops.sportsman.getTeam(sp),
                                        "#sp-qual":         qualificationObjects.getName(ops.sportsman.getQualification(sp)),
                                        "#sportsman-link":  window.location.href + ops.sportsman.getLinkFromDepartament(sp)
                                    };
                                },

    nameAlert()                 {alert("Empty member name!");},
    surnameAlert()              {alert("Empty member surname!");},
    weightAlert()               {alert("Bad weight value. Enter number only.");},
    ageAlert()                  {alert("Bad Date of Birth value. Enter it in format dd.mm.yy");},
}

function sportsmanPageElementAdd(sp){
    if(ops.sportsman.getId(sp) != undefined){
        var template = sportsmanObjects.getTemplate();
        var placeholders = sportsmanObjects.getPlaceholders(sp);
        sportsmanObjects.getTable().append(createPageItem(template, placeholders)); 
    }
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

function isSportsmansParamsOk() {
    var name    = sportsmanObjects.getNameInput();
    var surname = sportsmanObjects.getSurnameInput();
    var weight  = sportsmanObjects.getWeightInput();
    var age     = sportsmanObjects.getAgeInput();

    if(isEmptyString(name)){
        sportsmanObjects.nameAlert();
        return false;
    } else if(isEmptyString(surname)){
        sportsmanObjects.surnameAlert();
        return false;
    } else if(!isNumber(weight)){
        sportsmanObjects.weightAlert();
        return false;
    } else if(!dateValidate(age)){
        sportsmanObjects.ageAlert();
        return false;
    }
    return true;
}

function sendSportsmanForm() {
    if(isSportsmansParamsOk()) {
        server.addDepartmentSportsman(sportsmanObjects.getNameInput(), 
                                sportsmanObjects.getSurnameInput(), 
                                sportsmanObjects.getWeightInput(), 
                                sportsmanObjects.getAgeInput(), 
                                sportsmanObjects.getTeamInput(), 
                                sportsmanObjects.getSexInput(), 
                                sportsmanObjects.getQualificationInput());
    }
    
}

/* ------------------- DEPARTMENT ----------------------------*/
const departamentObjects = {
    getNameInput()      { return document.getElementById("name-info-input");},
    createNameInput()   { var res = document.createElement("input"); res.setAttribute("id", "name-info-input"); return res;},
    getNamePlace()      { return document.getElementById("department-name-set");},
    getEditBtn()        { return document.getElementById("department-edit-btn");},

    setPageName(name)       {document.getElementById("department-name").innerHTML = name;},
    setName(name)           {document.getElementById("department-name-set").innerHTML = name;},
    setId(id)               {document.getElementById("department-id").innerHTML = id;}
}


function departamentEdit(){
    var setLine = departamentObjects.getNameInput();
    var namePlace = departamentObjects.getNamePlace();
    if(setLine == null){
        setLine = departamentObjects.createNameInput();
        setLine.value = ops.department.getName(department);
        namePlace.innerHTML = "";
        namePlace.appendChild(setLine);
    } else {
        server.editDepartment(setLine.value);
    }
}

function fillPageInfo(){
    var departamentName = ops.department.getName(department);
    var competitions = ops.department.getCompetitions(department);
    var disciplines = ops.department.getDisciplines(department);
    var qualifications = ops.department.getQualifications(department);
    var sportsmans = ops.department.getSportsmans(department);

    departamentObjects.setPageName(departamentName);
    departamentObjects.setName(departamentName);
    departamentObjects.setId(ops.department.getId(department));

    for (var [value, name] of qualifications) {
        qualificationElementAddToPage(name, value);
        qualificationsMap.set(value, name);
    }
    disciplines.forEach( disciplinne => disciplineAddToPage(disciplinne));
    competitions.forEach(competition => competitionPageElementAdd(competition));
    sportsmans.forEach(  sportsman   => sportsmanPageElementAdd(sportsman));
}

function setActions(){
    onClick(qualificationObjects.getAddBtn(),   toogleQualificationAdding);
    onClick(disciplinesObjects.getAddBtn(),     toogleDisciplineAdding);
    onClick(competitionObjects.getAddBtn(),     sendCompetitionForm);
    onClick(departamentObjects.getEditBtn(),    departamentEdit);
    onClick(sportsmanObjects.getAddBtn(),       sendSportsmanForm);
}
/* ------------------- MAIN CHUNK ----------------------------*/

showAllIfAdmin();
languageSwitchingOn();
fillPageInfo();
setActions();
  