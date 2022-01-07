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
import { markup } from "./arena-markup.js";
import {server, ops} from "./communication.js"


const page = {
    cid: getLinkParams(location.search).get("cid"),
    aid: getLinkParams(location.search).get("aid"),
}

var client                  = server.access.getClient();
export const department     = server.department.get();
export const competition    = server.competition.get(page.cid);
export const arena          = server.arena.get(page.cid, page.aid);
console.log(arena);

var pairsToAttach = new Array(0);
var attachedPairs = new Array(0);
var intervals     = new Array(0);

function deletePairFromList(pair){
    for( var i = 0; i < attachedPairs.length; i++){
        if(checkers.strEquals(pair.getId(), attachedPairs[i].getId())){
            attachedPairs.splice(i, 1);
        }
    }
    markup.pair.removeFromList(pair);
    server.arena.pairRemove(page.cid, page.aid, pair.getId());
}

function togleUnattachedPair(pair){
    var pairRow = markup.pair.getUnattachedItem(pair);
    if(checkers.strEquals(pairRow.className, markup.pair.selectedStyle)){
        pairRow.className = "";
        for(var i = 0; i < pairsToAttach.length; i++){
            if(checkers.strEquals(pairsToAttach[i].getId(), pair.getId())){
                pairsToAttach.splice(i, 1);
                break;
            }
        }
    }
    else{
        pairRow.className = markup.pair.selectedStyle;
        pairsToAttach.push(pair);
    }  
}

function addPairs(){
    var pids = "";
    var first = true;

    attachedPairs.forEach(pair => {
        if(!first)  pids += commonStrings.arrDivider;
        else        first = false;
        pids += pair.getId();
    });
    pairsToAttach.forEach(pair => { 
        if(!first)  pids += commonStrings.arrDivider;
        else        first = false;
        pids += pair.getId();
    });
    server.arena.pairsListRebuild(page.cid, page.aid, pids);
}

function fillUnattachedPairsList(){
    competition.getGroups().forEach(gr => {
        var group = server.group.get(competition.getId(), gr.getId());
        group.getPairs().forEach(pair => {
            if(pair.getPairsList() == undefined){
                var item = createPageItem(markup.pair.getUnattachedTemplate(), markup.pair.getPlaceholders(pair));
                markup.pair.getUnattachedContainer().append(item); 
                onClick(markup.pair.getUnattachedItem(pair), function(){togleUnattachedPair(pair)});
            }
        });
    });
}

function deleteArena(){
    server.arena.remove(page.cid, page.aid);
    document.location.href = markup.competitionLink;
}

function deleteInterval(rowNum){
    var table = markup.schedule.getContainer();
    table.deleteRow(rowNum);
}

function createInterval(start, end){
    if(!checkers.checkDateTime(start) || !checkers.checkDateTime(end)) return;
   /* if(checkers.compareDateTimes(start, end) > 0){
        alert("Start time bigger than end time.")
        return;
    }
    for(var i = 0; i < intervals.length; i++){
        if((checkers.compareDateTimes(start, intervals[i].start) >= 0) && (checkers.compareDateTimes(start, intervals[i].end) <= 0)){
            alert("Intersection with " + intervals[i].start + " - " + intervals[i].end + " interval found.")
            return;
        } 
    }*/
    var table = markup.schedule.getContainer();
    var rowNum = table.rows.length - 1;
    var item = createPageItem(markup.schedule.getTemplate(), 
                        markup.schedule.getPlaceholders(start, end, rowNum));
    markup.schedule.insertNewInterval(item);
    onClick(markup.schedule.getDelBtn(rowNum), function(){ deleteInterval(rowNum); });
    intervals.push({start: start, end: end});

}

function fillPageInfo(){
    var bc = createPageItem(markup.breadcrumbs.getTemplate(), markup.breadcrumbs.getPlaceholders(department, competition, arena));
    markup.breadcrumbs.getContainer().append(bc);
    markup.common.setListName(arena.getName());

    var qTemp = markup.settings.getQualTemplate();
    department.getQualifications().forEach(function(name, value) {
        var ph = markup.settings.getQualPlaceholders(name, value);
        markup.settings.getQualMinInput().append(createPageItem(qTemp, ph));
        markup.settings.getQualMaxInput().append(createPageItem(qTemp, ph));
    });
    markup.settings.getNameInput().value = arena.getName(); 
    markup.settings.getDistanceInput().value = checkers.getIfDefined(arena.getDistance(), "-");
    markup.settings.getAgeMinInput().value = checkers.getIfDefined(arena.getAgeMin(), "-");
    markup.settings.getAgeMaxInput().value = checkers.getIfDefined(arena.getAgeMax(), "-");
    markup.settings.getWeightMinInput().value = checkers.getIfDefined(arena.getWeightMin(), "-");
    markup.settings.getWeightMaxInput().value = checkers.getIfDefined(arena.getWeightMax(), "-");
    markup.settings.getFinalMinInput().value = checkers.getIfDefined(arena.getFinalMin(), "-");
    markup.settings.getFinalMaxInput().value = checkers.getIfDefined(arena.getFinalMax(), "-");
    markup.settings.getQualMinInput().value = checkers.getIfDefined(arena.getQualMin(), "Not applicable");
    markup.settings.getQualMaxInput().value = checkers.getIfDefined(arena.getQualMax(), "Not applicable");

    arena.getSchedule().forEach(sch => {
        var intervals = sch.split("-");
        createInterval(intervals[0], intervals[1])
    });
    

    if(undefined != arena.getActivePair()){
        var activePair = arena.getActivePair();
        var item = createPageItem(markup.pair.getActiveTemplate(), markup.pair.getPlaceholders(activePair));
        markup.pair.getActiveContainer().append(item);
    }
    arena.getPairs().forEach(pair => {
        var item = createPageItem(markup.pair.getTemplate(), markup.pair.getPlaceholders(pair));
        markup.pair.getContainer().append(item);
        onClick(markup.pair.getDeleteBtn(pair), function(){ deletePairFromList(pair); });
        attachedPairs.push(pair);
    });
}

function setBtnActions(){
    //onClick(markup.login.getLoginBtn(),         function(){server.access.login(markup.login.getLogin(), markup.login.getPass())});
    onClick(markup.pair.getAddBtn(), addPairs);
    onClick(markup.common.getDeleteBtn(), deleteArena);
    onClick(markup.common.getRefilterBtn(), function(){server.arena.filterPairs(page.cid, page.aid);});
}

prepareTabs();
fillPageInfo();
setBtnActions();
showShadows(client);
languageSwitchingOn();
fillUnattachedPairsList();