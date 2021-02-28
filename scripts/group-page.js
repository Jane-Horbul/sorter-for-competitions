


import {sendRequest} from "./common.js"
import {isNumber} from "./common.js"
import {getLinkParams} from "./common.js"
import {sendForm} from "./common.js"

var pageParams = getLinkParams(location.search);
var pageInfo = sendRequest("/group-get?cid=" + pageParams.get("cid") + "&gid=" + pageParams.get("gid"));
var competitionParams = sendRequest("/competition-params-get?" + "cid=" + pageParams.get("cid"));
var qualsMap = competitionParams.get("Qualifications");

function sendNotification(name, value) {
    var paramsMap = new Map();
    paramsMap.set(name, value);
    paramsMap.set("cid", pageParams.get("cid"));
    paramsMap.set("gid", pageParams.get("gid"));
    sendForm('/competition-edition', paramsMap);
}

function deleteGroup(){
    sendNotification("group-delete", pageParams.get("gid"));
}

function memberNameGet(id){
    console.log(id);
    if(!isNumber(id)){
        return "Winner of " + id;
    }
    var member = pageInfo.get("Members").find( memb => memb.get("id") == id );
    if(member == undefined){
        return "";
    }
    return member.get("name") + " " + member.get("surname");
}

function memberDelete(id){
    var table = document.getElementById("members-table");
    var memberName = memberNameGet(id);

    for(var i = 2; i < table.rows.length; i++) {
        if(table.rows[i].cells[0].innerHTML.localeCompare(memberName) == 0){
            table.deleteRow(i);
            sendNotification("group-member-delete", id);
            setTimeout(refreshPairs, 1000);
            return;
        }
    }
    
}

function memberElementCreate(member){
    if(member.get("id") == undefined) return "";
    var template = document.getElementById("member-template").content.cloneNode(true);
    template.getElementById("member-name").innerHTML = member.get("name") + " " + member.get("surname"); 
    template.getElementById("member-age").innerHTML = member.get("age");
    template.getElementById("member-weight").innerHTML = member.get("weight");
    template.getElementById("member-sex").innerHTML = member.get("sex");
    template.getElementById("member-team").innerHTML = member.get("team");
    template.getElementById("member-qualification").innerHTML = qualsMap.get(member.get("qualification"));
    template.getElementById("member-admited").innerHTML = member.get("admited");
    template.getElementById("member-name").setAttribute("onclick", "window.location.href='"
                                    + document.referrer + "/member?mid=" + member.get("id") + "'; return false");
    template.getElementById("member-dell-btn").addEventListener("click", function(){memberDelete(member.get("id"))}, false);
    return template;
}

function pairElementCreate(pair){
    if(pair.get("id") == undefined){
        return "";
    }
    var template = document.getElementById("pair-template").content.cloneNode(true);
    var memberRedId = pair.get("member_red");
    var memberBlueId = pair.get("member_blue");
    
    template.getElementById("pair-id").innerHTML = pair.get("id"); 
    template.getElementById("pair-winner").innerHTML = pair.get("winner");
    template.getElementById("pair-red").innerHTML = memberNameGet(memberRedId);
    template.getElementById("pair-blue").innerHTML = memberNameGet(memberBlueId);
    if(Number(memberRedId) >= 0){
        template.getElementById("pair-red").setAttribute("onclick", "window.location.href='"
                                    + document.referrer + "/member?mid=" + memberRedId + "'; return false"); 
    }
    if(Number(memberBlueId) >= 0){
        template.getElementById("pair-blue").setAttribute("onclick", "window.location.href='"
                                    + document.referrer + "/member?mid=" + memberBlueId + "'; return false"); 
    }
    return template;
}

function getQualificationInterval(qMin, qMax){
    var qMinName;
    var qMaxName;
    if(!isNumber(qMin) || (Number(qMin) < 0) || (qualsMap.get(qMin) == undefined)){
        qMinName = "";
    } else {
        qMinName = qualsMap.get(qMin);
    }
    if(!isNumber(qMax) || (Number(qMax) < 0) || (qualsMap.get(qMax) == undefined)){
        qMaxName = "";
    } else {
        qMaxName = qualsMap.get(qMax);
    }
    if(Number(qMax) == Number(qMin)) return qMinName;
    return qMinName + " - " + qMaxName;
}

function fillPageInfo(params){
    console.log(params);
    var membersTable = document.getElementById("members-table");
    var pairsTable = document.getElementById("pairs-table");

    document.getElementById("group-name").innerHTML = params.get("Name");
    document.getElementById("group-division").innerHTML = params.get("Division");
    document.getElementById("group-age").innerHTML = params.get("Age_min") + " - " + params.get("Age_max") + " years";
    document.getElementById("group-weight").innerHTML = params.get("Weight_min") + " - " + params.get("Weight_max") + " kg";
    document.getElementById("group-sex").innerHTML = params.get("Sex");
    document.getElementById("group-qulification").innerHTML = getQualificationInterval(params.get("Qualification_min"), params.get("Qualification_max"));

    params.get("Members").forEach(mem => membersTable.append(memberElementCreate(mem)));
    params.get("Pairs").forEach(pair =>   pairsTable.append(pairElementCreate(pair)));
}

function refreshPairs(){
    var pairsTable = document.getElementById("pairs-table");
    pageInfo = sendRequest("/group-pairs-refresh?cid=" + pageParams.get("cid") + "&gid=" + pageParams.get("gid"));
    while(pairsTable.rows.length > 2){
        pairsTable.deleteRow(pairsTable.rows.length - 1);
    }
    pageInfo.get("Pairs").forEach(pair =>   pairsTable.append(pairElementCreate(pair)));
}

fillPageInfo(pageInfo);
document.getElementById("update-pairs-btn").addEventListener("click", refreshPairs, false);
document.getElementById("delete-group-btn").addEventListener("click", deleteGroup, false);
document.getElementById("priv-page-link").setAttribute("href", document.referrer)