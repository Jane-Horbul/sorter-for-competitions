
import {isNumber, 
    isEmptyString, 
    getLinkParams, 
    onClick, 
    showShadows, 
    languageSwitchingOn, 
    createPageItem, 
    prepareTabs} from "./common.js"
import {ops, server} from "./communication.js"
import { markup } from "./competition-page-markup.js";

var client = server.access.getClient();
const page = {
    cid: getLinkParams(location.search).get("cid")
}
const department        = server.department.get();
var competition         = server.competition.get(page.cid);
const qualificationsMap = department.getQualifications();
const disciplines       = department.getDisciplines();
const departmentLink    = window.location.href.substr(0, window.location.href.lastIndexOf("/"));

var departamentSportsmans   = new Array(0);
var sportsmansAddList       = new Array(0);


department.getSportsmans().forEach(sp => { departamentSportsmans.push(sp);});

console.log(competition);
console.log(department);

/* ------------------- SPORTSMANS ----------------------------*/
function excludeDepSportsman(sp){
    for(var i = 0; i < departamentSportsmans.length; i++){
        if(sp.getId() == departamentSportsmans[i].getId()){
            departamentSportsmans.splice(i, 1);
            return;
        }
    }
}

function sportsmanPageElementAdd(sp){
    if(sp.getId() != undefined){
        excludeDepSportsman(sp);
        var template = markup.sportsmen.getTemplate();
        var placeholders = markup.sportsmen.getPlaceholders(sp, departmentLink);
        var newItem = createPageItem(template, placeholders);
        markup.sportsmen.getTable().append(newItem); 
    }
}

function findRowIndxById(table, id){
    for(var i = 1; i < table.rows.length; i++){
        if(table.rows[i].id == id){
            return i;
        }
    }
    return 0;
}

function sportsmanAddingSelect(sid){
    var table = markup.sportsmen.getAddingTable();
    var addingRow = markup.sportsmen.getAddingRow(sid);
    var rowIndx = findRowIndxById(table, markup.sportsmen.getAddSportsRowId(sid)) + 1;
    var sp = departamentSportsmans.find( curSp => curSp.getId() == sid);
    
    if(addingRow == undefined) {
        var newItem = createPageItem(markup.sportsmen.getAddingRowTemplate(), markup.sportsmen.getPlaceholders(sp, departmentLink));
        addingRow = table.insertRow(rowIndx);
        table.rows[rowIndx - 1].setAttribute("class", "add-sportsman-table-tr--selected");
        table.rows[rowIndx].setAttribute("class", "add-sportsman-table-tr--active");
        markup.sportsmen.setAddingRowId(addingRow, sid);
        addingRow.append(newItem);
        disciplinesCheckboxesAdd(sid);
        sportsmansAddList.push(sp);

    } else {
        addingRow.remove();
        table.rows[rowIndx - 1].setAttribute("class", "");
        for(var i = 0; i < sportsmansAddList.length; i++){
            if(sp.getId() == sportsmansAddList[i].getId()){
                sportsmansAddList.splice(i, 1);
                break;
            }
        }
    }
}

function sportsmansAddListSend() {
    var table = markup.sportsmen.getAddingTable();
    for(var i = 0; i < sportsmansAddList.length; i++){
        var sid = sportsmansAddList[i].getId();
        var indx = findRowIndxById(table, markup.sportsmen.getAddSportsRowId(sid)) + 1;
        var settings = table.rows[indx];
        sportsmansAddList[i].setAdmition(markup.sportsmen.getSportsAdmition(settings, sid));

        var sportsDisc = new Array(0);
        for(var j = 0; j < disciplines.length; j++){
            if(markup.sportsmen.isCheckedDisc(settings, sid, j))
                sportsDisc.push(disciplines[j]);
        }
        sportsmansAddList[i].setDisciplines(sportsDisc);
    }
    server.competition.addSprotsmans(page.cid, sportsmansAddList);
}

function departamentSportsmanElementAdd(sp){
    if(sp.getId() != undefined){
        var template = markup.sportsmen.getAddingTemplate();
        var placeholders = markup.sportsmen.getPlaceholders(sp, departmentLink);
        var newItem = createPageItem(template, placeholders);
        markup.sportsmen.getAddingTable().append(newItem);

        var row = document.getElementById(markup.sportsmen.getAddSportsRowId(sp.getId()));
        onClick(row, function(){sportsmanAddingSelect(sp.getId())});
    }
}

function resortSportsmens(){
    competition = server.competition.sortSportsmans(page.cid);
    location.reload();
}


/* ------------------- GROUPS ----------------------------*/

export function getQualNameByValue(val){
    return qualificationsMap.get(val) == undefined ? val : qualificationsMap.get(val);
}

export function getQualificationInterval(qMin, qMax){
    var qMinName = "";
    var qMaxName = "";
    if(isNumber(qMin) && (Number(qMin) >= 0) && (qualificationsMap.get(qMin) != undefined)){
        qMinName = qualificationsMap.get(qMin);
    }
    if(isNumber(qMax) && (Number(qMax) >= 0) && (qualificationsMap.get(qMax) != undefined)){
        qMaxName = qualificationsMap.get(qMax);
    }
    if(Number(qMax) == Number(qMin)) return qMinName;

    return qMinName + " - " + qMaxName;
}

function groupPageElementAdd(group){
    if(group.getId() != undefined){
        var template = markup.groups.getTemplate();
        var placeholders = markup.groups.getPlaceholders(group);
        markup.groups.getTable().append(createPageItem(template, placeholders)); 
    }
}

function isMainGroupParamsOk(){
    if(isEmptyString(markup.groups.getNameInput().value)){
        markup.groups.alertNameFormat();
        return false;
    }
    return true;
}

function isAgeOk(){
    var ageMin = markup.groups.getAgeMinInput().value;
    var ageMax = markup.groups.getAgeMaxInput().value;
    if(!isEmptyString(ageMin) && !isNumber(ageMin)){
        markup.groups.alertAgeMinFormat();
        return false;
    }
    if(!isEmptyString(ageMax)){
        if(!isNumber(ageMax)){
            markup.groups.alertAgeMaxFormat();
            return false; 
        }
        if(!isEmptyString(ageMin) && (Number(ageMax) - Number(ageMin)) < 0)
        {
            markup.groups.alertAgeIntervalFormat();
            return false; 
        }
    }
    return true;
}

function isWeightOk(){
    var weightMin = markup.groups.getWeightMinInput().value;
    var weightMax = markup.groups.getWeightMaxInput().value;

    if(!isEmptyString(weightMin) && !isNumber(weightMin)){
        markup.groups.alertWeightMinFormat();
        return false;
    }
    if(!isEmptyString(weightMax)){
        if(!isNumber(weightMax)){
            markup.groups.alertWeightMaxFormat();
            return false; 
        }
        if(!isEmptyString(weightMin) && (Number(weightMax) - Number(weightMin)) < 0)
        {
            markup.groups.alertWeightIntervalFormat();
            return false; 
        }
    }
    return true;
}

function isQualificationOk(){
    var qualMinVal = markup.groups.getQualMinInput().value;
    var qualMaxVal = markup.groups.getQualMaxInput().value;

    if((qualMinVal != "Not applicable") 
            && (qualMaxVal != "Not applicable") 
            && (Number(qualMinVal) > Number(qualMaxVal))){
        markup.groups.alertQualificationInterval();
        return false;
    }
    return true;
}

function sendGroupForm() {
    if(!isMainGroupParamsOk() || !isAgeOk() || !isWeightOk() || !isQualificationOk())
        return;
    var newGroup = ops.createGroup(undefined);
    newGroup.setName(markup.groups.getNameInput().value);
    newGroup.setDiscipline(markup.groups.getDisciplineInput().value);
    newGroup.setFormSystem(markup.groups.getSystemInput().value);

    if(markup.groups.getSexInput().value != "Not applicable")
        newGroup.setSex(markup.groups.getSexInput().value);
    if(markup.groups.getAgeMinInput().value != "")
        newGroup.setAgeMin(markup.groups.getAgeMinInput().value);
    if(markup.groups.getAgeMaxInput().value != "")
        newGroup.setAgeMax(markup.groups.getAgeMaxInput().value);
    if(markup.groups.getWeightMinInput().value != "")
        newGroup.setWeightMin(markup.groups.getWeightMinInput().value);
    if(markup.groups.getWeightMaxInput().value != "")
        newGroup.setWeightMax(markup.groups.getWeightMaxInput().value);
    if(markup.groups.getQualMinInput().value != "Not applicable")
        newGroup.setQualMin(markup.groups.getQualMinInput().value);
    if(markup.groups.getQualMaxInput().value != "Not applicable")
        newGroup.setQualMax(markup.groups.getQualMaxInput().value);
    server.group.create(page.cid, newGroup);
}

/* ------------------- COMMON ----------------------------*/

function competitionEdit(){
    var nameInput = markup.competitions.getNameInput();
    var descInput = markup.competitions.getDescInput();
    var startDateInput = markup.competitions.getStartDateInput();
    var endDateInput = markup.competitions.getEndDateInput();

    if(nameInput == null){
        var namePlace       = markup.competitions.getNamePlace();
        var descPlace       = markup.competitions.getDescPlace();
        var startDatePlace  = markup.competitions.getStartDatePlace();
        var endDatePlace    = markup.competitions.getEndDatePlace();

        nameInput       = markup.competitions.createNameInput();
        descInput       = markup.competitions.createDescInput();
        startDateInput  = markup.competitions.createDateInput(markup.competitions.startDateInputId);
        endDateInput    = markup.competitions.createDateInput(markup.competitions.endDateInputId);

        nameInput.value             = competition.getName();
        descInput.value             = competition.getDescription();
        startDateInput.value        = competition.getStartDate();
        endDateInput.value          = competition.getEndDate();

        namePlace.innerHTML         = "";
        descPlace.innerHTML         = "";
        startDatePlace.innerHTML    = "";
        endDatePlace.innerHTML      = "";
        
        namePlace.appendChild(nameInput);
        descPlace.appendChild(descInput);
        startDatePlace.appendChild(startDateInput);
        endDatePlace.appendChild(endDateInput);
    } else {
        var cp = ops.createCompetition(competition.params);
        cp.setName(nameInput.value);
        cp.setDescription(descInput.value);
        cp.setStartDate(startDateInput.value);
        cp.setEndDate(endDateInput.value);
        server.competition.edit(cp);
    }
}

function qualificationAddToPage(){
    var qualMinList = markup.groups.getQualMinList();
    var qualMaxList = markup.groups.getQualMaxList();
    qualificationsMap.forEach(function(name, value) {
        var optMin = markup.groups.createOption(name + "-min-id", name, value);
        var optMax = markup.groups.createOption(name + "-max-id", name, value);
        qualMinList.appendChild(optMin);
        qualMaxList.appendChild(optMax);
    });
}

function disciplinesAddToPage(){
    for(var i = 0; i < disciplines.length; i++){
        if(isEmptyString(disciplines[i]))
            continue;

        var opt = markup.groups.createOption(disciplines[i] + "-id", disciplines[i], disciplines[i]);
        markup.groups.getDisciplinesList().appendChild(opt);
    }
}
function disciplinesCheckboxesAdd(spId){
    for(var i = 0; i < disciplines.length; i++){
        if(isEmptyString(disciplines[i]))
            continue;
        var template = markup.sportsmen.getDisciplineTemplate();
        var placeholders = markup.sportsmen.getDiscPlaceholders(disciplines[i], i, spId);
        markup.sportsmen.getDisciplinesList(spId).append(createPageItem(template, placeholders));
        
    }
}

function fillPageInfo(){
    markup.competitions.setPageName(competition.getName());
    markup.competitions.setName(competition.getName());
    markup.competitions.setId(competition.getId());
    markup.competitions.setDescription(competition.getDescription());
    markup.competitions.setStartDate(competition.getFormatedStartDate("dd MM yy hh:min"));
    markup.competitions.setEndDate(competition.getFormatedEndDate("dd MM yy hh:min"));
    markup.competitions.setDepartmentName(department.getName());
    markup.competitions.setDepartmentLink(departmentLink);
    markup.competitions.setCompetitionName(competition.getName());
    markup.competitions.setCompetitionLink(window.location.href);

    qualificationAddToPage();
    
    disciplinesAddToPage();
    competition.getGroups(competition).forEach(gr =>   groupPageElementAdd(gr));
    competition.getSportsmans(competition).forEach(sp => sportsmanPageElementAdd(sp));
    departamentSportsmans.forEach(sp => departamentSportsmanElementAdd(sp));
}

function refreshPairs(){
    competition = server.competition.formPairs(page.cid);
    var groupsTable = markup.groups.getTable();
    while(groupsTable.rows.length > 2){
        groupsTable.deleteRow(groupsTable.rows.length - 1);
    }
    competition.getGroups().forEach(gr =>   groupPageElementAdd(gr));
}

function setBtnActions(){
    onClick(markup.competitions.getEditBtn(), competitionEdit);
    onClick(markup.groups.getAddBtn(), sendGroupForm);
    onClick(markup.sportsmen.getSortSpBtn(), resortSportsmens);
    onClick(markup.sportsmen.getAddBtn(),sportsmansAddListSend)
}

prepareTabs();
fillPageInfo();
setBtnActions();
showShadows(client);
languageSwitchingOn();