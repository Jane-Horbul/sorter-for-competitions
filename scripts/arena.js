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

function fillPageInfo(){
    var bc = createPageItem(markup.breadcrumbs.getTemplate(), 
                    markup.breadcrumbs.getPlaceholders(department, competition, arena));
    markup.breadcrumbs.getContainer().append(bc);
    markup.common.setListName(arena.getName());
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
    onClick(markup.pair.getAddBtn(), addPairs);
}

prepareTabs();
fillPageInfo();
setBtnActions();
showShadows(client);
languageSwitchingOn();
fillUnattachedPairsList();