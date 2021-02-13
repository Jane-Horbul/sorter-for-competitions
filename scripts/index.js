import {parseAnswerParams} from "./common.js"

function getCompetitionList() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/competition-list-get-default', false);
    xhr.send();
    if (xhr.status != 200)   return new Map();
    
    return parseAnswerParams(xhr.responseText);
}

function competitionElementCreate(competition){
    if(competition.get("id") == undefined) return "";
    var template = document.getElementById("competition-template").content.cloneNode(true);
    template.getElementById("competition-link").setAttribute("href", "competition?" + competition.get("id"));
    template.getElementById("competition-name").innerHTML = competition.get("name");
    template.getElementById("competition-desc").innerHTML = competition.get("description");
    return template;
}

const competitionList = getCompetitionList().get("Competitions");

for (var [key, value] of competitionList) {
    console.log(key + ' = ' + value);
  }

var list = document.getElementById("competitions-list");
competitionList.forEach(competition => {
    list.prepend(competitionElementCreate(competition));
});