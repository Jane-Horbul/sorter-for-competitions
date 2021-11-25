import {
    showShadows,
    getLinkParams,
    languageSwitchingOn,
    createPageItem,
    prepareTabs,
    onClick
} from "./common.js"
import { markup } from "./create-place-page-markup.js";
import {server} from "./communication.js"
//import {server} from "./dbg_server.js"


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

function activateGroup(gr){
    var item = createPageItem(markup.automation.getActiveGroupTemplate(), markup.automation.getGroupPlaceholders(gr));
    markup.automation.getActiveGroupsList().append(item);
    onClick(markup.automation.getActiveGroup(gr), function(){deactivateGroup(gr);});
    activeGroups.push(gr);

    var unactGr = markup.automation.getUnactiveGroup(gr)
    if(unactGr != null)
        unactGr.remove();
    for(var i = 0; i < unactiveGroups.length; i++){
        if(unactiveGroups[i].getId().localeCompare(gr.getId()) == 0){
            unactiveGroups.splice(i, 1);
            break;
        }
    }
}

function deactivateGroup(gr){
    var item = createPageItem(markup.automation.getUnactiveGroupTemplate(), markup.automation.getGroupPlaceholders(gr));
    markup.automation.getUnactiveGroupsList().append(item);
    onClick(markup.automation.getUnactiveGroup(gr), function(){activateGroup(gr);});
    unactiveGroups.push(gr);
    
    var actGr = markup.automation.getActiveGroup(gr)
    if(actGr != null)
        actGr.remove();
    for(var i = 0; i < activeGroups.length; i++){
        if(activeGroups[i].getId().localeCompare(gr.getId()) == 0){
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
        if(detachedPairs[i].getId().localeCompare(pair.getId()) == 0){
            detachedPairs.splice(i, 1);
            break;
        }
    }
}

function detachPair(pair){
    if(pair.getPairsList() != undefined)
        return;
    console.log("detach "+ pair.getId())
    var item = createPageItem(markup.manual.getDetachedPairTemplate(), markup.manual.getPairPlaceholders(pair));
    markup.manual.getDetachedPairsList().append(item);
    onClick(markup.manual.getDetachedPair(pair), function(){attachPair(pair);});
    detachedPairs.push(pair);
    
    var attachedPair = markup.manual.getAttachedPair(pair)
    if(attachedPair != null) attachedPair.remove();

    for(var i = 0; i < attachedPairs.length; i++){
        if(attachedPairs[i].getId().localeCompare(pair.getId()) == 0){
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


function fillPageInfo(){
    markup.common.setPageHeader(competition.getName());
    markup.common.setPageHeaderLink(competitionLink);
    markup.common.setDepartmentLink(departmentInfo.getName(), departmentLink);
    markup.common.setCompetitionLink(competition.getName(), competitionLink);
    competition.getGroups().forEach(gr => {
        deactivateGroup(gr);
        gr.getPairs().forEach(pair => detachPair(pair));
    });
    
}

function setBtnActions(){
    onClick(markup.automation.getAddAllGroupsBtn(), activateAllGroups);
    onClick(markup.automation.getDelAllGroupsBtn(), deactivateAllGroups);
    onClick(markup.manual.getAttachAllPairsBtn(), attachAllPairs);
    onClick(markup.manual.getDetachAllPairsBtn(), detachAllPairs);
}


prepareTabs();
fillPageInfo();
setBtnActions();
showShadows(client);
languageSwitchingOn();