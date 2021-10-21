
import {isNumber, isEmptyString, getLinkParams, showAllIfAdmin, languageSwitchingOn, onClick, createPageItem} from "./common.js"
import {ops, server} from "./communication.js"

const pageParams        = getLinkParams(location.search);
const page = {
    sid: pageParams.get("sid")
}

const departmentInfo    = server.department.get();
const qualificationsMap = departmentInfo.getQualifications();
var departmentLink      = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
var sportsmanInfo       = server.sportsman.get(page.sid);
var sportsmanStats      = server.sportsman.getStatistics(page.sid);
console.log(sportsmanInfo);
console.log(sportsmanStats);

/* ------------------- STATISTICS ----------------------------*/

const statisticsObjects = {
    competitionsListId:         "competitions-list-id",
    groupsListId:               "groups-list-id-",
    competitionStatTemplate:    "competition-item-template-id",
    groupStatTemplate:          "group-item-template-id",

    getCompStatsList()          {return document.getElementById(this.competitionsListId);},
    getCompStatTemplate()       {return document.getElementById(this.competitionStatTemplate);},
    getCompStatPlaceholders(cs) { return {
            "#competition-name":    cs.getCompetitionName(),
            "#groups-list-id":      this.groupsListId + cs.getCompetitionId(),
        };
    },

    getGroupStatsList(cid)      {return document.getElementById(this.groupsListId + cid);},
    getGroupStatTemplate()      {return document.getElementById(this.groupStatTemplate);},
    getGroupstatPlaceholders(gs){ return {
            "#group-name":          gs.getGroupName(),
            "#group-link":          gs.getGroupLink(),
            "#place-image":         getPlaceImage(gs.getPlace()),
            "#pairs-num":           gs.getPairsNum(),
            "#wins-num":            gs.getWinsNum(),
            "#score":               gs.getScore(),
            "#discipline":          gs.getDiscipline(),
            "#place-num":           (gs.getPlace() == "-1") ? "" : gs.getPlace(),
        };
    },
}

function getPlaceImage(pl){
    if(pl == "1")
        return "./img/gold-m-2.png";
    else if(pl == "2")
        return "./img/silver-m.png";
    else if(pl == "3")
        return "./img/cooper-m.png";
    return "";
    
}

function fillStatistics() {
    sportsmanStats.forEach(cs => {
        var ctemplate = statisticsObjects.getCompStatTemplate();
        var cplaceholders = statisticsObjects.getCompStatPlaceholders(cs);
        statisticsObjects.getCompStatsList().append(createPageItem(ctemplate, cplaceholders));
        cs.getGroupsStats().forEach(gs => {
            var gtemplate = statisticsObjects.getGroupStatTemplate();
            var gplaceholders = statisticsObjects.getGroupstatPlaceholders(gs);
            statisticsObjects.getGroupStatsList(cs.getCompetitionId()).append(createPageItem(gtemplate, gplaceholders));
        });
    });
}

/* ------------------- COMMON ----------------------------*/

const sportsmanObjects = {
    pageNameId:         "page-name",
    pageNameLinkId:     "page-name-link",
    depLinkId:          "department-link",
    sportsLinkId:       "sportsman-link",
    sportsHeaderId:     "sportsman-header",

    setPageName(name)           {document.getElementById(this.pageNameId).innerHTML = name;},
    setPageNameLink(link)       {document.getElementById(this.pageNameLinkId).setAttribute("href", link);},
    setDepartmentName(name)     {document.getElementById(this.depLinkId).innerHTML = name;},
    setDepartmentLink(link)     {document.getElementById(this.depLinkId).setAttribute("href", link);},
    setSportsmanName(name)      {document.getElementById(this.sportsLinkId).innerHTML = name;},
    setSportsmanLink(link)      {document.getElementById(this.sportsLinkId).setAttribute("href", link);},
    setSportsmanHeader(name)    {document.getElementById(this.sportsHeaderId).innerHTML = name;},

    infoIdId:           "sportsman-info-id",
    infoNameId:         "sportsman-info-name",
    infoSurnameId:      "sportsman-info-surname",
    infoSexId:          "sportsman-info-sex",
    infoAgeId:          "sportsman-info-age",
    infoWeightId:       "sportsman-info-weight",
    infoQualId:         "sportsman-info-qual",
    infoTeamId:         "sportsman-info-team",

    setInfoId(val)              {document.getElementById(this.infoIdId).innerHTML = val;},
    setInfoName(val)            {document.getElementById(this.infoNameId).innerHTML = val;},
    setInfoSurname(val)         {document.getElementById(this.infoSurnameId).innerHTML = val;},
    setInfoSex(val)             {document.getElementById(this.infoSexId).innerHTML = val;},
    setInfoAge(val)             {document.getElementById(this.infoAgeId).innerHTML = val;},
    setInfoWeight(val)          {document.getElementById(this.infoWeightId).innerHTML = val;},
    setInfoQual(val)            {document.getElementById(this.infoQualId).innerHTML = val;},
    setInfoTeam(val)            {document.getElementById(this.infoTeamId).innerHTML = val;},

    inputNameId:         "sports-input-name",
    inputSurnameId:      "sports-input-surname",
    inputSexId:          "sports-input-sex",
    inputAgeId:          "sports-input-age",
    inputWeightId:       "sports-input-weight",
    inputQualId:         "sports-input-qulification",
    inputTeamId:         "sports-input-team",

    getNameInput()          { return document.getElementById(this.inputNameId);},
    getSurnameInput()       { return document.getElementById(this.inputSurnameId);},
    getSexInput()           { return document.getElementById(this.inputSexId);},
    getAgeInput()           { return document.getElementById(this.inputAgeId);},
    getWeightInput()        { return document.getElementById(this.inputWeightId);},
    getQualInput()          { return document.getElementById(this.inputQualId);},
    getTeamInput()          { return document.getElementById(this.inputTeamId);},

    createInput(id)             { return document.getElementById((id + "-template")).cloneNode(true).content;},
    createOption(id, name, val) { var res = document.createElement("option");
                                    res.setAttribute("id", id);
                                    res.value = val;
                                    res.innerHTML = name;
                                    return res;
                                },
    getAndCleanPlace(id)        { var pl= document.getElementById(id); pl.innerHTML = ""; return pl;},

    delBtnId:           "del-btn-link",
    editBtnId:          "group-edit-btn",

    setDelBtnLink(link)         {this.getDelBtn().setAttribute("href", link);},
    getDelBtn()                 { return document.getElementById(this.delBtnId);},
    getEditBtn()                { return document.getElementById(this.editBtnId);},
}

function sportsmanInfoEdit(){
    var nameInput = sportsmanObjects.getNameInput();
    
    if(nameInput != null){
        var sp = ops.createSportsman(undefined);
        sp.setName(sportsmanObjects.getNameInput().value);
        sp.setSurname(sportsmanObjects.getSurnameInput().value);
        sp.setSex(sportsmanObjects.getSexInput().value);
        sp.setBirth(sportsmanObjects.getAgeInput().value);
        sp.setWeight(sportsmanObjects.getWeightInput().value);
        sp.setQualification(sportsmanObjects.getQualInput().value);
        sp.setTeam(sportsmanObjects.getTeamInput().value);
        server.sportsman.edit(page.sid, sp);
        return;
    }

    var namePlace       = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoNameId);
    var surnamePlace    = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoSurnameId);
    var sexPlace        = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoSexId);
    var agePlace        = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoAgeId);
    var weightPlace     = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoWeightId);
    var qualPlace       = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoQualId);
    var teamPlace       = sportsmanObjects.getAndCleanPlace(sportsmanObjects.infoTeamId);

    namePlace.appendChild(      sportsmanObjects.createInput(sportsmanObjects.inputNameId));
    surnamePlace.appendChild(   sportsmanObjects.createInput(sportsmanObjects.inputSurnameId));
    sexPlace.appendChild(       sportsmanObjects.createInput(sportsmanObjects.inputSexId));
    agePlace.appendChild(       sportsmanObjects.createInput(sportsmanObjects.inputAgeId));
    weightPlace.appendChild(    sportsmanObjects.createInput(sportsmanObjects.inputWeightId));
    qualPlace.appendChild(      sportsmanObjects.createInput(sportsmanObjects.inputQualId));
    teamPlace.appendChild(      sportsmanObjects.createInput(sportsmanObjects.inputTeamId));

    sportsmanObjects.getNameInput().value       = sportsmanInfo.getName();
    sportsmanObjects.getSurnameInput().value    = sportsmanInfo.getSurname();
    sportsmanObjects.getAgeInput().value        = sportsmanInfo.getBirth();
    sportsmanObjects.getWeightInput().value     = sportsmanInfo.getWeight();
    sportsmanObjects.getTeamInput().value       = sportsmanInfo.getTeam();
    
    if(sportsmanInfo.getSex() != "")
        sportsmanObjects.getSexInput().value = sportsmanInfo.getSex();

    var qualList = sportsmanObjects.getQualInput();

    qualificationsMap.forEach(function(name, value) {
        var optMin = sportsmanObjects.createOption(name + "-id", name, value);
        qualList.appendChild(optMin);
        if(sportsmanInfo.getQualification() == value)
            qualList.value = value;
    });
}

function fillPageInfo(){
    var sportsName = sportsmanInfo.getSurname() + " " + sportsmanInfo.getName();
    sportsmanObjects.setPageName(departmentInfo.getName());
    sportsmanObjects.setPageNameLink(departmentLink);
    sportsmanObjects.setDepartmentName(departmentInfo.getName());
    sportsmanObjects.setDepartmentLink(departmentLink);
    sportsmanObjects.setSportsmanHeader(sportsName);
    sportsmanObjects.setSportsmanName(sportsName);
    sportsmanObjects.setSportsmanLink(window.location.href);
    
    sportsmanObjects.setInfoId(     sportsmanInfo.getId());
    sportsmanObjects.setInfoName(   sportsmanInfo.getName());
    sportsmanObjects.setInfoSurname(sportsmanInfo.getSurname());
    sportsmanObjects.setInfoSex(    sportsmanInfo.getSex());
    sportsmanObjects.setInfoAge(    sportsmanInfo.getFormatedBirth("dd MM yy"));
    sportsmanObjects.setInfoWeight( sportsmanInfo.getWeight());
    sportsmanObjects.setInfoQual(   qualificationsMap.get(sportsmanInfo.getQualification()));
    sportsmanObjects.setInfoTeam(   sportsmanInfo.getTeam());
    sportsmanObjects.setDelBtnLink(departmentLink);
    fillStatistics();
}

function setBtnActions(){
    onClick(sportsmanObjects.getEditBtn(), sportsmanInfoEdit);
    onClick(sportsmanObjects.getDelBtn(), function(){server.sportsman.remove(page.sid)});
}

fillPageInfo();
setBtnActions();

showAllIfAdmin();
languageSwitchingOn();