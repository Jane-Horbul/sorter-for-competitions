import {getLinkParams, 
    onClick, 
    showShadows, 
    languageSwitchingOn, 
    createPageItem,
    checkers, 
    prepareTabs, 
    unhideSubelements} from "./common.js"
import {ops, server} from "./communication.js"
import {markup} from "./department-page-markup.js"

var pageParams = getLinkParams(location.search);
const department = server.department.get();
const client = server.access.getClient();
console.log(department);
console.log(client.getStatus());

/* ------------------- QUALIFICATIONS ----------------------------*/
var qualificationsMap = new Map();

export function getQualNameByValue(val){
    return qualificationsMap.get(val) == undefined ? val : qualificationsMap.get(val);
}

function qualificationElementAddToPage(name, value){
    if(!checkers.isEmptyString(value)){
        var template = markup.qualifications.getTemplate();
        var placeholders = markup.qualifications.getPlaceholders(name, value);
        var newItem = createPageItem(template, placeholders);
        onClick(markup.qualifications.getDelBtn(newItem), function(){deleteQualification(value)});
        if(client.isRoot() || client.isAdmin())
            unhideSubelements(newItem);
        markup.qualifications.getTable().append(newItem); 

        template = markup.sportsman.getQualTemplate();
        placeholders = markup.sportsman.getQualPlaceholders(name, value)
        markup.sportsman.getQualList().append(createPageItem(template, placeholders));
    }
}

function addQualification(){
    var value = markup.qualifications.getValueInput();
    var name = markup.qualifications.getNameInput();
    var qTable =  markup.qualifications.getTable();

    if(!checkers.isNumber(value)){
        markup.qualifications.valueFormatAlert();
        return;
    }
    for(var i = 1; i < qTable.rows.length; i++){
        if(value == qTable.rows[i].cells[0].innerHTML){
            markup.qualifications.valueExistAlert();
            return; 
        } 
        if(name == qTable.rows[i].cells[1].innerHTML){
            markup.qualifications.nameExistAlert();
            return;
        }
    }
    qualificationElementAddToPage(name, value);
    toogleQualificationAdding();
    server.department.addQualification(value, name);
}

function toogleQualificationAdding(){
    var addingRow = markup.qualifications.getAddingRow();
    if(addingRow == null){
        var template = markup.qualifications.getAddingRowTemplate();
        addingRow =  markup.qualifications.getTable().insertRow(1);
        addingRow.append(template.cloneNode(true).content);
        markup.qualifications.setAddingRowId(addingRow);
        onClick(markup.qualifications.getAddingRowOkBtn(), addQualification);
    } else {
        addingRow.remove();
    }
}

function deleteQualification(value){
    var qualTable =  markup.qualifications.getTable();
    for(var i = 1; i < qualTable.rows.length; i++){
        if(checkers.strEquals(qualTable.rows[i].cells[0].innerHTML, String(value))){
            qualTable.rows[i].remove();
            server.department.deleteQualification(value);
            return;
        }
    }
}

/* ------------------- DIVISIONS ----------------------------*/

function disciplineAddToPage(division){
    if(!checkers.isEmptyString(division))
    {
        var template = markup.discipline.getTemplate();
        var placeholders = markup.discipline.getPlaceholders(division);
        var newItem = createPageItem(template, placeholders);
        onClick(markup.discipline.getDelBtn(newItem), function(){deleteDiscipline(division)});
        if(client.isRoot() || client.isAdmin())
            unhideSubelements(newItem);
        markup.discipline.getTable().append(newItem);
    }
}

function toogleDisciplineAdding(){
    var addingRow = markup.discipline.getAddingRow();
    if(addingRow == null){
        var template = markup.discipline.getAddingRowTemplate();

        addingRow = markup.discipline.getTable().insertRow(1);
        addingRow.append(template.cloneNode(true).content);
        markup.discipline.setAddingRowId(addingRow);
        onClick(markup.discipline.getAddingRowOkBtn(), addDiscipline);
    } else {
        addingRow.remove();
    }
}

function addDiscipline(){
    var divTable = markup.discipline.getTable();
    var div = markup.discipline.getDisciplineInput();

    for(var i = 1; i < divTable.rows.length; i++){
        if(divTable.rows[i].cells[0].innerHTML.localeCompare(div) == 0) return;
    }
    toogleDisciplineAdding();
    disciplineAddToPage(div);
    server.department.addDiscipline(div);
}

function deleteDiscipline(div){
    var divTable = markup.discipline.getTable();
    for(var i = 1; i < divTable.rows.length; i++){
        if(divTable.rows[i].cells[0].innerHTML.localeCompare(div) == 0){
            divTable.rows[i].remove();
            server.department.deleteDiscipline(div);
            return;
        }
    }
}

/* ------------------- COMPETITIONS ----------------------------*/

function competitionPageElementAdd(competition){
    if(competition.getId() != undefined){
        var template = markup.competition.getTemplate();
        var placeholders = markup.competition.getPlaceholders(competition, department);
        markup.competition.getTable().prepend(createPageItem(template, placeholders)); 
    }
}

function sendCompetitionForm() {
    var cp = ops.createCompetition(undefined);
    cp.setName(markup.competition.getNameInput());
    cp.setDescription(markup.competition.getDescriptionInput());
    cp.setStartDate(markup.competition.getStartDateInput());
    cp.setEndDate(markup.competition.getEndDateInput());
    
    server.competition.create(cp);
}

/* ------------------- SPORTSMANS ----------------------------*/

function sportsmanPageElementAdd(sp){
    if(sp.getId() != undefined){
        var template = markup.sportsman.getTemplate();
        var placeholders = markup.sportsman.getPlaceholders(sp);
        markup.sportsman.getTable().append(createPageItem(template, placeholders)); 
    }
}

function isSportsmansParamsOk() {
    return (!checkers.checkName("Name", markup.sportsman.getNameInput()) 
        || !checkers.checkName("Surname", markup.sportsman.getSurnameInput())
        || !checkers.checkNumber("Weight", markup.sportsman.getWeightInput())
        || !checkers.checkDate(markup.sportsman.getAgeInput())) 
        ? false : true;
}

function sendSportsmanForm() {
    if(isSportsmansParamsOk()) {
        var sporsman = ops.createSportsman(undefined);
        sporsman.setName(markup.sportsman.getNameInput());
        sporsman.setSurname(markup.sportsman.getSurnameInput());
        sporsman.setWeight(markup.sportsman.getWeightInput());
        sporsman.setBirth(markup.sportsman.getAgeInput());
        sporsman.setTrainer(markup.sportsman.getTrainerInput());
        sporsman.setSex(markup.sportsman.getSexInput());
        sporsman.setQualification(markup.sportsman.getQualificationInput());
        server.sportsman.create(sporsman);
     
        if(checkers.strEquals(markup.sportsman.getOneMoreInput(), "no")){
            location.reload();
        } else {
            markup.sportsman.clearInputs();
        }
    }
    
}

/* ------------------- TRAINERS ----------------------------*/

function isTrainerParamsOk() {
    return (!checkers.checkName("Name", markup.trainer.getNameInput()) 
        || !checkers.checkName("Surname", markup.trainer.getSurnameInput())
        || !checkers.checkDate(markup.trainer.getAgeInput())) 
        ? false : true;
}

function sendTrainerForm() {
    if(isTrainerParamsOk()) {
        var trainer = ops.createTrainer(undefined);
        trainer.setName(   markup.trainer.getNameInput());
        trainer.setSurname(markup.trainer.getSurnameInput());
        trainer.setBirth(  markup.trainer.getAgeInput());
        trainer.setSex(    markup.trainer.getSexInput());
        trainer.setTeam(   markup.trainer.getTeamInput());
        trainer.setRegion( markup.trainer.getRegionInput());
        trainer.setEmail(  markup.trainer.getEmailInput());
        server.trainer.create(trainer);
        /*
        if(markup.sportsman.getOneMoreInput().localeCompare("no") == 0){
            location.reload();
        }*/
    }
    
}

function trainerPageElementAdd(tr){
    if(tr.getId() != undefined){
        markup.trainer.getTable().append(createPageItem(markup.trainer.getTemplate(), markup.trainer.getPlaceholders(tr)));
        markup.sportsman.getTrainersList().append(
            createPageItem(markup.sportsman.getTrainerTemplate(), markup.sportsman.getTrainerPlaceholders(tr))
            );
    }
}

/* ------------------- DEPARTMENT ----------------------------*/

function departamentEdit(){
    var setLine = markup.departament.getNameInput();
    var namePlace = markup.departament.getNamePlace();
    if(setLine == null){
        setLine = markup.departament.createNameInput();
        setLine.value = department.getName();
        namePlace.innerHTML = "";
        namePlace.appendChild(setLine);
    } else {
        server.department.edit(setLine.value);
    }
}

function fillPageInfo(){
    var departamentName = department.getName();
    var competitions    = department.getCompetitions();
    var disciplines     = department.getDisciplines();
    var qualifications  = department.getQualifications();
    var sportsmans      = department.getSportsmen();
    var trainers        = department.getTrainers();

    markup.departament.setPageName(departamentName);
    markup.departament.setName(departamentName);
    markup.departament.setId(department.getId());

    for (var [value, name] of qualifications) {
        qualificationElementAddToPage(name, value);
        qualificationsMap.set(value, name);
    }
    disciplines.forEach( disciplinne => disciplineAddToPage(disciplinne));
    competitions.forEach(competition => competitionPageElementAdd(competition));
    sportsmans.forEach( sportsman   => sportsmanPageElementAdd(sportsman));
    trainers.forEach( trainer   => trainerPageElementAdd(trainer));
}

function setActions(){
    onClick(markup.login.getLoginBtn(),         function(){server.access.login(markup.login.getLogin(), markup.login.getPass())});
    if(client.isAdmin() || client.isRoot){
        onClick(markup.qualifications.getAddBtn(),  toogleQualificationAdding);
        onClick(markup.discipline.getAddBtn(),      toogleDisciplineAdding);
        onClick(markup.competition.getAddBtn(),     sendCompetitionForm);
        onClick(markup.departament.getEditBtn(),    departamentEdit);
        onClick(markup.sportsman.getAddBtn(),       sendSportsmanForm); 
        onClick(markup.trainer.getAddBtn(),       sendTrainerForm);
    } else if(client.isTrainer()){
        onClick(markup.sportsman.getAddBtn(),       sendSportsmanForm); 
    }
};

/* ------------------- MAIN CHUNK ----------------------------*/
prepareTabs();
fillPageInfo();
setActions();
showShadows(client);
languageSwitchingOn();