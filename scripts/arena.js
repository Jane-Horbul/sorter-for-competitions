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
        var item = createPageItem(markup.pair.getTemplate(), markup.pair.getPlaceholders(pair, department));
        markup.pair.getContainer().append(item);
    });
}

function setBtnActions(){

}

prepareTabs();
fillPageInfo();
setBtnActions();
showShadows(client);
languageSwitchingOn();