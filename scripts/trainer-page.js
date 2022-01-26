
import { getLinkParams, 
    showShadows, 
    languageSwitchingOn, 
    onClick,
    prepareTabs,
    unhideSubelements,
    helpers,
    createPageItem,
    prepareClient} from "./common.js"
import {ops, server} from "./communication.js"
import { markup } from "./trainer-page-markup.js"

const pageParams        = getLinkParams(location.search);
const page = {
    tid: pageParams.get("tid")
}

const client = server.access.getClient();
prepareClient(client);

const departmentInfo    = server.department.get();
const qualificationsMap = departmentInfo.getQualifications();
var departmentLink      = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
var trainerInfo         = server.trainer.get(page.tid);

console.log(trainerInfo);
console.log(client);

function changeEmail(){
    var client = ops.createClient();
    client.setNewLogin(markup.trainer.getNewEmail());
    client.setPassword(markup.trainer.getLoginConfirmPassword())
    server.access.changeLogin(client);
}

function changePass(){
    var newPass = markup.trainer.getNewPassword();
    var newPassConfirm = markup.trainer.getNewPasswordConfirm();
    if(!helpers.strEquals(newPass, newPassConfirm)){
        alert("Not equal confirm password");
        return;
    }
    var client = ops.createClient();
    client.setNewPassword(newPass);
    client.setPassword(markup.trainer.getOldPassword())
    server.access.changePass(client);
}

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

export function getQualNameByValue(val){
    return qualificationsMap.get(val) == undefined ? val : qualificationsMap.get(val);
}

function qualificationElementAddToPage(name, value){
    if(!helpers.isEmptyString(value)){
        var template = markup.sportsman.getQualTemplate();
        var placeholders = markup.sportsman.getQualPlaceholders(name, value)
        markup.sportsman.getQualList().append(createPageItem(template, placeholders));
    }
}

function sportsmanPageElementAdd(sp){
    if(sp.getId() != undefined){
        var template = markup.sportsman.getTemplate();
        var placeholders = markup.sportsman.getPlaceholders(sp);
        markup.sportsman.getTable().append(createPageItem(template, placeholders)); 
    }
}

function isSportsmansParamsOk() {
    return (!helpers.checkName("Name", markup.sportsman.getNameInput()) 
        || !helpers.checkName("Surname", markup.sportsman.getSurnameInput())
        || !helpers.checkNumber("Weight", markup.sportsman.getWeightInput())
        || !helpers.checkDate(markup.sportsman.getAgeInput())) 
        ? false : true;
}

function createSportsman() {
    if(isSportsmansParamsOk()) {
        var sporsman = ops.createSportsman();
        sporsman.setName(markup.sportsman.getNameInput());
        sporsman.setSurname(markup.sportsman.getSurnameInput());
        sporsman.setWeight(markup.sportsman.getWeightInput());
        sporsman.setBirth(markup.sportsman.getAgeInput());
        sporsman.setTrainer(markup.sportsman.getTrainerInput());
        sporsman.setSex(markup.sportsman.getSexInput());
        sporsman.setQualification(markup.sportsman.getQualificationInput());
        server.sportsman.create(sporsman);
        /*
        if(markup.sportsman.getOneMoreInput().localeCompare("no") == 0){
            location.reload();
        }*/
    }
    
}

function fillPageInfo(){
    var trainerName = trainerInfo.getSurname() + " " + trainerInfo.getName();
    markup.trainer.setPageName(departmentInfo.getName());
    markup.trainer.setDepartmentName(departmentInfo.getName());
    markup.trainer.setDepartmentLink(departmentLink);
    markup.trainer.setTrainerHeader(trainerName);
    markup.trainer.setTrainerName(trainerName);
    markup.trainer.setTrainerLink(window.location.href);
    markup.trainer.setPhoto(trainerInfo.getPhoto());

    markup.trainer.getInfoId().innerHTML        = trainerInfo.getId();
    markup.trainer.getInfoName().innerHTML      = trainerInfo.getName();
    markup.trainer.getInfoSurname().innerHTML   = trainerInfo.getSurname();
    markup.trainer.getInfoSex().innerHTML       = trainerInfo.getSex();
    markup.trainer.getInfoAge().innerHTML       = trainerInfo.getBirth("dd MM yy");
    markup.trainer.getInfoTeam().innerHTML      = trainerInfo.getTeam();
    markup.trainer.getInfoRegion().innerHTML    = trainerInfo.getRegion();
    markup.trainer.getInfoEmail().innerHTML     = trainerInfo.getEmail();
    markup.trainer.setDelBtnLink(departmentLink);
    
    markup.sportsman.getTrainersList()
        .append(createPageItem(markup.sportsman.getTrainerTemplate(), 
        markup.sportsman.getTrainerPlaceholders(trainerInfo)));
    var team = departmentInfo.getSportsmen().filter(sp => helpers.strEquals(sp.getTrainer(), page.tid));
    team.forEach( sportsman   => sportsmanPageElementAdd(sportsman));
    for (var [value, name] of qualificationsMap)
        qualificationElementAddToPage(name, value);
    
    if(client.isTrainer() && helpers.strEquals(trainerInfo.getId(), client.getId()))
        unhideSubelements(document);
}

function setBtnActions(){
    onClick(markup.trainer.getEditBtn(), trainerInfoEdit);
    onClick(markup.trainer.getDelBtn(), function(){server.trainer.remove(page.tid)});
    onClick(markup.trainer.getChangeEmailBtn(), changeEmail);
    onClick(markup.trainer.getChangePassBtn(), changePass);
    onClick(markup.trainer.getChangePhotoBtn(), function(){server.trainer.changePhoto(page.tid, markup.trainer.getPhotoForm());});
    onClick(markup.sportsman.getAddBtn(), createSportsman);
    
}


prepareTabs();
fillPageInfo();
setBtnActions();
showShadows(client);
languageSwitchingOn();
