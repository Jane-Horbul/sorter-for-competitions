
import { getLinkParams, 
    showShadows, 
    languageSwitchingOn, 
    onClick,
    prepareTabs,
    unhideSubelements,
    checkers} from "./common.js"
import {ops, server} from "./communication.js"
import { markup } from "./trainer-page-markup.js"

const pageParams        = getLinkParams(location.search);
const page = {
    tid: pageParams.get("tid")
}
const client            = server.access.getClient();
const departmentInfo    = server.department.get();
const qualificationsMap = departmentInfo.getQualifications();
var departmentLink      = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
var trainerInfo         = server.trainer.get(page.tid);

console.log(trainerInfo);
console.log(client);

function trainerInfoEdit(){
    if(markup.trainer.getNameInput() != null){
        var tr = ops.createTrainer(undefined);
        tr.setName(     markup.trainer.getNameInput().value);
        tr.setSurname(  markup.trainer.getSurnameInput().value);
        tr.setSex(      markup.trainer.getSexInput().value);
        tr.setBirth(    markup.trainer.getAgeInput().value);
        tr.setTeam(     markup.trainer.getTeamInput().value);
        tr.setRegion(   markup.trainer.getRegionInput().value);
        server.trainer.edit(page.tid, tr);
        return;
    }

    var namePlace = markup.trainer.getInfoName();
    namePlace.innerHTML = "";
    namePlace.appendChild(markup.trainer.getNameInputTemplate()); 
    markup.trainer.getNameInput().value = trainerInfo.getName();

    var surnamePlace = markup.trainer.getInfoSurname();
    surnamePlace.innerHTML = "";
    surnamePlace.appendChild(markup.trainer.getSurnameInputTemplate());
    markup.trainer.getSurnameInput().value = trainerInfo.getSurname();

    var sexPlace = markup.trainer.getInfoSex();
    sexPlace.innerHTML = "";
    sexPlace.appendChild(markup.trainer.getSexInputTemplate());
    if(trainerInfo.getSex() != "")
        markup.trainer.getSexInput().value = trainerInfo.getSex();

    var agePlace = markup.trainer.getInfoAge();
    agePlace.innerHTML = "";
    agePlace.appendChild(markup.trainer.getAgeInputTemplate());
    markup.trainer.getAgeInput().value = trainerInfo.getBirth();

    var teamPlace = markup.trainer.getInfoTeam();
    teamPlace.innerHTML = "";
    teamPlace.appendChild(markup.trainer.getTeamInputTemplate());
    markup.trainer.getTeamInput().value = trainerInfo.getTeam();

    var regionPlace = markup.trainer.getInfoRegion();
    regionPlace.innerHTML = "";
    regionPlace.appendChild(markup.trainer.getRegionInputTemplate());
    markup.trainer.getRegionInput().value = trainerInfo.getRegion();
}

function fillPageInfo(){

    var trainerName = trainerInfo.getSurname() + " " + trainerInfo.getName();
    markup.trainer.setPageName(departmentInfo.getName());
    markup.trainer.setPageNameLink(departmentLink);
    markup.trainer.setDepartmentName(departmentInfo.getName());
    markup.trainer.setDepartmentLink(departmentLink);
    markup.trainer.setTrainerHeader(trainerName);
    markup.trainer.setTrainerName(trainerName);
    markup.trainer.setTrainerLink(window.location.href);
    
    markup.trainer.getInfoId().innerHTML        = trainerInfo.getId();
    markup.trainer.getInfoName().innerHTML      = trainerInfo.getName();
    markup.trainer.getInfoSurname().innerHTML   = trainerInfo.getSurname();
    markup.trainer.getInfoSex().innerHTML       = trainerInfo.getSex();
    markup.trainer.getInfoAge().innerHTML       = trainerInfo.getFormatedBirth("dd MM yy");
    markup.trainer.getInfoTeam().innerHTML      = trainerInfo.getTeam();
    markup.trainer.getInfoRegion().innerHTML    = trainerInfo.getRegion();
    markup.trainer.getInfoEmail().innerHTML     = trainerInfo.getEmail();
    markup.trainer.setDelBtnLink(departmentLink);

    if(client.isTrainer() && checkers.strEquals(trainerInfo.getId(), client.getId()))
        unhideSubelements(document);
}

function setBtnActions(){
    onClick(markup.trainer.getEditBtn(), trainerInfoEdit);
    onClick(markup.trainer.getDelBtn(), function(){server.trainer.remove(page.tid)});
}


prepareTabs();
fillPageInfo();
setBtnActions();
showShadows(client);
languageSwitchingOn();
