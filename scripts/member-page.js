
import {sendRequest} from "./common.js"
import {isNumber} from "./common.js"
import {getLinkParams} from "./common.js"
import {sendForm} from "./common.js"

var pageParams = getLinkParams(location.search);
var pageInfo = sendRequest("/member-get?cid=" + pageParams.get("cid") + "&mid=" + pageParams.get("mid"));
var competitionParams = sendRequest("/competition-params-get?" + "cid=" + pageParams.get("cid"));
var qualsMap = competitionParams.get("Qualifications");

var memberInfo = new Map();
memberInfo.set( "name",         document.getElementById("member-name"));
memberInfo.set( "divisions",    document.getElementById("member-division"));
memberInfo.set( "age",          document.getElementById("member-age"));
memberInfo.set( "weight",       document.getElementById("member-weight"));
memberInfo.set( "sex",          document.getElementById("member-sex"));
memberInfo.set( "qulification", document.getElementById("member-qulification"));
memberInfo.set( "team",         document.getElementById("member-team"));
memberInfo.set( "id",           document.getElementById("member-id"));
memberInfo.set( "admit",        document.getElementById("member-admit"));

var groupsInfo = new Map();

function groupElementCreate(group){
    if(group.get("id") == undefined) return "";

   /* var template = document.getElementById("member-template").content.cloneNode(true);

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
    return template;*/
    return "";
}

function fillPageInfo(params){
    console.log(params);
    var membersTable = document.getElementById("members-table");

    memberInfo.get("name").innerHTML            = params.get("Name") + " " + params.get("Surname");
    memberInfo.get("id").innerHTML              = "ID: " + params.get("Id");
    memberInfo.get("sex").innerHTML             = params.get("Sex");
    memberInfo.get("age").innerHTML             = params.get("Age") + " years";
    memberInfo.get("weight").innerHTML          = params.get("Weight") + " kg";
    memberInfo.get("team").innerHTML            = params.get("Team");
    memberInfo.get("qulification").innerHTML    = qualsMap.get(params.get("Qualification"));
    memberInfo.get("divisions").innerHTML       = params.get("Divisions");
    memberInfo.get("admit").innerHTML           = params.get("Admit");

    params.get("Groups").forEach(gr => membersTable.append(groupElementCreate(gr)));
}
fillPageInfo(pageInfo);