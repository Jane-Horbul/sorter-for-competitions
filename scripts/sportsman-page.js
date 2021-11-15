
import { getLinkParams, 
    showShadows, 
    languageSwitchingOn, 
    onClick,
    prepareTabs} from "./common.js"
import {ops, server} from "./communication.js"
import { markup } from "./sportsman-page-markup.js"

const pageParams        = getLinkParams(location.search);
const page = {
    sid: pageParams.get("sid")
}
const client            = server.access.getClient();
const departmentInfo    = server.department.get();
const qualificationsMap = departmentInfo.getQualifications();
var departmentLink      = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
var sportsmanInfo       = server.sportsman.get(page.sid);
var sportsmanStats      = server.sportsman.getStatistics(page.sid);
console.log(sportsmanInfo);
console.log(sportsmanStats);

/* ------------------- STATISTICS ----------------------------*/

function fillStatistics() {
    sportsmanStats.forEach(cs => {
        markup.statistics.getCompStatsList().append(markup.statistics.createCompStatisticItem(cs));
        markup.statistics.setAdmition(cs);

        departmentInfo.getDisciplines().forEach(disc => {
            var item = markup.statistics.createDisciplineItem(cs, disc);
            markup.statistics.getDisciplinesList(cs).append(item);
        });
        cs.getDisciplines().forEach(disc => markup.statistics.setDiscipline(cs, disc));
        var csPairs = cs.getPairs();
        cs.getGroupsStats().forEach(gs => {
            markup.statistics.getGroupStatsList(cs).append(markup.statistics.createGroupStatItem(cs, gs));
            var groupPairs = csPairs.filter(pair => gs.getGroupId() == pair.getGroupId());
            groupPairs.forEach(pair => {
                markup.statistics.getPairsList(cs, gs).append(markup.statistics.createPairsItem(pair));
            });
        });
    });
}

/* ------------------- COMMON ----------------------------*/

function sportsmanInfoEdit(){
    var nameInput = markup.sportsman.getNameInput();
    
    if(nameInput != null){
        var sp = ops.createSportsman(undefined);
        sp.setName(markup.sportsman.getNameInput().value);
        sp.setSurname(markup.sportsman.getSurnameInput().value);
        sp.setSex(markup.sportsman.getSexInput().value);
        sp.setBirth(markup.sportsman.getAgeInput().value);
        sp.setWeight(markup.sportsman.getWeightInput().value);
        sp.setQualification(markup.sportsman.getQualInput().value);
        sp.setTeam(markup.sportsman.getTeamInput().value);
        server.sportsman.edit(page.sid, sp);
        return;
    }

    var namePlace       = markup.sportsman.getAndCleanPlace(markup.sportsman.infoNameId);
    var surnamePlace    = markup.sportsman.getAndCleanPlace(markup.sportsman.infoSurnameId);
    var sexPlace        = markup.sportsman.getAndCleanPlace(markup.sportsman.infoSexId);
    var agePlace        = markup.sportsman.getAndCleanPlace(markup.sportsman.infoAgeId);
    var weightPlace     = markup.sportsman.getAndCleanPlace(markup.sportsman.infoWeightId);
    var qualPlace       = markup.sportsman.getAndCleanPlace(markup.sportsman.infoQualId);
    var teamPlace       = markup.sportsman.getAndCleanPlace(markup.sportsman.infoTeamId);

    namePlace.appendChild(      markup.sportsman.createInput(markup.sportsman.inputNameId));
    surnamePlace.appendChild(   markup.sportsman.createInput(markup.sportsman.inputSurnameId));
    sexPlace.appendChild(       markup.sportsman.createInput(markup.sportsman.inputSexId));
    agePlace.appendChild(       markup.sportsman.createInput(markup.sportsman.inputAgeId));
    weightPlace.appendChild(    markup.sportsman.createInput(markup.sportsman.inputWeightId));
    qualPlace.appendChild(      markup.sportsman.createInput(markup.sportsman.inputQualId));
    teamPlace.appendChild(      markup.sportsman.createInput(markup.sportsman.inputTeamId));

    markup.sportsman.getNameInput().value       = sportsmanInfo.getName();
    markup.sportsman.getSurnameInput().value    = sportsmanInfo.getSurname();
    markup.sportsman.getAgeInput().value        = sportsmanInfo.getBirth();
    markup.sportsman.getWeightInput().value     = sportsmanInfo.getWeight();
    markup.sportsman.getTeamInput().value       = sportsmanInfo.getTeam();
    
    if(sportsmanInfo.getSex() != "")
        markup.sportsman.getSexInput().value = sportsmanInfo.getSex();

    var qualList = markup.sportsman.getQualInput();

    qualificationsMap.forEach(function(name, value) {
        var optMin = markup.sportsman.createOption(name + "-id", name, value);
        qualList.appendChild(optMin);
        if(sportsmanInfo.getQualification() == value)
            qualList.value = value;
    });
}

function fillPageInfo(){
    var sportsName = sportsmanInfo.getSurname() + " " + sportsmanInfo.getName();
    markup.sportsman.setPageName(departmentInfo.getName());
    markup.sportsman.setPageNameLink(departmentLink);
    markup.sportsman.setDepartmentName(departmentInfo.getName());
    markup.sportsman.setDepartmentLink(departmentLink);
    markup.sportsman.setSportsmanHeader(sportsName);
    markup.sportsman.setSportsmanName(sportsName);
    markup.sportsman.setSportsmanLink(window.location.href);
    
    markup.sportsman.setInfoId(     sportsmanInfo.getId());
    markup.sportsman.setInfoName(   sportsmanInfo.getName());
    markup.sportsman.setInfoSurname(sportsmanInfo.getSurname());
    markup.sportsman.setInfoSex(    sportsmanInfo.getSex());
    markup.sportsman.setInfoAge(    sportsmanInfo.getFormatedBirth("dd MM yy"));
    markup.sportsman.setInfoWeight( sportsmanInfo.getWeight());
    markup.sportsman.setInfoQual(   qualificationsMap.get(sportsmanInfo.getQualification()));
    markup.sportsman.setInfoTeam(   sportsmanInfo.getTeam());
    markup.sportsman.setDelBtnLink(departmentLink);
    fillStatistics();
}

function setBtnActions(){
    onClick(markup.sportsman.getEditBtn(), sportsmanInfoEdit);
    onClick(markup.sportsman.getDelBtn(), function(){server.sportsman.remove(page.sid)});
}

prepareTabs();
fillPageInfo();
setBtnActions();
showShadows(client);
languageSwitchingOn();