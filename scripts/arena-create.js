import {
    helpers,
    showShadows,
    getLinkParams,
    languageSwitchingOn,
    createPageItem,
    prepareTabs,
    onClick,
    commonStrings,
    prepareClient,
    onPageLoad
} from "./common.js"

import { markup } from "./arena-create-markup.js";
import {server, ops} from "./communication.js"


const page = {
    cid: getLinkParams(location.search).get("cid")
}

const client            = server.access.getClient();
const departmentInfo    = server.department.get();
const competition       = server.competition.get(page.cid);
const competitionLink   = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
const departmentLink    = competitionLink.substring(0, competitionLink.lastIndexOf("/"));

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
        if(helpers.strEquals(unactiveGroups[i].getId(), gr.getId())){
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
        if(helpers.strEquals(activeGroups[i].getId(), gr.getId())){
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
        if(helpers.strEquals(detachedPairs[i].getId(), pair.getId())){
            detachedPairs.splice(i, 1);
            break;
        }
    }
}

function detachPair(pair){
    if(pair.getArena() != undefined)
        return;
    var item = createPageItem(markup.manual.getDetachedPairTemplate(), markup.manual.getPairPlaceholders(pair));
    markup.manual.getDetachedPairsList().append(item);
    onClick(markup.manual.getDetachedPair(pair), function(){attachPair(pair);});
    detachedPairs.push(pair);
    
    var attachedPair = markup.manual.getAttachedPair(pair)
    if(attachedPair != null) attachedPair.remove();

    for(var i = 0; i < attachedPairs.length; i++){
        if(helpers.strEquals(attachedPairs[i].getId(), pair.getId())){
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

function deleteInterval(rowNum, interv){
    var table = markup.automation.schedule.getContainer();
    table.deleteRow(rowNum);
    intervals.splice(intervals.indexOf(interv), 1);
}

function createInterval(){
    var start = markup.automation.schedule.getStartIntervalInput().value;
    var end = markup.automation.schedule.getEndIntervalInput().value;
    
    if(!helpers.checkDateTime(start) || !helpers.checkDateTime(end)) return;
    if(helpers.compareDateTimes(start, end) > 0){
        alert("Start time bigger than end time.")
        return;
    }
    for(var i = 0; i < intervals.length; i++){
        if((helpers.compareDateTimes(start, intervals[i].start) >= 0) && (helpers.compareDateTimes(start, intervals[i].end) <= 0)){
            alert("Intersection with " + intervals[i].start + commonStrings.mapDivider + intervals[i].end + " interval found.")
            return;
        } 
    }
    
    var table = markup.automation.schedule.getContainer();
    var rowNum = table.rows.length - 1;

    var item = createPageItem(markup.automation.schedule.getTemplate(), 
                        markup.automation.schedule.getPlaceholders(start, end, rowNum));
    markup.automation.schedule.insertNewInterval(item);
    var elem = {start: start, end: end};
    onClick(markup.automation.schedule.getDelBtn(rowNum), function(){ deleteInterval(rowNum, elem); });
    intervals.push(elem);

}

function createArenaAutomatic(){
    var name = markup.automation.getArenaName();
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

    if(!helpers.checkName("Arena name", name))
        return;
    if(helpers.isNumber(qualMin) && helpers.isNumber(qualMax) && Number(qualMin) > Number(qualMax)){
        alert("Minimal qualification must be lower or equal than maximal");
        return;
    }
    arena.setName(name);

    var groupsIds   = helpers.arrayToString(activeGroups, function(gr){return gr.getId()});
    var scheduleStr = helpers.arrayToString(intervals, function(it){return it.start + commonStrings.mapDivider + it.end;});

    arena.setGroups(groupsIds);
    arena.setSchedule(scheduleStr);
    if(helpers.isNumber(distance))     arena.setDistance(distance);
    if(helpers.isNumber(ageMin))       arena.setAgeMin(ageMin);
    if(helpers.isNumber(ageMax))       arena.setAgeMax(ageMax);
    if(helpers.isNumber(weightMin))    arena.setWeightMin(weightMin);
    if(helpers.isNumber(weightMax))    arena.setWeightMax(weightMax);
    if(helpers.isNumber(finalMin))     arena.setFinalMin(finalMin);
    if(helpers.isNumber(finalMax))     arena.setFinalMax(finalMax);
    if(helpers.isNumber(qualMin))      arena.setQualMin(qualMin);
    if(helpers.isNumber(qualMax))      arena.setQualMax(qualMax);
    
    server.arena.create(page.cid, arena);
    document.location.href = competitionLink;
}

function createArenaManual(){
    var name = markup.manual.getArenaName();
    var arena = ops.createArena(undefined);
    if(!helpers.checkName("Arena name", name))
        return;
    arena.setName(name);
    var pids = helpers.arrayToString(attachedPairs, function(pr){return pr.getId()});
    arena.setPairs(pids);
    server.arena.create(page.cid, arena);
    document.location.href = competitionLink;
}


function fillPageInfo(){
    markup.common.setPageHeader(competition.getName());
    markup.breadcrumbs.setDpLink();
    markup.breadcrumbs.setCompLink();
    markup.breadcrumbs.setCompName(competition.getName());

    markup.automation.schedule.startCalendarInit();
    markup.automation.schedule.endCalendarInit();
    
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

function main() {
    prepareClient(client);
    prepareTabs();
    fillPageInfo();
    setBtnActions();
    showShadows(client);
    languageSwitchingOn(client.getLang());
    fillPairsList();
}
onPageLoad(main);