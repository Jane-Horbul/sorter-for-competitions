import {isNumber, isEmptyString, getLinkParams, showAllIfAdmin, languageSwitchingOn, onClick, createPageItem} from "./common.js"
import {departmentOp, competitionOp, groupOp, sportsmanOp, server} from "./communication.js"

const competitionLink   = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
const departmentLink    = competitionLink.substr(0, competitionLink.lastIndexOf("/"));
const pageParams        = getLinkParams(location.search);
const page = {
    cid: pageParams.get("cid"),
    gid: pageParams.get("gid")
}
var groupInfo             = server.getGroup(page.cid, page.gid);
const departmentInfo      = server.getDepartment();
const competitionInfo     = server.getCompetition(page.cid);
const qualificationsMap   = departmentOp.getQualifications(departmentInfo);
var competitionSportsmans = competitionOp.getSportsmans(competitionInfo);
var membersToAdd          = new Array(0);

console.log(groupInfo);

var groupForm = new Map();
groupForm.set( "name",           document.getElementById("new-group-name"));
groupForm.set( "division",       document.getElementById("create-group-division"));
groupForm.set( "sexIsOn",        document.getElementById("gender-checkbox"));
groupForm.set( "sexIsMale",      document.getElementById("create-ng-male"));
groupForm.set( "sexIsFemale",    document.getElementById("create-ng-female"));
groupForm.set( "ageIsOn",        document.getElementById("age-checkbox"));
groupForm.set( "ageMin",         document.getElementById("age-min"));
groupForm.set( "ageMax",         document.getElementById("age-max"));
groupForm.set( "weightIsOn",     document.getElementById("weight-checkbox"));
groupForm.set( "weightMin",      document.getElementById("weight-min"));
groupForm.set( "weightMax",      document.getElementById("weight-max"));
groupForm.set( "qualIsOn",       document.getElementById("qualification-checkbox"));
groupForm.set( "qualMin",        document.getElementById("ng-members-qualification-min"));
groupForm.set( "qualMax",        document.getElementById("ng-members-qualification-max"));
groupForm.set( "formSystem",     document.getElementById("pairs-form-system"));


function isMainGroupParamsOk(){
    if(isEmptyString(groupForm.get("name").value)){
        alert("Empty group name!");
        return false;
    }
    return true;
}

function isAgeOk(){
    var ageMin = groupForm.get("ageMin").value;
    var ageMax = groupForm.get("ageMax").value;
    if(!isNumber(ageMin)){
        alert("Bad minimal age!");
        return false;
    }
    if(!isNumber(ageMax)){
        alert("Bad maximal age!");
        return false;
    }
    if((Number(ageMax) - Number(ageMin)) < 0){
        alert("Maximal age must be greater than minimal!");
        return false;
    }
    return true;
}

function isWeightOk(){
    var weightMin = groupForm.get("weightMin").value;
    var weightMax = groupForm.get("weightMax").value;
    if(!isNumber(weightMin)){
        alert("Bad minimal weight!");
        return false;
    }
    if(!isNumber(weightMax)){
        alert("Bad maximal weight!");
        return false;
    }
    if((Number(weightMax) - Number(weightMin)) < 0){
        alert("Maximal weight must be greater than minimal!");
        return false;
    }
    return true;
}

function isQualificationOk(){
    var qualMinVal = groupForm.get("qualMin").value;
    var qualMaxVal = groupForm.get("qualMax").value;

    if(qualMinVal == undefined || qualMaxVal == undefined){
        alert("Undefined qualifications value!");
        return false;
    }
    if(qualMinVal > qualMaxVal){
        alert("Maximal value must greater than minimal!");
        return false;
    }

    return true;
}

function memberNameGet(id){
    console.log(id);
    if(!isNumber(id)){
        return "Winner of " + id;
    }
    var member = groupInfo.get("Members").find( memb => memb.get("id") == id );
    if(member == undefined){
        return "";
    }
    return member.get("name") + " " + member.get("surname");
}

function sendNotification(name, value) {
    var header = (name == "group-delete") ? '/competition-edition' : '/group-edit';
    var paramsMap = new Map();
    paramsMap.set(name, value);
    header += "?cid=" + page.cid + "&gid=" + page.gid;
    sendForm(header, paramsMap, false);
}

function sendGroupForm() {
    if(!isMainGroupParamsOk()) return;

    var paramsMap = new Map();

    paramsMap.set("group-name",     groupForm.get("name").value);
    paramsMap.set("group-division", groupForm.get("division").value);
    paramsMap.set("form-system",    groupForm.get("formSystem").value);

    if(groupForm.get("ageIsOn").checked){
        if(!isAgeOk()) return;
        paramsMap.set("age-min", groupForm.get("ageMin").value);
        paramsMap.set("age-max", groupForm.get("ageMax").value);
    }

    if(groupForm.get("weightIsOn").checked){
        if(!isWeightOk()) return;
        paramsMap.set("weight-min", groupForm.get("weightMin").value);
        paramsMap.set("weight-max", groupForm.get("weightMax").value);
    }

    if(groupForm.get("qualIsOn").checked){
        if(!isQualificationOk()) return;
        paramsMap.set("qualification-min", groupForm.get("qualMin").value);
        paramsMap.set("qualification-max", groupForm.get("qualMax").value);
    }

    if(groupForm.get("sexIsOn").checked){
        paramsMap.set("sex", groupForm.get("sexIsMale").checked ? "male" : "female");
    }
    console.log(paramsMap);
    sendForm("/group-edit?cid=" + page.cid + "&gid=" + page.gid, paramsMap, true);
}

function deleteGroup(){
    sendNotification("group-delete", page.gid);
}

function memberDelete(id){
    var table = document.getElementById("members-table");
    var memberName = memberNameGet(id);

    for(var i = 2; i < table.rows.length; i++) {
        if(table.rows[i].cells[0].innerHTML.localeCompare(memberName) == 0){
            table.deleteRow(i);
            sendNotification("group-member-delete", id);
            setTimeout(refreshPairs, 1000);
            return;
        }
    }

}

function putMemberToAdd(id){
    var member = competitionInfo.get("Members").find( memb => memb.get("id") == id);
    var memberRow = document.getElementById("comp-member-" + id);
    if(member == undefined) return;

    if(membersToAdd.find( memb => memb.get("id") == id) == undefined){
        membersToAdd.push(member);
        memberRow.setAttribute("class", "selected-row");
    } else {
        var pos = membersToAdd.indexOf(member);
        membersToAdd.splice(pos, 1);
        memberRow.setAttribute("class", "non-selected-row");
    }
    console.log(membersToAdd);
}

function pairSetWinner(id, color) {
    var paramsMap = new Map();
    paramsMap.set("color", color);
    sendForm(window.location.href + '/pair-member-win?pid=' + id, paramsMap, true);
}

function pairWinnerElementCreate(pair, template){

    if(!isEmptyString(pair.get("winner"))){
        console.log("Set winner: " + pair.get("winner"));
        template.getElementById("pair-winner").innerHTML = memberNameGet(pair.get("winner"));
        template.getElementById("pair-winner").setAttribute("class",
            (pair.get("winner") == pair.get("member_red")) ? "red-cell-style" : "blue-cell-style");
        return;
    }
    template.getElementById("red-member-win")
        .addEventListener("click", function(){pairSetWinner(pair.get("id"), "red")}, false);
        template.getElementById("blue-member-win")
        .addEventListener("click", function(){pairSetWinner(pair.get("id"), "blue")}, false);
}

function pairElementCreate(pair){
    if(pair.get("id") == undefined){
        return "";
    }
    var template = document.getElementById("pair-template").content.cloneNode(true);
    var memberRedId = pair.get("member_red");
    var memberBlueId = pair.get("member_blue");
    var redLink = prevPage + "/member?mid=" + memberRedId;
    var blueLink = prevPage + "/member?mid=" + memberBlueId;

    template.getElementById("pair-id").innerHTML = pair.get("id");
    template.getElementById("pair-red").innerHTML = memberNameGet(memberRedId);
    template.getElementById("pair-blue").innerHTML = memberNameGet(memberBlueId);
    pairWinnerElementCreate(pair, template);

    if(Number(memberRedId) >= 0){
        template.getElementById("pair-red")
            .setAttribute("onclick", "window.location.href='" + redLink + "'; return false");
    }
    if(Number(memberBlueId) >= 0){
        template.getElementById("pair-blue")
            .setAttribute("onclick", "window.location.href='" + blueLink + "'; return false");
    }
    return template;
}

function memberElementCreate(member){
    if(member.get("id") == undefined) return "";
    var template = document.getElementById("group-member-template").content.cloneNode(true);
    template.getElementById("member-name").innerHTML = member.get("name") + " " + member.get("surname");
    template.getElementById("member-age").innerHTML = member.get("age");
    template.getElementById("member-weight").innerHTML = member.get("weight");
    template.getElementById("member-sex").innerHTML = member.get("sex");
    template.getElementById("member-team").innerHTML = member.get("team");
    template.getElementById("member-qualification").innerHTML = qualificationsMap.get(member.get("qualification"));
    template.getElementById("member-admited").innerHTML = member.get("admited");
    template.getElementById("member-name").setAttribute("onclick", "window.location.href='"
                                    + prevPage + "/member?mid=" + member.get("id") + "'; return false");
    template.getElementById("member-dell-btn").addEventListener("click", function(){memberDelete(member.get("id"))}, false);
    return template;
}

function refreshPairs(){
    var pairsTable = document.getElementById("pairs-table");
    groupInfo = sendRequest("/group-pairs-refresh?cid=" + page.cid + "&gid=" + page.gid);
    while(pairsTable.rows.length > 2){
        pairsTable.deleteRow(pairsTable.rows.length - 1);
    }
    groupInfo.get("Pairs").forEach(pair =>   pairsTable.append(pairElementCreate(pair)));
    showAllIfAdmin();
}

function addMembersToGroup()
{
    if(membersToAdd.length < 1)
        return;

    var paramsMap = new Map();
    var first = true;
    var membersIds = "";

    membersToAdd.forEach(memb => {
        membersIds += (first ? memb.get("id") : ("," + memb.get("id")));
        first = false;
    });
    paramsMap.set("group-members-add",  membersIds);
    sendForm("/group-edit?cid=" + page.cid + "&gid=" + page.gid, paramsMap, true);
}

/* ------------------- SPORTSMANS ----------------------------*/
const sportsmanObjects = {
    sportsmanRowId:     "sports-row-id-",
    removeBtnId:        "remove-gr-sports-",

    getTable()                  { return document.getElementById("members-table");},
    getTemplate()               { return document.getElementById("group-member-template");},

    getAddingTable()            { return document.getElementById("add-sportsman-table");},
    getAddingTemplate()         { return document.getElementById("add-sportsman-template");},
/*    getAddSportsRowId(id)       { return "add-sports-" + id},

    getAddingRow(id)            { return document.getElementById("adding-row-sportsman-" + id);},
    setAddingRowId(row, id)     { row.setAttribute("id", "adding-row-sportsman-" + id);},
    getAddingRowTemplate()      { return document.getElementById("add-settings-template");},
    getSportsAdmition(row)      { return row.querySelector('#admitted').checked ? "true" : "false";},
    isCheckedDisc(row, num)     { return row.querySelector("#discipline-" + num).checked;},
*/
    getPlaceholders(sp)         { return {
                                        "#sp-id":           sportsmanOp.getId(sp),
                                        "#sp-surname":      sportsmanOp.getSurname(sp),
                                        "#sp-name":         sportsmanOp.getName(sp),
                                        "#sp-age":          sportsmanOp.getAge(sp),
                                        "#sp-weight":       sportsmanOp.getWeight(sp),
                                        "#sp-sex":          sportsmanOp.getSex(sp),
                                        "#sp-team":         sportsmanOp.getTeam(sp),
                                        "#sp-qual":         qualificationsMap.get(sportsmanOp.getQualification(sp)),
                                        "#sp-admit":        sportsmanOp.getAdmition(sp),
                                        "#sp-gr-num":       sportsmanOp.getGroupsNum(sp),
                                        "#sportsman-link":  competitionLink + sportsmanOp.getLinkFromCompetition(sp),
                                        "#sports-row-id":   this.sportsmanRowId + sportsmanOp.getId(sp)
                                    };
                                },
    getSportsRow(id)            { return document.getElementById(this.sportsmanRowId + id);},
    configDelBtn(item, sp)      {var btn = item.getElementById(this.removeBtnId); 
                                    onClick(btn, function(){sportsmanRemove(sportsmanOp.getId(sp))});
                                    btn.id = this.removeBtnId + sportsmanOp.getId(sp);
                                },
    getDelBtn()                 { return document.getElementById("member-dell-btn");}
}

function excludeCompetitionSportsman(sp){
    for(var i = 0; i < competitionSportsmans.length; i++){
        if(sportsmanOp.getId(sp) == sportsmanOp.getId(competitionSportsmans[i])){
            competitionSportsmans.splice(i, 1);
            return;
        }
    }
}

function sportsmanRemove(id){
    var spRow = sportsmanObjects.getSportsRow(id);
    var sportsmans = groupOp.getSportsmans(groupInfo);
    if(null != spRow)
        spRow.parentElement.removeChild(spRow);
    for(var i = 0; i < sportsmans.length; i++){
        if(id == sportsmanOp.getId(sportsmans[i])){
            sportsmans.splice(i, 1);
            break;
        }
    }
    console.log("Del id: " + id);
    server.removeGroupSportsman(page.cid, page.gid, id);
}

function competitionSportsmanElementAdd(sp){
    if(sportsmanOp.getId(sp) != undefined){
        var template = sportsmanObjects.getAddingTemplate();
        var placeholders = sportsmanObjects.getPlaceholders(sp);
        var newItem = createPageItem(template, placeholders);
        sportsmanObjects.getAddingTable().append(newItem);

        //var row = document.getElementById(sportsmanObjects.getAddSportsRowId(sportsmanOp.getId(sp)));
        //onClick(row, function(){sportsmanAddingSelect(sportsmanOp.getId(sp))});
    }
}

function sportsmanPageElementAdd(sp){
    if(sportsmanOp.getId(sp) != undefined){
        excludeCompetitionSportsman(sp);
        var template = sportsmanObjects.getTemplate();
        var placeholders = sportsmanObjects.getPlaceholders(sp);
        var newItem = createPageItem(template, placeholders);
        sportsmanObjects.getTable().append(newItem); 
        onClick(document.getElementById(sportsmanObjects.removeBtnId + sportsmanOp.getId(sp)), function(){sportsmanRemove(sportsmanOp.getId(sp))});
    }
    
}

/* ------------------- COMMON ----------------------------*/

const groupObjects = {
    pageNameId:         "page-name",
    pageNameLinkId:     "page-name-link",
    compLinkId:         "competition-link",
    depLinkId:          "department-link",
    groupLinkId:        "group-link",
    groupHeaderId:      "group-name-header",

    setPageName(name)           {document.getElementById(this.pageNameId).innerHTML = name;},
    setPageNameLink(link)       {document.getElementById(this.pageNameLinkId).setAttribute("href", link);},
    setDepartmentName(name)     {document.getElementById(this.depLinkId).innerHTML = name;},
    setDepartmentLink(link)     {document.getElementById(this.depLinkId).setAttribute("href", link);},
    setCompetitionName(name)    {document.getElementById(this.compLinkId).innerHTML = name;},
    setCompetitionLink(link)    {document.getElementById(this.compLinkId).setAttribute("href", link);},
    setGroupName(name)          {document.getElementById(this.groupLinkId).innerHTML = name;},
    setGroupLink(link)          {document.getElementById(this.groupLinkId).setAttribute("href", link);},
    setGroupHeader(name)        {document.getElementById(this.groupHeaderId).innerHTML = name;},

    infoNameId:         "group-info-name",
    infoSystemId:       "group-info-system",
    infoSexId:          "group-info-sex",
    infoDisciplineId:   "group-info-discipline",
    infoAgeMinId:       "group-info-age-min",
    infoAgeMaxId:       "group-info-age-max",
    infoWeightMinId:    "group-info-weight-min",
    infoWeightMaxId:    "group-info-weight-max",
    infoQualMinId:      "group-info-qulification-min",
    infoQualMaxId:      "group-info-qulification-max",

    setInfoName(val)            {document.getElementById(this.infoNameId).innerHTML = val;},
    setInfoSystem(val)          {document.getElementById(this.infoSystemId).innerHTML = val;},
    setInfoSex(val)             {document.getElementById(this.infoSexId).innerHTML = val;},
    setInfoDiscipline(val)      {document.getElementById(this.infoDisciplineId).innerHTML = val;},
    setInfoAgeMin(val)          {document.getElementById(this.infoAgeMinId).innerHTML = val;},
    setInfoAgeMax(val)          {document.getElementById(this.infoAgeMaxId).innerHTML = val;},
    setInfoWeightMin(val)       {document.getElementById(this.infoWeightMinId).innerHTML = val;},
    setInfoWeightMax(val)       {document.getElementById(this.infoWeightMaxId).innerHTML = val;},
    setInfoQulificationMin(val) {document.getElementById(this.infoQualMinId).innerHTML = val;},
    setInfoQulificationMax(val) {document.getElementById(this.infoQualMaxId).innerHTML = val;},

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

    createInput(id)             { return document.getElementById((id + "-template")).cloneNode(true).content;},
    createOption(id, name, val) { var res = document.createElement("option");
                                    res.setAttribute("id", id);
                                    res.value = val;
                                    res.innerHTML = name;
                                    return res;
                                },
    getAndCleanPlace(id)        { var pl= document.getElementById(id); pl.innerHTML = ""; return pl;},

    addSporsBtnId:      "members-add-btn",
    delBtnId:           "del-btn-link",
    editBtnId:          "group-edit-btn",
    updatePairsBtnId:   "update-pairs-btn",
    formGridBtnId:      "group-grid-btn",

    setDelBtnLink(link)         {this.getDelBtn().setAttribute("href", link);},
    getAddSportsmanBtn()        { return document.getElementById(this.addSporsBtnId);},
    getDelBtn()                 { return document.getElementById(this.delBtnId);},
    getEditBtn()                { return document.getElementById(this.editBtnId);},
    getUpdatePairsBtn()         { return document.getElementById(this.updatePairsBtnId);},
    getFormGridBtn()            { return document.getElementById(this.formGridBtnId);},

    pairsTableId:       "pairs-table",
}

function groupInfoEdit(){
    var nameInput = groupObjects.getNameInput();
    
    if(nameInput != null){
        var discipline = groupObjects.getDisciplineInput().value;
        var system = groupObjects.getSystemInput().value;
        var sex = groupObjects.getSexInput().value;
        var ageMin = groupObjects.getAgeMinInput().value;
        var ageMax = groupObjects.getAgeMaxInput().value;
        var weightMin = groupObjects.getWeightMinInput().value;
        var weightMax = groupObjects.getWeightMaxInput().value;
        var qualMin = groupObjects.getQualMinInput().value;
        var qualMax = groupObjects.getQualMaxInput().value;
        server.editGroup(page.cid, page.gid, nameInput.value,
            discipline, system,
            sex == "Not applicable" ? undefined : sex,
            ageMin == "" ? undefined : ageMin,
            ageMax == "" ? undefined : ageMax,
            weightMin == "" ? undefined : weightMin,
            weightMax == "" ? undefined : weightMax,
            qualMin == "Not applicable" ? undefined : qualMin,
            qualMax == "Not applicable" ? undefined : qualMax);
            return;
    }
    var namePlace       = groupObjects.getAndCleanPlace(groupObjects.infoNameId);
    var systemPlace     = groupObjects.getAndCleanPlace(groupObjects.infoSystemId);
    var sexPlace        = groupObjects.getAndCleanPlace(groupObjects.infoSexId);
    var disciplinePlace = groupObjects.getAndCleanPlace(groupObjects.infoDisciplineId);
    var ageMinPlace     = groupObjects.getAndCleanPlace(groupObjects.infoAgeMinId);
    var ageMaxPlace     = groupObjects.getAndCleanPlace(groupObjects.infoAgeMaxId);
    var weightMinPlace  = groupObjects.getAndCleanPlace(groupObjects.infoWeightMinId);
    var weightMaxPlace  = groupObjects.getAndCleanPlace(groupObjects.infoWeightMaxId);
    var qualMinPlace    = groupObjects.getAndCleanPlace(groupObjects.infoQualMinId);
    var qualMaxPlace    = groupObjects.getAndCleanPlace(groupObjects.infoQualMaxId);

    namePlace.appendChild(      groupObjects.createInput(groupObjects.inputNameId));
    systemPlace.appendChild(    groupObjects.createInput(groupObjects.inputSystemId));
    sexPlace.appendChild(       groupObjects.createInput(groupObjects.inputSexId));
    disciplinePlace.appendChild(groupObjects.createInput(groupObjects.inputDisciplineId));
    ageMinPlace.appendChild(    groupObjects.createInput(groupObjects.inputAgeMinId));
    ageMaxPlace.appendChild(    groupObjects.createInput(groupObjects.inputAgeMaxId));
    weightMinPlace.appendChild( groupObjects.createInput(groupObjects.inputWeightMinId));
    weightMaxPlace.appendChild( groupObjects.createInput(groupObjects.inputWeightMaxId));
    qualMinPlace.appendChild(   groupObjects.createInput(groupObjects.inputQualMinId));
    qualMaxPlace.appendChild(   groupObjects.createInput(groupObjects.inputQualMaxId));

    groupObjects.getNameInput().value       = groupOp.getName(groupInfo);
    groupObjects.getAgeMinInput().value     = groupOp.getAgeMin(groupInfo);
    groupObjects.getAgeMaxInput().value     = groupOp.getAgeMax(groupInfo);
    groupObjects.getWeightMinInput().value  = groupOp.getWeightMin(groupInfo);
    groupObjects.getWeightMaxInput().value  = groupOp.getWeightMax(groupInfo);
    groupObjects.getSystemInput().value = groupOp.getFormSystem(groupInfo);
    if(groupOp.getSex(groupInfo) != "")
        groupObjects.getSexInput().value = groupOp.getSex(groupInfo);

    var discList = groupObjects.getDisciplineInput();
    departmentOp.getDisciplines(departmentInfo).forEach(dsc => {
        var opt = groupObjects.createOption(dsc + "-id", dsc, dsc);
        discList.appendChild(opt);
        if(groupOp.getDiscipline(groupInfo) == dsc)
            discList.value = dsc;

    });
    var qualMinList = groupObjects.getQualMinInput();
    var qualMaxList = groupObjects.getQualMaxInput();
    qualificationsMap.forEach(function(name, value) {
        var optMin = groupObjects.createOption(name + "-min-id", name, value);
        var optMax = groupObjects.createOption(name + "-max-id", name, value);
        qualMinList.appendChild(optMin);
        qualMaxList.appendChild(optMax);
        if(groupOp.getQualMin(groupInfo) == value)
            qualMinList.value = value;

        if(groupOp.getQualMax(groupInfo) == value)
            qualMaxList.value = value;
    });
}


function fillPageInfo(params){
    /*--------------------------------Main tables params--------------------------------------------------------------------------------*/
    var qualMax = qualificationsMap.get(groupOp.getQualMax(groupInfo));
    var qualMin = qualificationsMap.get(groupOp.getQualMin(groupInfo));

    groupObjects.setPageName(competitionOp.getName(competitionInfo));
    groupObjects.setPageNameLink(competitionLink);
    groupObjects.setCompetitionName(competitionOp.getName(competitionInfo));
    groupObjects.setCompetitionLink(competitionLink);
    groupObjects.setDepartmentName(departmentOp.getName(departmentInfo));
    groupObjects.setDepartmentLink(departmentLink);
    groupObjects.setGroupName(groupOp.getName(groupInfo));
    groupObjects.setGroupLink( window.location.href);

    groupObjects.setDelBtnLink(competitionLink);
    groupObjects.setGroupHeader(groupOp.getName(groupInfo));

    groupObjects.setInfoName(       groupOp.getName(groupInfo));
    groupObjects.setInfoSystem(     groupOp.getFormSystem(groupInfo));
    groupObjects.setInfoDiscipline( groupOp.getDiscipline(groupInfo));
    groupObjects.setInfoSex(        groupOp.getSex(groupInfo));
    groupObjects.setInfoAgeMin(     groupOp.getAgeMin(groupInfo));
    groupObjects.setInfoAgeMax(     groupOp.getAgeMax(groupInfo));
    groupObjects.setInfoWeightMin(  groupOp.getWeightMin(groupInfo));
    groupObjects.setInfoWeightMax(  groupOp.getWeightMax(groupInfo));
    groupObjects.setInfoQulificationMin((qualMin == undefined) ? "" : qualMin);
    groupObjects.setInfoQulificationMax((qualMax == undefined) ? "" : qualMax);

    groupOp.getSportsmans(groupInfo).forEach(sp => sportsmanPageElementAdd(sp));
    competitionSportsmans.forEach(sp => competitionSportsmanElementAdd(sp));
    /*
    
    params.get("Pairs").forEach(pair =>   pairsTable.append(pairElementCreate(pair)));
    */
   
    /*--------------------------------Adding members params--------------------------------------------------------------------------------*/
    /*
    competitionInfo.get("Members").forEach(compMember => {
        if(params.get("Members").find( grMember => grMember.get("id") == compMember.get("id")) == undefined){
            competitionListMembersAdd(compMember);
        }
    });
    */
}

function setBtnActions(){
    onClick(groupObjects.getAddSportsmanBtn(),  addMembersToGroup);
    onClick(groupObjects.getDelBtn(),           deleteGroup);
    onClick(groupObjects.getEditBtn(),          groupInfoEdit);


    onClick(groupObjects.getUpdatePairsBtn(),   refreshPairs);
    onClick(groupObjects.getFormGridBtn(),      {});

}

fillPageInfo();
setBtnActions();
showAllIfAdmin();
languageSwitchingOn();
