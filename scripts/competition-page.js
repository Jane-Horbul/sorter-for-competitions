
import {isNumber, 
    isEmptyString, 
    getLinkParams, 
    onClick, 
    showShadows, 
    languageSwitchingOn, 
    createPageItem} from "./common.js"
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
    getSportsAdmition(row, sid) { return row.querySelector('#admitted-' + sid).checked ? "true" : "false";},
    isCheckedDisc(row, sid, num){ return row.querySelector("#discipline-" + sid + "-" + num).checked;},

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
                                        "#sportsman-link":  departmentLink + sp.getLink(),
                                        "#disc-list-id":    "sports-disc-list-" + sp.getId(),
                                        "#admitted-id":     "admitted-" + sp.getId()
                                    };
                                },
    getDisciplinesList(spId)            {return document.getElementById("sports-disc-list-" + spId);},
    getDisciplineTemplate()             {return document.getElementById("add-discipline-template");},
    getDiscPlaceholders(n, id, spId)    {return {   "#disc-name":   n, 
                                                    "#disc-id":     ("discipline-" + spId + "-" + id)};
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
    var table = sportsmanObjects.getAddingTable();
    for(var i = 0; i < sportsmansAddList.length; i++){
        var sid = sportsmansAddList[i].getId();
        var indx = findRowIndxById(table, sportsmanObjects.getAddSportsRowId(sid)) + 1;
        var settings = table.rows[indx];
        sportsmansAddList[i].setAdmition(sportsmanObjects.getSportsAdmition(settings, sid));

        var sportsDisc = new Array(0);
        for(var j = 0; j < disciplines.length; j++){
            if(sportsmanObjects.isCheckedDisc(settings, sid, j))
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
    location.reload();
}


/* ------------------- GROUPS ----------------------------*/

const groupObjects = {
    inputNameId:         "group-input-name",
    inputSystemId:       "group-input-system",
    inputSexId:          "group-input-sex",
    inputDisciplineId:   "group-input-discipline",
    inputAgeMinId:       "group-input-age-min",
    inputAgeMaxId:       "group-input-age-max",
    inputWeightMinId:    "group-input-weight-min",
    inputWeightMaxId:    "group-input-weight-max",
    inputQualMinId:      "group-input-qulification-min",
    inputQualMaxId:      "group-input-qulification-max",

    getNameInput()          { return document.getElementById(this.inputNameId);},
    getSystemInput()        { return document.getElementById(this.inputSystemId);},
    getSexInput()           { return document.getElementById(this.inputSexId);},
    getDisciplineInput()    { return document.getElementById(this.inputDisciplineId);},
    getAgeMinInput()        { return document.getElementById(this.inputAgeMinId);},
    getAgeMaxInput()        { return document.getElementById(this.inputAgeMaxId);},
    getWeightMinInput()     { return document.getElementById(this.inputWeightMinId);},
    getWeightMaxInput()     { return document.getElementById(this.inputWeightMaxId);},
    getQualMinInput()       { return document.getElementById(this.inputQualMinId);},
    getQualMaxInput()       { return document.getElementById(this.inputQualMaxId);},
    
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

    getDisciplinesList()        {return document.getElementById("group-input-discipline");},
    getDisciplineTemplate()     {return document.getElementById("create-group-div-temp");},
    getDiscPlaceholders(name)   {return {
                                            "#group-disc-value": name,
                                            "#group-disc-name": name
                                        };
                                },

    getQualMinList()            {return document.getElementById("group-input-qulification-min");},
    getQualMaxList()            {return document.getElementById("group-input-qulification-max");},
    createOption(id, name, val) { var res = document.createElement("option");
                                    res.setAttribute("id", id);
                                    res.value = val;
                                    res.innerHTML = name;
                                    return res;
                                },
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
    if(isEmptyString(groupObjects.getNameInput().value)){
        groupObjects.alertNameFormat();
        return false;
    }
    return true;
}

function isAgeOk(){
    var ageMin = groupObjects.getAgeMinInput().value;
    var ageMax = groupObjects.getAgeMaxInput().value;
    if(!isEmptyString(ageMin) && !isNumber(ageMin)){
        groupObjects.alertAgeMinFormat();
        return false;
    }
    if(!isEmptyString(ageMax)){
        if(!isNumber(ageMax)){
            groupObjects.alertAgeMaxFormat();
            return false; 
        }
        if(!isEmptyString(ageMin) && (Number(ageMax) - Number(ageMin)) < 0)
        {
            groupObjects.alertAgeIntervalFormat();
            return false; 
        }
    }
    return true;
}

function isWeightOk(){
    var weightMin = groupObjects.getWeightMinInput().value;
    var weightMax = groupObjects.getWeightMaxInput().value;

    if(!isEmptyString(weightMin) && !isNumber(weightMin)){
        groupObjects.alertWeightMinFormat();
        return false;
    }
    if(!isEmptyString(weightMax)){
        if(!isNumber(weightMax)){
            groupObjects.alertWeightMaxFormat();
            return false; 
        }
        if(!isEmptyString(weightMin) && (Number(weightMax) - Number(weightMin)) < 0)
        {
            groupObjects.alertWeightIntervalFormat();
            return false; 
        }
    }
    return true;
}

function isQualificationOk(){
    var qualMinVal = groupObjects.getQualMinInput().value;
    var qualMaxVal = groupObjects.getQualMaxInput().value;

    if((qualMinVal != "Not applicable") 
            && (qualMaxVal != "Not applicable") 
            && (Number(qualMinVal) > Number(qualMaxVal))){
        groupObjects.alertQualificationInterval();
        return false;
    }
    return true;
}

function sendGroupForm() {
    if(!isMainGroupParamsOk() || !isAgeOk() || !isWeightOk() || !isQualificationOk())
        return;
    var newGroup = ops.createGroup(undefined);
    newGroup.setName(groupObjects.getNameInput().value);
    newGroup.setDiscipline(groupObjects.getDisciplineInput().value);
    newGroup.setFormSystem(groupObjects.getSystemInput().value);

    if(groupObjects.getSexInput().value != "Not applicable")
        newGroup.setSex(groupObjects.getSexInput().value);
    if(groupObjects.getAgeMinInput().value != "")
        newGroup.setAgeMin(groupObjects.getAgeMinInput().value);
    if(groupObjects.getAgeMaxInput().value != "")
        newGroup.setAgeMax(groupObjects.getAgeMaxInput().value);
    if(groupObjects.getWeightMinInput().value != "")
        newGroup.setWeightMin(groupObjects.getWeightMinInput().value);
    if(groupObjects.getWeightMaxInput().value != "")
        newGroup.setWeightMax(groupObjects.getWeightMaxInput().value);
    if(groupObjects.getQualMinInput().value != "Not applicable")
        newGroup.setQualMin(groupObjects.getQualMinInput().value);
    if(groupObjects.getQualMaxInput().value != "Not applicable")
        newGroup.setQualMax(groupObjects.getQualMaxInput().value);
    server.group.create(page.cid, newGroup);
}

/* ------------------- COMMON ----------------------------*/
const competitionObjects = {
    nameInputId:        "name-info-input",
    descInputId:        "desc-info-input",
    startDateInputId:   "start-date-input",
    endDateInputId:     "end-date-input",

    namePlaceId:        "competition-name-info",
    descPlaceId:        "competition-desc-info",
    startDatePlaceId:   "competition-start-date-info",
    endDatePlaceId:     "competition-end-date-info",

    depLinkId:          "department-link-id",
    compLinkId:         "competition-link-id",
    createInput(id)         { var res = document.createElement("input"); res.setAttribute("id", id); return res;},

    getNameInput()          { return document.getElementById(this.nameInputId);},
    getDescInput()          { return document.getElementById(this.descInputId);},
    getStartDateInput()     { return document.getElementById(this.startDateInputId);},
    getEndDateInput()       { return document.getElementById(this.endDateInputId);},
    
    createNameInput()       { return this.createInput(this.nameInputId);},
    createDescInput()       {   var res = document.createElement("textarea"); 
                                res.setAttribute("id", this.descInputId); 
                                res.setAttribute("rows", "3"); 
                                return res;
                            },
    createDateInput(id)     {
                                var res = document.createElement("input"); 
                                res.setAttribute("id",      id); 
                                res.setAttribute("type",    "datetime-local");
                                res.setAttribute("class",   "create-ng--interval-min sportsman-info-item--input");
                                res.setAttribute("pattern", "[0-9]+");
                                res.setAttribute("required","required");
                                return res;
                            },

    getNamePlace()          { return document.getElementById(this.namePlaceId);},
    getDescPlace()          { return document.getElementById(this.descPlaceId);},
    getStartDatePlace()     {return document.getElementById(this.startDatePlaceId);},
    getEndDatePlace()       {return document.getElementById(this.endDatePlaceId);},
    
    setName(name)           {document.getElementById(this.namePlaceId).innerHTML = name;},
    setDescription(desc)    {document.getElementById(this.descPlaceId).innerHTML = desc;},
    setStartDate(val)       {document.getElementById(this.startDatePlaceId).innerHTML = val;},
    setEndDate(val)         {document.getElementById(this.endDatePlaceId).innerHTML = val;},
    setPageName(name)       {document.getElementById("competition-name").innerHTML = name;},
    setId(id)               {document.getElementById("competition-id-info").innerHTML = id;},
    setDepartmentName(name) {document.getElementById(this.depLinkId).innerHTML = name;},
    setDepartmentLink(link) {document.getElementById(this.depLinkId).setAttribute("href", link);},
    setCompetitionName(name){document.getElementById(this.compLinkId).innerHTML = name;},
    setCompetitionLink(link){document.getElementById(this.compLinkId).setAttribute("href", link);},


    getEditBtn()            { return document.getElementById("competition-edit-btn");}
}

function competitionEdit(){
    var nameInput = competitionObjects.getNameInput();
    var descInput = competitionObjects.getDescInput();
    var startDateInput = competitionObjects.getStartDateInput();
    var endDateInput = competitionObjects.getEndDateInput();

    if(nameInput == null){
        var namePlace       = competitionObjects.getNamePlace();
        var descPlace       = competitionObjects.getDescPlace();
        var startDatePlace  = competitionObjects.getStartDatePlace();
        var endDatePlace    = competitionObjects.getEndDatePlace();

        nameInput       = competitionObjects.createNameInput();
        descInput       = competitionObjects.createDescInput();
        startDateInput  = competitionObjects.createDateInput(competitionObjects.startDateInputId);
        endDateInput    = competitionObjects.createDateInput(competitionObjects.endDateInputId);

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
    var qualMinList = groupObjects.getQualMinList();
    var qualMaxList = groupObjects.getQualMaxList();
    qualificationsMap.forEach(function(name, value) {
        var optMin = groupObjects.createOption(name + "-min-id", name, value);
        var optMax = groupObjects.createOption(name + "-max-id", name, value);
        qualMinList.appendChild(optMin);
        qualMaxList.appendChild(optMax);
    });
}

function disciplinesAddToPage(){
    for(var i = 0; i < disciplines.length; i++){
        if(isEmptyString(disciplines[i]))
            continue;

        var opt = groupObjects.createOption(disciplines[i] + "-id", disciplines[i], disciplines[i]);
        groupObjects.getDisciplinesList().appendChild(opt);
    }
}
function disciplinesCheckboxesAdd(spId){
    for(var i = 0; i < disciplines.length; i++){
        if(isEmptyString(disciplines[i]))
            continue;
        var template = sportsmanObjects.getDisciplineTemplate();
        var placeholders = sportsmanObjects.getDiscPlaceholders(disciplines[i], i, spId);
        sportsmanObjects.getDisciplinesList(spId).append(createPageItem(template, placeholders));
        
    }
}

function fillPageInfo(){
    competitionObjects.setPageName(competition.getName());
    competitionObjects.setName(competition.getName());
    competitionObjects.setId(competition.getId());
    competitionObjects.setDescription(competition.getDescription());
    competitionObjects.setStartDate(competition.getFormatedStartDate("dd MM yy hh:min"));
    competitionObjects.setEndDate(competition.getFormatedEndDate("dd MM yy hh:min"));
    competitionObjects.setDepartmentName(department.getName());
    competitionObjects.setDepartmentLink(departmentLink);
    competitionObjects.setCompetitionName(competition.getName());
    competitionObjects.setCompetitionLink(window.location.href);

    qualificationAddToPage();
    
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
    onClick(competitionObjects.getEditBtn(), competitionEdit);
    onClick(groupObjects.getAddBtn(), sendGroupForm);
    onClick(sportsmanObjects.getSortSpBtn(), resortSportsmens);
    onClick(sportsmanObjects.getAddBtn(),sportsmansAddListSend)
}

showShadows(client);
fillPageInfo();

setBtnActions();
languageSwitchingOn();