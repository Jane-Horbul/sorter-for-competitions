
import { getLinkParams, 
    showShadows, 
    languageSwitchingOn, 
    onClick,
    prepareTabs,
    helpers,
    prepareClient} from "./common.js"
import {ops, server} from "./communication.js"
import { markup } from "./sportsman-page-markup.js"

const pageParams        = getLinkParams(location.search);
const page = {
    sid: pageParams.get("sid")
}

const client = server.access.getClient();
prepareClient(client);

const departmentInfo    = server.department.get();
const qualificationsMap = departmentInfo.getQualifications();
var departmentLink      = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
var sportsmanInfo       = server.sportsman.get(page.sid);

console.log(sportsmanInfo);

/* ------------------- STATISTICS ----------------------------*/
function changeParmition(cs, permCheckbox){
    console.log("Change admittion for " + cs.getCompetitionName());
    server.sportsman.admitChange(page.sid, cs.getCompetitionId(), permCheckbox.checked ? "true" : "false");
}

function changeDiscipline(cs, discCheckbox){
    if(discCheckbox.checked){
        console.log("Add discipline " +  discCheckbox.name + " for "+ cs.getCompetitionName());
        server.sportsman.addDiscipline(page.sid, cs.getCompetitionId(), discCheckbox.name);
    } else {
        console.log("Delete discipline " +  discCheckbox.name + " for "+ cs.getCompetitionName());
        server.sportsman.delDiscipline(page.sid, cs.getCompetitionId(), discCheckbox.name);
    }
}

function fillStatistics() {
    sportsmanInfo.getStatistics().forEach(cs => {
        markup.statistics.getCompStatsList().append(markup.statistics.createCompStatisticItem(cs, page.sid));
        markup.statistics.setAdmition(cs);
        var admitCheckbox = markup.statistics.getAdmitionObj(cs);
        if(client.isRoot() || client.isAdmin() || client.isTrainer())
            onClick(admitCheckbox, function(){changeParmition(cs, admitCheckbox);});
        
        departmentInfo.getDisciplines().forEach(disc => {
            var isSet = cs.getDisciplines().find( csDisc => csDisc.localeCompare(disc) == 0) != undefined ? true : false;
            if(client.isRoot() || client.isAdmin() || client.isTrainer()) {
                var item = markup.statistics.createDisciplineItem(cs, disc);
                markup.statistics.getDisciplinesList(cs).append(item);
                var discBtn = markup.statistics.getDisciplineObj(cs, disc);
                onClick(discBtn, function(){changeDiscipline(cs, discBtn);});
                if(isSet)
                    markup.statistics.setDiscipline(cs, disc);
            } else if(isSet){
                var item = markup.statistics.createDisciplineItem(cs, disc);
                markup.statistics.getDisciplinesList(cs).append(item);
                markup.statistics.setDiscipline(cs, disc);
            }
        });
        var csPairs = cs.getPairs();
        cs.getGroupsStats().forEach(gs => {
            markup.statistics.getGroupStatsList(cs).append(markup.statistics.createGroupStatItem(cs, gs));
            var groupPairs = csPairs.filter(pair => gs.getGroupId() == pair.getGroupId());
            groupPairs.forEach(pair => {
                markup.statistics.getArena(cs, gs).append(markup.statistics.createPairsItem(pair, sportsmanInfo));
            });
        });
    });
}

/* ------------------- COMMON ----------------------------*/

function sportsmanInfoEdit(){
    var nameInput = markup.sportsman.getNameInput();
    
    if(nameInput != null){
        var sp = ops.createSportsman();
        sp.setName(markup.sportsman.getNameInput().value);
        sp.setSurname(markup.sportsman.getSurnameInput().value);
        sp.setSex(markup.sportsman.getSexInput().value);
        sp.setBirth(markup.sportsman.getAgeInput().value);
        sp.setWeight(markup.sportsman.getWeightInput().value);
        sp.setQualification(markup.sportsman.getQualInput().value);
        sp.setTrainer(markup.sportsman.getTrainerInput().value);
        server.sportsman.edit(page.sid, sp);
        return;
    }

    var namePlace = markup.sportsman.getInfoName();
    namePlace.innerHTML = "";
    namePlace.appendChild(markup.sportsman.getNameInputTemplate()); 
    markup.sportsman.getNameInput().value = sportsmanInfo.getName();

    var surnamePlace = markup.sportsman.getInfoSurname();
    surnamePlace.innerHTML = "";
    surnamePlace.appendChild(markup.sportsman.getSurnameInputTemplate());
    markup.sportsman.getSurnameInput().value = sportsmanInfo.getSurname();

    var sexPlace = markup.sportsman.getInfoSex();
    sexPlace.innerHTML = "";
    sexPlace.appendChild(markup.sportsman.getSexInputTemplate());
    if(sportsmanInfo.getSex() != "")
        markup.sportsman.getSexInput().value = sportsmanInfo.getSex();
/*
    var agePlace = markup.sportsman.getInfoAge();
    agePlace.innerHTML = "";
    var elem = markup.sportsman.getAgeInputTemplate()
    agePlace.appendChild(elem);
    markup.sportsman.getAgeInput().value = sportsmanInfo.getBirth();
*/
    markup.sportsman.getAgeInput().disabled = false;
    var weightPlace = markup.sportsman.getInfoWeight();
    weightPlace.innerHTML = "";
    weightPlace.appendChild(markup.sportsman.getWeightInputTemplate());
    markup.sportsman.getWeightInput().value = sportsmanInfo.getWeight();

    var qualPlace = markup.sportsman.getInfoQual();
    qualPlace.innerHTML = "";
    qualPlace.appendChild(markup.sportsman.getQualInputTemplate());
    var qualList = markup.sportsman.getQualInput();
    qualificationsMap.forEach(function(name, value) {
        var optMin = markup.sportsman.createOption(name, value);
        qualList.appendChild(optMin);
        if(sportsmanInfo.getQualification() == value)
            qualList.value = value;
    });

    var trainersPlace = markup.sportsman.getInfoTrainer();
    trainersPlace.innerHTML = "";
    trainersPlace.appendChild(markup.sportsman.getTrainerInputTemplate());
    var trainersList = markup.sportsman.getTrainerInput();
    departmentInfo.getTrainers().forEach(function(trainer) {
        var id = trainer.getId();
        var trOpt = markup.sportsman.createOption(trainer.getSurname() + " " + trainer.getName(), id);
        trainersList.appendChild(trOpt);
        if(helpers.strEquals(sportsmanInfo.getTrainer(), id))
            trainersList.value = id;
    });
}

function fillPageInfo(){
    var sportsName = sportsmanInfo.getSurname() + " " + sportsmanInfo.getName();
    var trainer = departmentInfo.getTrainers().find(tr => helpers.strEquals(tr.getId(), sportsmanInfo.getTrainer()));
    var trainerName = trainer != undefined ? trainer.getSurname() + " " + trainer.getName() : "";

    markup.sportsman.setPageName(departmentInfo.getName());
    markup.sportsman.setDepartmentName(departmentInfo.getName());
    markup.sportsman.setDepartmentLink(departmentLink);
    markup.sportsman.setSportsmanHeader(sportsName);
    markup.sportsman.setSportsmanName(sportsName);
    markup.sportsman.setSportsmanLink(window.location.href);
    markup.sportsman.setPhoto(sportsmanInfo.getPhoto());

    markup.sportsman.getInfoId().innerHTML        = sportsmanInfo.getId();
    markup.sportsman.getInfoName().innerHTML      = sportsmanInfo.getName();
    markup.sportsman.getInfoSurname().innerHTML   = sportsmanInfo.getSurname();
    markup.sportsman.getInfoSex().innerHTML       = sportsmanInfo.getSex();
    markup.sportsman.getAgeInput().value          = sportsmanInfo.getBirth("dd/mm/yy");
    markup.sportsman.getInfoWeight().innerHTML    = sportsmanInfo.getWeight();
    markup.sportsman.getInfoQual().innerHTML      = qualificationsMap.get("" + sportsmanInfo.getQualification());
    markup.sportsman.getInfoTeam().innerHTML      = sportsmanInfo.getTeam();
    markup.sportsman.getInfoTrainer().innerHTML   = trainerName;
    markup.sportsman.getInfoRegion().innerHTML    = sportsmanInfo.getRegion();

    markup.sportsman.setDelBtnLink(departmentLink);
    fillStatistics();
}

function setBtnActions(){
    onClick(markup.sportsman.getEditBtn(),          sportsmanInfoEdit);
    onClick(markup.sportsman.getDelBtn(),           function(){ server.sportsman.remove(page.sid); });
    onClick(markup.sportsman.getChangePhotoBtn(),   function(){ server.sportsman.changePhoto(page.sid, markup.sportsman.getPhotoForm()); });
}

prepareTabs();
fillPageInfo();
setBtnActions();
showShadows(client);
languageSwitchingOn();