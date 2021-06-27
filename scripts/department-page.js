import {sendRequest} from "./common.js"
import {getLinkParams} from "./common.js"
import {showAllIfAdmin} from "./common.js"
import {languageSwitchingOn} from "./common.js"
import {insertElement} from "./common.js"

var pageParams = getLinkParams(location.search);

function competitionElementCreate(competition){
    if(competition.get("id") == undefined) return "";
    
    var compParams = new Map();
    compParams.set("#competition-link", "competition?clist=" + pageParams.get("clist") + "&cid=" + competition.get("id"));
    compParams.set("#competition-name", competition.get("name"));
    compParams.set("#competition-desc", competition.get("description"));

    return insertElement("competition-template")
}

showAllIfAdmin();
languageSwitchingOn();

const competitionList = sendRequest('/competition-list-get?clist=' + pageParams.get("clist")).get("Competitions");
var list = document.getElementById("competitions-list");
competitionList.forEach(competition => {
    list.prepend(competitionElementCreate(competition));
});
