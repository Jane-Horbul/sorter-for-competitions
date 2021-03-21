import {sendRequest} from "./common.js"
import {getLinkParams} from "./common.js"
import {showAllIfAdmin} from "./common.js"

var pageParams = getLinkParams(location.search);

function competitionElementCreate(competition){
    if(competition.get("id") == undefined) return "";
    var template = document.getElementById("competition-template").content.cloneNode(true);
    template.getElementById("competition-link").setAttribute("href", "competition?clist=" + pageParams.get("clist") +
                                                                        "&cid=" + competition.get("id"));
    template.getElementById("competition-name").innerHTML = competition.get("name");
    template.getElementById("competition-desc").innerHTML = competition.get("description");
    return template;
}

const competitionList = sendRequest('/competition-list-get?clist=' + pageParams.get("clist")).get("Competitions");
console.log(competitionList);
for (var [key, value] of competitionList) {
    console.log(key + ' = ' + value);
  }

showAllIfAdmin();
var list = document.getElementById("competitions-list");
competitionList.forEach(competition => {
    list.prepend(competitionElementCreate(competition));
});