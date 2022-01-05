import {
    checkers,
    showShadows,
    getLinkParams,
    languageSwitchingOn,
    createPageItem,
    prepareTabs,
    onClick,
    commonStrings
} from "./common.js"
import { markup } from "./arena-create-markup.js";
import {server, ops} from "./communication.js" //закоментувати перед початком роботи
//import {ops} from "./communication.js" //закоментувати перед початком роботи
//import {server} from "./dbg_server.js" //закоментувати рядок перед комітом


const page = {
    cid: getLinkParams(location.search).get("cid")
}

var client              = server.access.getClient();
const departmentInfo    = server.department.get();
const competition       = server.competition.get(page.cid);
const competitionLink   = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
const departmentLink    = competitionLink.substr(0, competitionLink.lastIndexOf("/"));

var activeGroups        = new Array(0);
var unactiveGroups      = new Array(0);
var detachedPairs       = new Array(0);
var attachedPairs       = new Array(0);
var intervals           = new Array(0);

function activateGroup(gr){
    var item = createPageItem(markup.automation.groups.getActiveTemplate(), markup.automation.groups.getPlaceholders(gr));
    markup.automation.groups.getActiveList().append(item);
    onClick(markup.automation.groups.getActive(gr), function(){deactivateGroup(gr);});
    activeGroups.push(gr);

    var unactGr = markup.automation.groups.getUnactive(gr)
    if(unactGr != null)
        unactGr.remove();
    for(var i = 0; i < unactiveGroups.length; i++){
        if(checkers.strEquals(unactiveGroups[i].getId(), gr.getId())){
            unactiveGroups.splice(i, 1);
            break;
        }
    }
}

function deactivateGroup(gr){
    var item = createPageItem(markup.automation.groups.getUnactiveTemplate(), markup.automation.groups.getPlaceholders(gr));
    markup.automation.groups.getUnactiveList().append(item);
    onClick(markup.automation.groups.getUnactive(gr), function(){activateGroup(gr);});
    unactiveGroups.push(gr);
    
    var actGr = markup.automation.groups.getActive(gr)
    if(actGr != null)
        actGr.remove();
    for(var i = 0; i < activeGroups.length; i++){
        if(checkers.strEquals(activeGroups[i].getId(), gr.getId())){
            activeGroups.splice(i, 1);
            break;
        }
    }
}

function activateAllGroups(){
    for(;unactiveGroups.length > 0;){
        activateGroup(unactiveGroups[0]);
    }
}

function deactivateAllGroups(){
    for(;activeGroups.length > 0;){
        deactivateGroup(activeGroups[0]);
    }
}

function attachPair(pair){
    var item = createPageItem(markup.manual.getAttachedPairTemplate(), markup.manual.getPairPlaceholders(pair));
    markup.manual.getAttachedPairsList().append(item);
    onClick(markup.manual.getAttachedPair(pair), function(){detachPair(pair);});
    attachedPairs.push(pair);

    var detachedPair = markup.manual.getDetachedPair(pair)
    if(detachedPair != null) detachedPair.remove();

    for(var i = 0; i < detachedPairs.length; i++){
        if(checkers.strEquals(detachedPairs[i].getId(), pair.getId())){
            detachedPairs.splice(i, 1);
            break;
        }
    }
}

function detachPair(pair){
    if(pair.getPairsList() != undefined)
        return;
    var item = createPageItem(markup.manual.getDetachedPairTemplate(), markup.manual.getPairPlaceholders(pair));
    markup.manual.getDetachedPairsList().append(item);
    onClick(markup.manual.getDetachedPair(pair), function(){attachPair(pair);});
    detachedPairs.push(pair);
    
    var attachedPair = markup.manual.getAttachedPair(pair)
    if(attachedPair != null) attachedPair.remove();

    for(var i = 0; i < attachedPairs.length; i++){
        if(checkers.strEquals(attachedPairs[i].getId(), pair.getId())){
            attachedPairs.splice(i, 1);
            break;
        }
    }
}

function attachAllPairs(){
    for(;detachedPairs.length > 0;){
        attachPair(detachedPairs[0]);
    }
}

function detachAllPairs(){
    for(;attachedPairs.length > 0;){
        detachPair(attachedPairs[0]);
    }
}

function deleteInterval(rowNum){
    var table = markup.automation.schedule.getContainer();
    table.deleteRow(rowNum);
}

function createInterval(){
    var start = markup.automation.schedule.getStartIntervalInput().value;
    var end = markup.automation.schedule.getEndIntervalInput().value;
    
    if(!checkers.checkDateTime(start) || !checkers.checkDateTime(end)) return;
    if(checkers.compareDateTimes(start, end) > 0){
        alert("Start time bigger than end time.")
        return;
    }
    for(var i = 0; i < intervals.length; i++){
        if((checkers.compareDateTimes(start, intervals[i].start) >= 0) && (checkers.compareDateTimes(start, intervals[i].end) <= 0)){
            alert("Intersection with " + intervals[i].start + " - " + intervals[i].end + " interval found.")
            return;
        } 
    }
    
    var table = markup.automation.schedule.getContainer();
    var rowNum = table.rows.length - 1;

    var item = createPageItem(markup.automation.schedule.getTemplate(), 
                        markup.automation.schedule.getPlaceholders(start, end, rowNum));
    markup.automation.schedule.insertNewInterval(item);
    onClick(markup.automation.schedule.getDelBtn(rowNum), function(){ deleteInterval(rowNum); });
    intervals.push({start: start, end: end});

}

function createArenaAutomatic(){
    var name = markup.common.getArenaName();
    var distance = markup.automation.getDistanceValue();
    var ageMin = markup.automation.getAgeMinValue();
    var ageMax = markup.automation.getAgeMaxValue();
    var weightMin = markup.automation.getWeightMinValue();
    var weightMax = markup.automation.getWeightMaxValue();
    var qualMin = markup.automation.qualifications.getMinList().value;
    var qualMax = markup.automation.qualifications.getMaxList().value;
    var finalMin = markup.automation.getFinalMinValue();
    var finalMax = markup.automation.getFinalMaxValue();
    var arena = ops.createArena(undefined);

    if(!checkers.checkName("Arena name", name))
        return;
    if(checkers.isNumber(qualMin) && checkers.isNumber(qualMax) && Number(qualMin) > Number(qualMax)){
        alert("Minimal qualification must be lower or equal than maximal");
        return;
    }
    arena.setName(name);

    var groupsIds = "";
    var first = true;
    activeGroups.forEach(gr => {
        if(first) 
            first = false;
        else 
            groupsIds += commonStrings.arrDivider;
        groupsIds += gr.getId();
    });
    
    var scheduleStr = "";
    first = true;
    intervals.forEach(interval => {
        if(first) 
            first = false;
        else 
            scheduleStr += commonStrings.arrDivider;
        scheduleStr += interval.start + commonStrings.mapDivider + interval.end;
    });

    arena.setGroups(groupsIds);
    arena.setSchedule(scheduleStr);
    if(checkers.isNumber(distance))     arena.setDistance(distance);
    if(checkers.isNumber(ageMin))       arena.setAgeMin(ageMin);
    if(checkers.isNumber(ageMax))       arena.setAgeMax(ageMax);
    if(checkers.isNumber(weightMin))    arena.setWeightMin(weightMin);
    if(checkers.isNumber(weightMax))    arena.setWeightMax(weightMax);
    if(checkers.isNumber(finalMin))     arena.setFinalMin(finalMin);
    if(checkers.isNumber(finalMax))     arena.setFinalMax(finalMax);
    if(checkers.isNumber(qualMin))      arena.setQualMin(qualMin);
    if(checkers.isNumber(qualMax))      arena.setQualMax(qualMax);
    
    server.arena.create(page.cid, arena.params);
    document.location.href = competitionLink;
}

function createArenaManual(){
    var name = markup.common.getArenaName();
    var arena = ops.createArena(undefined);
    if(!checkers.checkName("Arena name", name))
        return;
    arena.setName(name);
    var pids = "";
    var first = true;
    attachedPairs.forEach(pr => {
        if(first) 
            first = false;
        else 
            pids += commonStrings.arrDivider;
        pids += pr.getId();
    });
    arena.setPairs(pids);
    server.arena.create(page.cid, arena.params);
    document.location.href = competitionLink;
}


function fillPageInfo(){
    markup.common.setPageHeader(competition.getName());
    markup.common.setPageHeaderLink(competitionLink);
    markup.common.setDepartmentLink(departmentInfo.getName(), departmentLink);
    markup.common.setCompetitionLink(competition.getName(), competitionLink);
    console.log(competition);
    competition.getGroups().forEach(gr => {
        deactivateGroup(gr);
    });

    var qTemp = markup.automation.qualifications.getTemplate();
    departmentInfo.getQualifications().forEach(function(name, value) {
        var ph = markup.automation.qualifications.getPlaceholders(name, value);
        markup.automation.qualifications.getMinList().append(createPageItem(qTemp, ph));
        markup.automation.qualifications.getMaxList().append(createPageItem(qTemp, ph));
    });
}

function fillPairsList(){
    competition.getGroups().forEach(gr => {
        var group = server.group.get(competition.getId(), gr.getId());
        group.getPairs().forEach(pair => detachPair(pair));
    });
}

function setBtnActions(){
    onClick(markup.automation.groups.getAddAllBtn(), activateAllGroups);
    onClick(markup.automation.groups.getDelAllBtn(), deactivateAllGroups);
    onClick(markup.automation.getApplyBtn(), createArenaAutomatic);
    onClick(markup.automation.schedule.getAddBtn(), createInterval);

    onClick(markup.manual.getAttachAllPairsBtn(), attachAllPairs);
    onClick(markup.manual.getDetachAllPairsBtn(), detachAllPairs);
    onClick(markup.manual.getApplyBtn(), createArenaManual);


}


prepareTabs();
fillPageInfo();
setBtnActions();
showShadows(client);
languageSwitchingOn();
fillPairsList();