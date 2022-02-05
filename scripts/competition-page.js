
import {helpers,
    getLinkParams, 
    onClick, 
    showShadows, 
    languageSwitchingOn, 
    createPageItem, 
    prepareTabs,
    prepareClient,
    filtration,
    rowsComparator,
    commonStrings} from "./common.js"
import {ops, server} from "./communication.js"
import { markup } from "./competition-page-markup.js";

const page = {
    cid: getLinkParams(location.search).get("cid")
}

const client = server.access.getClient();
prepareClient(client);

const department        = server.department.get();
var competition         = server.competition.get(page.cid);
const qualificationsMap = department.getQualifications();
const disciplines       = department.getDisciplines();
var acttiveDisciplines = disciplines.filter(disc => (undefined != competition.getGroups().find(gr => helpers.strEquals(gr.getDiscipline(), disc))));
const departmentLink    = window.location.href.substring(0, window.location.href.lastIndexOf("/"));

var departamentSportsmans   = new Array(0);
var sportsmansAddList       = new Array(0);


department.getSportsmen().forEach(sp => { departamentSportsmans.push(sp);});

console.log(competition);

/* ------------------- SPORTSMANS ----------------------------*/
function excludeDepSportsman(sp){
    for(var i = 0; i < departamentSportsmans.length; i++){
        if(sp.getId() == departamentSportsmans[i].getId()){
            departamentSportsmans.splice(i, 1);
            return;
        }
    }
}

function sportsmanAdmitChange(sp, admitCheckbox){
    markup.sportsmen.getAdmitLabel(sp).innerHTML = markup.sportsmen.getYesNoWord(admitCheckbox.checked);
    server.sportsman.admitChange(sp.getId(), page.cid, "" + admitCheckbox.checked);
}

function sportsmanPageElementAdd(sp){
    if(sp.getId() != undefined){
        excludeDepSportsman(sp);
        var template = markup.sportsmen.getTemplate();
        var placeholders = markup.sportsmen.getPlaceholders(sp, departmentLink);
        var newItem = createPageItem(template, placeholders);
        markup.sportsmen.getTable().append(newItem); 

        var admitCheckbox = markup.sportsmen.getAdmitBtn(sp);
        admitCheckbox.checked = sp.getAdmition();
        markup.sportsmen.getAdmitLabel(sp).innerHTML = markup.sportsmen.getYesNoWord(admitCheckbox.checked);
        if(!client.isGuest())
            onClick(markup.sportsmen.getDelBtn(sp), function(){server.competition.delSprotsman(page.cid, sp.getId())});
        if(client.isRoot() || client.isAdmin()){
            admitCheckbox.disabled = false;
            onClick(admitCheckbox, function(){sportsmanAdmitChange(sp, admitCheckbox);});
        }
            
            
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
        
        for(var j = 0; j < acttiveDisciplines.length; j++){
            if(markup.sportsmen.isCheckedDisc(settings, sid, j))
                sportsDisc.push(acttiveDisciplines[j]);
        }
        sportsmansAddList[i].setDisciplines(sportsDisc);
    }
    server.competition.addSprotsmen(page.cid, sportsmansAddList);
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
    var qval = "" + val;
    return qualificationsMap.get(qval) == undefined ? qval : qualificationsMap.get(qval);
}

export function getQualificationInterval(qMin, qMax){
    var qMinName = "";
    var qMaxName = "";
    if(helpers.isNumber(qMin) && (Number(qMin) >= 0) && (qualificationsMap.get(qMin) != undefined)){
        qMinName = qualificationsMap.get(qMin);
    }
    if(helpers.isNumber(qMax) && (Number(qMax) >= 0) && (qualificationsMap.get(qMax) != undefined)){
        qMaxName = qualificationsMap.get(qMax);
    }
    if(Number(qMax) == Number(qMin)) return qMinName;

    return qMinName + commonStrings.mapDivider + qMaxName;
}

function groupPageElementAdd(group){
    if(group.getId() != undefined){
        var template = markup.groups.getTemplate();
        var placeholders = markup.groups.getPlaceholders(group);
        markup.groups.getTable().append(createPageItem(template, placeholders)); 
    }
}

function isMainGroupParamsOk(){
    if(helpers.isEmptyString(markup.groups.getNameInput().value)){
        markup.groups.alertNameFormat();
        return false;
    }
    return true;
}

function isAgeOk(){
    var ageMin = markup.groups.getAgeMinInput().value;
    var ageMax = markup.groups.getAgeMaxInput().value;
    if(!helpers.isEmptyString(ageMin) && !helpers.isNumber(ageMin)){
        markup.groups.alertAgeMinFormat();
        return false;
    }
    if(!helpers.isEmptyString(ageMax)){
        if(!helpers.isNumber(ageMax)){
            markup.groups.alertAgeMaxFormat();
            return false; 
        }
        if(!helpers.isEmptyString(ageMin) && (Number(ageMax) - Number(ageMin)) < 0)
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

    if(!helpers.isEmptyString(weightMin) && !helpers.isNumber(weightMin)){
        markup.groups.alertWeightMinFormat();
        return false;
    }
    if(!helpers.isEmptyString(weightMax)){
        if(!helpers.isNumber(weightMax)){
            markup.groups.alertWeightMaxFormat();
            return false; 
        }
        if(!helpers.isEmptyString(weightMin) && (Number(weightMax) - Number(weightMin)) < 0)
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

function isEmptyField(val){
    if(val == "" || val == undefined || helpers.strEquals(val, "Not applicable"))
        return true;
    return false;
}

function sendGroupForm() {
    if(!isMainGroupParamsOk() || !isAgeOk() || !isWeightOk() || !isQualificationOk())
        return;
    var newGroup = ops.createGroup(undefined);
    newGroup.setName(markup.groups.getNameInput().value);
    newGroup.setDiscipline(markup.groups.getDisciplineInput().value);
    newGroup.setFormSystem(markup.groups.getSystemInput().value);

    if(!isEmptyField(markup.groups.getSexInput().value))
        newGroup.setSex(markup.groups.getSexInput().value);
    if(!isEmptyField(markup.groups.getAgeMinInput().value))
        newGroup.setAgeMin(markup.groups.getAgeMinInput().value);
    if(!isEmptyField(markup.groups.getAgeMaxInput().value))
        newGroup.setAgeMax(markup.groups.getAgeMaxInput().value);
    if(!isEmptyField(markup.groups.getWeightMinInput().value))
        newGroup.setWeightMin(markup.groups.getWeightMinInput().value);
    if(!isEmptyField(markup.groups.getWeightMaxInput().value))
        newGroup.setWeightMax(markup.groups.getWeightMaxInput().value);
    if(!isEmptyField(markup.groups.getQualMinInput().value))
        newGroup.setQualMin(markup.groups.getQualMinInput().value);
    if(!isEmptyField(markup.groups.getQualMaxInput().value))
        newGroup.setQualMax(markup.groups.getQualMaxInput().value);
    server.group.create(page.cid, newGroup);
}



function arenaPageElementAdd(ar){
    if(ar.getId() != undefined){
        var template = markup.arenas.getTemplate();
        var placeholders = markup.arenas.getPlaceholders(ar);
        var newItem = createPageItem(template, placeholders);
        markup.arenas.getList().prepend(newItem);
    }
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
        var cp = ops.createCompetition();
        cp.setName(nameInput.value);
        cp.setId(page.cid);
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
        if(helpers.isEmptyString(disciplines[i]))
            continue;

        var opt = markup.groups.createOption(disciplines[i] + "-id", disciplines[i], disciplines[i]);
        markup.groups.getDisciplinesList().appendChild(opt);
    }
}
function disciplinesCheckboxesAdd(spId){
    for(var i = 0; i < acttiveDisciplines.length; i++){
        if(helpers.isEmptyString(acttiveDisciplines[i]))
            continue;
        var template = markup.sportsmen.getDisciplineTemplate();
        var placeholders = markup.sportsmen.getDiscPlaceholders(acttiveDisciplines[i], i, spId);
        markup.sportsmen.getDisciplinesList(spId).append(createPageItem(template, placeholders));
        
    }
}

function fillPageInfo(){
    markup.competitions.setPageName(competition.getName());
    markup.competitions.setName(competition.getName());
    markup.competitions.setId(competition.getId());
    markup.competitions.setDescription(competition.getDescription());
    markup.competitions.setStartDate(competition.getStartDate("dd MM yy hh:min"));
    markup.competitions.setEndDate(competition.getEndDate("dd MM yy hh:min"));
    //markup.competitions.setDepartmentName(department.getName());
    markup.competitions.setDepartmentLink(departmentLink);
    markup.competitions.setCompetitionName(competition.getName());
    markup.competitions.setCompetitionLink(window.location.href);
    markup.arenas.setAddLink();

    qualificationAddToPage();
    
    disciplinesAddToPage();
    competition.getGroups().forEach(gr =>   groupPageElementAdd(gr));
    competition.getSportsmen().forEach(sp => sportsmanPageElementAdd(sp));
    competition.getArenas().forEach(ar => arenaPageElementAdd(ar));
    
    departamentSportsmans.forEach(sp => departamentSportsmanElementAdd(sp));
}

function refreshPairs(){
    server.competition.formPairs(page.cid);
}
function deleteCompetition(){
    server.competition.delete(page.cid);
    document.location.href = departmentLink;
}
function setBtnActions(){
    onClick(markup.competitions.getEditBtn(),   competitionEdit);
    onClick(markup.competitions.getDeleteBtn(), deleteCompetition);
    onClick(markup.groups.getAddBtn(),          sendGroupForm);
    onClick(markup.groups.getPairsRefreshBtn(), refreshPairs);
    
    onClick(markup.sportsmen.getSortSpBtn(),    resortSportsmens);
    onClick(markup.sportsmen.getAddBtn(),       sportsmansAddListSend);

    filtration(markup.sportsmen.getSearchInput(), markup.sportsmen.getTable(), rowsComparator);
}


fillPageInfo();
setBtnActions();
showShadows(client);
prepareTabs();
languageSwitchingOn();
