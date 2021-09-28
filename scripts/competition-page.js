
import {isNumber, 
    isEmptyString, 
    getLinkParams, 
    onClick, 
    showAllIfAdmin, 
    languageSwitchingOn, 
    createPageItem,
    refreshPage} from "./common.js"
import {ops, server} from "./communication.js"

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
const sportsmanObjects = {
    getTable()                  { return document.getElementById("members-table");},
    getTemplate()               { return document.getElementById("member-template");},

    getAddingTable()            { return document.getElementById("add-sportsman-table");},
    getAddingTemplate()         { return document.getElementById("add-sportsman-template");},
    getAddSportsRowId(id)       { return "add-sports-" + id},

    getAddingRow(id)            { return document.getElementById("adding-row-sportsman-" + id);},
    setAddingRowId(row, id)     { row.setAttribute("id", "adding-row-sportsman-" + id);},
    getAddingRowTemplate()      { return document.getElementById("add-settings-template");},
    getSportsAdmition(row)      { return row.querySelector('#admitted').checked ? "true" : "false";},
    isCheckedDisc(row, num)     { return row.querySelector("#discipline-" + num).checked;},

    getPlaceholders(sp)         { return {
                                        "#sp-id":           sp.getId(),
                                        "#sp-surname":      sp.getSurname(),
                                        "#sp-name":         sp.getName(),
                                        "#sp-age":          sp.getAge(),
                                        "#sp-weight":       sp.getWeight(),
                                        "#sp-sex":          sp.getSex(),
                                        "#sp-team":         sp.getTeam(),
                                        "#sp-qual":         qualificationsMap.get(sp.getQualification()),
                                        "#sp-admit":        sp.getAdmition(),
                                        "#sp-gr-num":       sp.getGroupsNum(),
                                        "#sportsman-link":  departmentLink + sp.getLink()
                                    };
                                },
    getDisciplinesList()        {return this.getAddingRowTemplate().content.getElementById("sports-disc-list");},
    getDisciplineTemplate()     {return this.getAddingRowTemplate().content.getElementById("add-discipline-template");},
    getDiscPlaceholders(n, id)  {return {   "#disc-name":   n, 
                                            "#disc-id":     ("discipline-" + id)};
                                },
    
    getAddBtn()                 { return document.getElementById("sportsmans-add-list-send-btn");},
    getSortSpBtn()              { return document.getElementById("sort-members-btn");}
}

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
        var template = sportsmanObjects.getTemplate();
        var placeholders = sportsmanObjects.getPlaceholders(sp);
        var newItem = createPageItem(template, placeholders);
        sportsmanObjects.getTable().append(newItem); 
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
    var table = sportsmanObjects.getAddingTable();
    var addingRow = sportsmanObjects.getAddingRow(sid);
    var rowIndx = findRowIndxById(table, sportsmanObjects.getAddSportsRowId(sid)) + 1;
    var sp = departamentSportsmans.find( curSp => curSp.getId() == sid);
    
    if(addingRow == undefined) {
        var newItem = createPageItem(sportsmanObjects.getAddingRowTemplate(), sportsmanObjects.getPlaceholders(sp));
        addingRow = table.insertRow(rowIndx);
        table.rows[rowIndx - 1].setAttribute("class", "add-sportsman-table-tr--selected");
        table.rows[rowIndx].setAttribute("class", "add-sportsman-table-tr--active");
        sportsmanObjects.setAddingRowId(addingRow, sid);
        addingRow.append(newItem);
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
    var table = sportsmanObjects.getAddingTable();
    for(var i = 0; i < sportsmansAddList.length; i++){
        var sid = sportsmansAddList[i].getId();
        var indx = findRowIndxById(table, sportsmanObjects.getAddSportsRowId(sid)) + 1;
        var settings = table.rows[indx];
        sportsmansAddList[i].setAdmition(sportsmanObjects.getSportsAdmition(settings));

        var sportsDisc = new Array(0);
        for(var j = 0; j < disciplines.length; j++){
            if(sportsmanObjects.isCheckedDisc(settings, j))
                sportsDisc.push(disciplines[j]);
        }
        sportsmansAddList[i].setDisciplines(sportsDisc);
    }
    server.competition.addSprotsmans(page.cid, sportsmansAddList);
}

function departamentSportsmanElementAdd(sp){
    if(sp.getId() != undefined){
        var template = sportsmanObjects.getAddingTemplate();
        var placeholders = sportsmanObjects.getPlaceholders(sp);
        var newItem = createPageItem(template, placeholders);
        sportsmanObjects.getAddingTable().append(newItem);

        var row = document.getElementById(sportsmanObjects.getAddSportsRowId(sp.getId()));
        onClick(row, function(){sportsmanAddingSelect(sp.getId())});
    }
}

function resortSportsmens(){
    competition = server.competition.sortSportsmans(page.cid);
    refreshPage();
}


/* ------------------- GROUPS ----------------------------*/

const groupObjects = {
    getNameInput()              { return document.getElementById("new-group-name").value;},
    getDisciplineInput()        { return document.getElementById("create-group-division").value;},
    getPairsSystemInput()       { return document.getElementById("pairs-form-system").value;},

    isSexOn()                   { return document.getElementById("gender-checkbox").checked;},
    getSexInput()               { return document.getElementById("create-ng-male").checked ? "male" : "female";},

    isAgeOn()                   { return document.getElementById("age-checkbox").checked;},
    getAgeMinInput()            { return document.getElementById("age-min").value;},
    getAgeMaxInput()            { return document.getElementById("age-max").value;},

    isWeightOn()                { return document.getElementById("weight-checkbox").checked;},
    getWeightMinInput()         { return document.getElementById("weight-min").value;},
    getWeightMaxInput()         { return document.getElementById("weight-max").value;},

    isQualOn()                  { return document.getElementById("qualification-checkbox").checked;},
    getQualMinInput()           { return document.getElementById("ng-members-qualification-min").value;},
    getQualMaxInput()           { return document.getElementById("ng-members-qualification-max").value;},

    getTable()                  { return document.getElementById("groups-table");},
    getTemplate()               { return document.getElementById("group-template");},
    getAddBtn()                 { return document.getElementById("group-form-send-btn");},
    getFormPairsBtn()           { return document.getElementById("form-pairs-btn");},
    getPlaceholders(gr)         { return {
                                        "#group-name":          gr.getName(),
                                        "#group-age":           gr.getAgeMin() + " - " + gr.getAgeMax(),
                                        "#group-weight":        gr.getWeightMin() + " - " + gr.getWeightMax(),
                                        "#group-qualification": getQualificationInterval(gr.getQualMin(), gr.getQualMax()),
                                        "#group-sex":           gr.getSex(),
                                        "#group-discipline":    gr.getDiscipline(),
                                        "#group-sp-num":        gr.getSportsNum(),
                                        "#group-link":          window.location.href + gr.getLink()
                                    };
                                },

    getDisciplinesList()        {return document.getElementById("create-group-division");},
    getDisciplineTemplate()     {return document.getElementById("create-group-div-temp");},
    getDiscPlaceholders(name)   {return {
                                            "#group-disc-value": name,
                                            "#group-disc-name": name
                                        };
                                },

    getQualMinList()            {return document.getElementById("ng-members-qualification-min");},
    getQualMaxList()            {return document.getElementById("ng-members-qualification-max");},
    getQualTemplate()           {return document.getElementById("create-group-qual-temp");},
    getQualPlaceholders(v, n)   {return {  
                                            "#qual-value-ph": v,
                                            "#qual-name-ph": n
                                        };
                                },

    alertNameFormat()           {alert("Empty group name!");},
    alertAgeMinFormat()         {alert("Bad minimal age!");},
    alertAgeMaxFormat()         {alert("Bad maximal age!");},
    alertAgeIntervalFormat()    {alert("Maximal age must be greater than minimal!");},
    alertWeightMinFormat()      {alert("Bad minimal weight!");},
    alertWeightMaxFormat()      {alert("Bad maximal weight!");},
    alertWeightIntervalFormat() {alert("Maximal weight must be greater than minimal!");},
    alertQualificationFormat()  {alert("Undefined qualifications value!");},
    alertQualificationInterval() {alert("Maximal value must greater than minimal!");}
}

function getQualificationInterval(qMin, qMax){
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
        var template = groupObjects.getTemplate();
        var placeholders = groupObjects.getPlaceholders(group);
        groupObjects.getTable().append(createPageItem(template, placeholders)); 
    }
}

function isMainGroupParamsOk(){
    if(isEmptyString(groupObjects.getNameInput())){
        groupObjects.alertNameFormat();
        return false;
    }
    return true;
}

function isAgeOk(){
    var ageMin = groupObjects.getAgeMinInput();
    var ageMax = groupObjects.getAgeMaxInput();
    if(!isNumber(ageMin)){
        groupObjects.alertAgeMinFormat();
        return false;
    }
    if(!isNumber(ageMax)){
        groupObjects.alertAgeMaxFormat();
        return false;
    }
    if((Number(ageMax) - Number(ageMin)) < 0){
        groupObjects.alertAgeIntervalFormat();
        return false;
    }
    return true;
}

function isWeightOk(){
    var weightMin = groupObjects.getWeightMinInput();
    var weightMax = groupObjects.getWeightMaxInput();

    if(!isNumber(weightMin)){
        groupObjects.alertWeightMinFormat();
        return false;
    }
    if(!isNumber(weightMax)){
        groupObjects.alertWeightMaxFormat();
        return false;
    }
    if((Number(weightMax) - Number(weightMin)) < 0){
        groupObjects.alertWeightIntervalFormat();
        return false;
    }
    return true;
}

function isQualificationOk(){
    var qualMinVal = groupObjects.getQualMinInput();
    var qualMaxVal = groupObjects.getQualMaxInput();
    
    if(qualMinVal == undefined || qualMaxVal == undefined){
        groupObjects.alertQualificationFormat();
        return false;
    }
    if(qualMinVal > qualMaxVal){
        groupObjects.alertQualificationInterval();
        return false;
    }
    return true;
}

function sendGroupForm() {
    if(!isMainGroupParamsOk())
        return;
    if(groupObjects.isAgeOn() && !isAgeOk())
        return;
    if(groupObjects.isWeightOn() && !isWeightOk())
        return;
    if(groupObjects.isQualOn() && !isQualificationOk())
        return;

    var group = ops.createGroup(undefined);
    group.setName(groupObjects.getNameInput());
    group.setDiscipline(groupObjects.getDisciplineInput());
    group.setFormSystem(groupObjects.getPairsSystemInput());
    if(groupObjects.isSexOn())
        group.setSex(groupObjects.getSexInput());
    if(groupObjects.isAgeOn())
    {
        group.setAgeMin(groupObjects.getAgeMinInput());
        group.setAgeMax(groupObjects.getAgeMaxInput());
    }
    if(groupObjects.isWeightOn())
    {
        group.setWeightMin(groupObjects.getWeightMinInput());
        group.setWeightMax(groupObjects.getWeightMaxInput());
    }
    if(groupObjects.isQualOn())
    {
        group.setQualMin(groupObjects.getQualMinInput());
        group.setQualMax(groupObjects.getQualMaxInput());
    }
    server.group.create(page.cid, group);
}

/* ------------------- COMMON ----------------------------*/
const competitionObjects = {
    nameInputId:        "name-info-input",
    descInputId:        "desc-info-input",
    namePlaceId:        "competition-name-info",
    descPlaceId:        "competition-desc-info",
    getInput(id)            { return document.getElementById(id);},
    createInput(id)         { var res = document.createElement("input"); res.setAttribute("id", id); return res;},

    getNameInput()          { return this.getInput(this.nameInputId);},
    getDescInput()          { return this.getInput(this.descInputId);},
    createNameInput()       { return this.createInput(this.nameInputId);},
    createDescInput()       {   var res = document.createElement("textarea"); 
                                res.setAttribute("id", this.descInputId); 
                                res.setAttribute("rows", "3"); 
                                return res;
                            },

    getNamePlace()          { return document.getElementById(this.namePlaceId);},
    getDescPlace()          { return document.getElementById(this.descPlaceId);},
    setName(name)           {document.getElementById(this.namePlaceId).innerHTML = name;},
    setDescription(desc)    {document.getElementById(this.descPlaceId).innerHTML = desc;},
    setPageName(name)       {document.getElementById("competition-name").innerHTML = name;},
    setId(id)               {document.getElementById("competition-id-info").innerHTML = id;},
    getEditBtn()            { return document.getElementById("competition-edit-btn");}
}

function competitionEdit(){
    var nameInput = competitionObjects.getNameInput();
    var descInput = competitionObjects.getDescInput();
    if(nameInput == null){
        var namePlace = competitionObjects.getNamePlace();
        var descPlace = competitionObjects.getDescPlace();
        nameInput = competitionObjects.createNameInput();
        descInput = competitionObjects.createDescInput();

        nameInput.value = competition.getName();
        descInput.value = competition.getDescription();
        namePlace.innerHTML = "";
        descPlace.innerHTML = "";
        namePlace.appendChild(nameInput);
        descPlace.appendChild(descInput);
    } else {
        server.competition.edit(page.cid, nameInput.value, descInput.value);
    }
}

function qualificationAddToPage(name, value){
    if(!isEmptyString(value)){
        var template = groupObjects.getQualTemplate();
        var placeholders = groupObjects.getQualPlaceholders(value, name);
        groupObjects.getQualMinList().append(createPageItem(template, placeholders)); 
        groupObjects.getQualMaxList().append(createPageItem(template, placeholders)); 
    }
}

function disciplinesAddToPage(){
    for(var i = 0; i < disciplines.length; i++){
        if(isEmptyString(disciplines[i]))
            continue;
        var template = groupObjects.getDisciplineTemplate();
        var placeholders = groupObjects.getDiscPlaceholders(disciplines[i]);
        groupObjects.getDisciplinesList().append(createPageItem(template, placeholders));

        template = sportsmanObjects.getDisciplineTemplate();
        placeholders = sportsmanObjects.getDiscPlaceholders(disciplines[i], i);
        sportsmanObjects.getDisciplinesList().append(createPageItem(template, placeholders));
    }
}

function fillPageInfo(){
    competitionObjects.setPageName(competition.getName());
    competitionObjects.setName(competition.getName());
    competitionObjects.setId(competition.getId());
    competitionObjects.setDescription(competition.getDescription());
    
    for (var [value, name] of qualificationsMap) {
        qualificationAddToPage(name, value);
    }
    disciplinesAddToPage();
    competition.getGroups(competition).forEach(gr =>   groupPageElementAdd(gr));
    competition.getSportsmans(competition).forEach(sp => sportsmanPageElementAdd(sp));
    departamentSportsmans.forEach(sp => departamentSportsmanElementAdd(sp));
}

function refreshPairs(){
    competition = server.competition.formPairs(page.cid);
    var groupsTable = groupObjects.getTable();
    while(groupsTable.rows.length > 2){
        groupsTable.deleteRow(groupsTable.rows.length - 1);
    }
    competition.getGroups().forEach(gr =>   groupPageElementAdd(gr));
}

function setBtnActions(){
    onClick(competitionObjects.getEditBtn(), competitionEdit)
    onClick(groupObjects.getFormPairsBtn(), refreshPairs);
    onClick(groupObjects.getAddBtn(), sendGroupForm);
    onClick(sportsmanObjects.getSortSpBtn(), resortSportsmens);
    onClick(sportsmanObjects.getAddBtn(),sportsmansAddListSend)
}

showAllIfAdmin();
fillPageInfo();

setBtnActions();
languageSwitchingOn();