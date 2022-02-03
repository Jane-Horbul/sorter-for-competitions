import {
    helpers,
    showShadows,
    getLinkParams,
    languageSwitchingOn,
    createPageItem,
    prepareTabs,
    onClick,
    commonStrings,
    prepareClient
} from "./common.js"
import { markup } from "./arena-markup.js";
import {server, ops} from "./communication.js"


const page = {
    cid: getLinkParams(location.search).get("cid"),
    aid: getLinkParams(location.search).get("aid"),
}

const client = server.access.getClient();
prepareClient(client);

export const department     = server.department.get();
export const competition    = server.competition.get(page.cid);
export const arena          = server.arena.get(page.cid, page.aid);
console.log(arena);
var attachedPairs = new Array(0);
var pairsToAttach = new Array(0);
var attachedGroups = new Array(0);
var groupsToAttach = new Array(0);
var intervals     = new Array(0);

function deletePairFromList(pair){
    for( var i = 0; i < attachedPairs.length; i++){
        if(helpers.strEquals(pair.getId(), attachedPairs[i].getId())){
            attachedPairs.splice(i, 1);
        }
    }
    markup.pair.removeFromList(pair);
    server.arena.pairRemove(page.cid, page.aid, pair.getId());
}

function changePairSelection(pair){
    var pairRow = markup.pair.getUnattachedItem(pair);
    if(helpers.strEquals(pairRow.className, markup.selectedStyle)){
        pairRow.className = "";
        for(var i = 0; i < pairsToAttach.length; i++){
            if(helpers.strEquals(pairsToAttach[i].getId(), pair.getId())){
                pairsToAttach.splice(i, 1);
                break;
            }
        }
    }
    else{
        pairRow.className = markup.selectedStyle;
        pairsToAttach.push(pair);
    }  
}

function attachPair(pair){
    var item = createPageItem(markup.pair.getTemplate(), markup.pair.getPlaceholders(pair));
    markup.pair.getContainer().append(item);
    onClick(markup.pair.getDeleteBtn(pair), function(){ deletePairFromList(pair); });
    attachedPairs.push(pair);
}

function addPairs(){
    var pids = helpers.arrayToString(attachedPairs, function(pr){return pr.getId()})
                + helpers.arrayToString(pairsToAttach, function(pr){return pr.getId()});
    server.arena.pairsListRebuild(page.cid, page.aid, pids);
}

function resortPairs(){
    var pids = new Array(0);
    markup.pair.getNumbers().forEach(num => pids.push(attachedPairs[num - 1].getId()));
    server.arena.pairsListRebuild(page.cid, page.aid, helpers.arrayToString(pids));
}

function deleteArena(){
    server.arena.remove(page.cid, page.aid);
    document.location.href = markup.competitionLink;
}

function deleteInterval(rowNum, intervalNum){
    var table = markup.schedule.getContainer();
    table.deleteRow(rowNum);
    console.log(intervalNum)
    intervals.splice(intervalNum, 1);
}

function createInterval(start, end){
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
    var table = markup.schedule.getContainer();
    var rowNum = table.rows.length - 1;
    var item = createPageItem(markup.schedule.getTemplate(), 
                        markup.schedule.getPlaceholders(start, end, rowNum));
    markup.schedule.insertNewInterval(item);
    (function(rowNum, intNum){
        onClick(markup.schedule.getDelBtn(rowNum), function(){ deleteInterval(rowNum, intNum); });
    })(rowNum, intervals.length)
    intervals.push({start: start, end: end});
}

function detachGroup(gid){
    markup.groups.getAttached(gid).remove();
}

function attachGroup(gp){
    var item = createPageItem(markup.groups.getTemplate(), markup.groups.getPlaceholders(gp));
    markup.groups.getContainer().append(item);
    onClick(markup.groups.getDelBtn(gp), function(){detachGroup(gp.getId())});
    attachedGroups.push(gp);
}

function changeGroupSelection(gp){
    var row = markup.groups.getUnattachedItem(gp);
    if(helpers.strEquals(row.className, markup.selectedStyle)){
        row.className = "";
        for(var i = 0; i < groupsToAttach.length; i++){
            if(helpers.strEquals(groupsToAttach[i].getId(), gp.getId())){
                groupsToAttach.splice(i, 1);
                break;
            }
        }
    }
    else{
        row.className = markup.selectedStyle;
        groupsToAttach.push(gp);
    }  
}

function addGroups(){
    groupsToAttach.forEach(gp => attachGroup(gp));
    editArena();
}

function fillUnattached(){
    competition.getGroups().forEach(gr => {
        var group = server.group.get(competition.getId(), gr.getId());
        if(markup.groups.getAttached(group.getId()) == undefined){
            var item = createPageItem(markup.groups.getUnattachedTemplate(), markup.groups.getPlaceholders(group));
            markup.groups.getUnattachedContainer().append(item); 
            onClick(markup.groups.getUnattachedItem(group), function(){changeGroupSelection(group)});
        }
        group.getPairs().forEach(pair => {
            if(pair.getArena() == undefined){
                var item = createPageItem(markup.pair.getUnattachedTemplate(), markup.pair.getPlaceholders(pair));
                markup.pair.getUnattachedContainer().append(item); 
                onClick(markup.pair.getUnattachedItem(pair), function(){changePairSelection(pair)});
            }
        });
    });
}

function setIfNumber(val, set){
    if(helpers.isNumber(val))     set(val);
}

function editArena(){
    var eArena = ops.createArena(undefined);
    var name = markup.settings.getNameInput().value;
    var qualMin = markup.settings.getQualMinInput().value;
    var qualMax = markup.settings.getQualMaxInput().value;
    
    if(!helpers.checkName("Arena name", name))
        return;
    if(helpers.isNumber(qualMin) && helpers.isNumber(qualMax) && Number(qualMin) > Number(qualMax)){
        alert("Minimal qualification must be lower or equal than maximal");
        return;
    }
    eArena.setName(name);
    setIfNumber(markup.settings.getDistanceInput().value,   function(val){eArena.setDistance(val);});
    setIfNumber(markup.settings.getAgeMinInput().value,     function(val){eArena.setAgeMin(val);});
    setIfNumber(markup.settings.getAgeMaxInput().value,     function(val){eArena.setAgeMax(val);});
    setIfNumber(markup.settings.getWeightMinInput().value,  function(val){eArena.setWeightMin(val);});
    setIfNumber(markup.settings.getWeightMaxInput().value,  function(val){eArena.setWeightMax(val);});
    setIfNumber(markup.settings.getFinalMinInput().value,   function(val){eArena.setFinalMin(val);});
    setIfNumber(markup.settings.getFinalMaxInput().value,   function(val){eArena.setFinalMax(val);});
    setIfNumber(qualMin, eArena.setQualMin);
    setIfNumber(qualMax, eArena.setQualMax);
    

    var gids = markup.groups.getContainerIds();
    var groupsIds = "";
    for(var i = 0; i < gids.length; i++){
        groupsIds += i > 0 ? (commonStrings.arrDivider + gids[i]) : gids[i];
    }
    eArena.setGroups(groupsIds);

    var scheduleStr = "";
    for(var i = 0; i < intervals.length; i++){
        scheduleStr += (i > 0 ? commonStrings.arrDivider : "") + intervals[i].start + commonStrings.mapDivider + intervals[i].end
    }
    eArena.setSchedule(scheduleStr);
    server.arena.edit(page.cid, page.aid, eArena);
}

function fillPageInfo(){
    markup.breadcrumbs.setDpLink();
    markup.breadcrumbs.setCompLink();
    markup.breadcrumbs.setCompName(competition.getName());
    markup.breadcrumbs.setArenaName(arena.getName());

    markup.common.setPageName(arena.getName());

    var qTemp = markup.settings.getQualTemplate();
    department.getQualifications().forEach(function(name, value) {
        var ph = markup.settings.getQualPlaceholders(name, value);
        markup.settings.getQualMinInput().append(createPageItem(qTemp, ph));
        markup.settings.getQualMaxInput().append(createPageItem(qTemp, ph));
    });
    markup.settings.getNameInput().value = arena.getName(); 
    markup.settings.getDistanceInput().value = helpers.getIfDefined(arena.getDistance(), "-");
    markup.settings.getAgeMinInput().value = helpers.getIfDefined(arena.getAgeMin(), "-");
    markup.settings.getAgeMaxInput().value = helpers.getIfDefined(arena.getAgeMax(), "-");
    markup.settings.getWeightMinInput().value = helpers.getIfDefined(arena.getWeightMin(), "-");
    markup.settings.getWeightMaxInput().value = helpers.getIfDefined(arena.getWeightMax(), "-");
    markup.settings.getFinalMinInput().value = helpers.getIfDefined(arena.getFinalMin(), "-");
    markup.settings.getFinalMaxInput().value = helpers.getIfDefined(arena.getFinalMax(), "-");
    markup.settings.getQualMinInput().value = helpers.getIfDefined(arena.getQualMin(), "Not applicable");
    markup.settings.getQualMaxInput().value = helpers.getIfDefined(arena.getQualMax(), "Not applicable");

    arena.getSchedule().forEach(sch => createInterval(sch.start, sch.end));
    arena.getGroups().forEach(gp => attachGroup(gp));

    if(undefined != arena.getActivePair()){
        var activePair = arena.getActivePair();
        var item = createPageItem(markup.pair.getActiveTemplate(), markup.pair.getPlaceholders(activePair));
        markup.pair.getActiveContainer().append(item);
    }
    arena.getPairs().forEach(pair => attachPair(pair));
}

function setBtnActions(){
    if(client.isAdmin() || client.isRoot()){
        onClick(markup.pair.getAddBtn(), addPairs);
        onClick(markup.schedule.getAddBtn(), function() {
            createInterval(markup.schedule.getStartIntervalInput().value, markup.schedule.getEndIntervalInput().value);
        });
        onClick(markup.common.getDeleteBtn(), deleteArena);
        onClick(markup.common.getRefilterBtn(), function(){server.arena.filterPairs(page.cid, page.aid);});
        onClick(markup.groups.getApplyBtn(), editArena);
        onClick(markup.groups.getAddBtn(), addGroups);
        
        markup.pair.setUpdateCallback(resortPairs);
        markup.groups.setUpdateCallback(function(){});
    }
}

prepareTabs();
fillPageInfo();
setBtnActions();
showShadows(client);
languageSwitchingOn();
setTimeout(fillUnattached, 0);

