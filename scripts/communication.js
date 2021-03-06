import {refreshPage} from "./common.js"
import {parseAnswerParams} from "./common.js"

const backendLinks = new Map();
backendLinks.set("DEPARTMENT_GET",                  "competition-list-get?");
backendLinks.set("DEPARTMENT_INFO_EDIT",            "department-info-edit");
backendLinks.set("DEPARTMENT_QUALIFICATION_ADD",    "department-qual-add");
backendLinks.set("DEPARTMENT_QUALIFICATION_DEL",    "department-qual-del");
backendLinks.set("DEPARTMENT_DISCIPLINE_ADD",       "department-disc-add");
backendLinks.set("DEPARTMENT_DISCIPLINE_DEL",       "department-disc-del");
backendLinks.set("DEPARTMENT_COMPETITION_ADD",      "department-comp-add");
backendLinks.set("DEPARTMENT_SPORTSMEN_GET",        "department-sports-get?");
backendLinks.set("DEPARTMENT_SPORTSMEN_EDIT",       "department-sports-edit");
backendLinks.set("DEPARTMENT_SPORTSMEN_ADD",        "department-sports-add");
backendLinks.set("DEPARTMENT_SPORTSMEN_DEL",        "department-sports-del");

backendLinks.set("COMPETITION_GET",                 "competition-get?");
backendLinks.set("COMPETITION_SPORTSMEN_ADD",       "new-member-form");
backendLinks.set("COMPETITION_SPORTSMEN_DEL",       "competition-member-del");
backendLinks.set("COMPETITION_GROUP_ADD",           "new-group-form");
backendLinks.set("COMPETITION_GROUP_DEL",           "competition-group-del");
backendLinks.set("COMPETITION_GROUPS_PAIRS_FORM",   "competition-pairs-refresh?");
backendLinks.set("COMPETITION_MEMBERS_SORT",        "competition-members-sort?");

backendLinks.set("GROUP_GET",                       "group-get?");
backendLinks.set("GROUP_INFO_EDIT",                 "group-info-edit");
backendLinks.set("GROUP_SPORTSMENS_ADD",            "group-sportsmens-add");
backendLinks.set("GROUP_SPORTSMEN_DEL",             "group-sportsmen-del");
backendLinks.set("GROUP_PAIRS_REFRESH",             "group-pairs-refresh");
backendLinks.set("GROUP_PAIR_WINNER",               "pair-member-win?");

backendLinks.set("SPORTSMEN_GET",                   "member-get?");
backendLinks.set("SPORTSMEN_INFO_EDIT",             "member-info-edit");
backendLinks.set("SPORTSMEN_GROUP_ADD",             "member-group-add");
backendLinks.set("SPORTSMEN_GROUP_DEL",             "member-group-del");


backendLinks.set("LOGIN",                           "admin-login");
backendLinks.set("CLIENT_STATUS_GET",               "client-status-get");

function sendRequest(request) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', request, false);
    xhr.send();
    if (xhr.status != 200)   return new Map();
    return parseAnswerParams(xhr.responseText);
}

function sendParametersList(formName, paramsMap, refresh) {
    var xhr = new XMLHttpRequest();
    var boundary = String(Math.random()).slice(2);
    var body = ['\r\n'];
    paramsMap.forEach(function(value, key) {
        body.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + value + '\r\n');
    });
    body = body.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';


    xhr.onreadystatechange = function () {
        if(refresh == true && xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            refreshPage();
        };
    };
    xhr.open('POST', "/" + formName, true);
    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    xhr.send(body);
    return true;
}

function sendSingleValue(link, value, refresh){
    var paramsMap = new Map();
    paramsMap.set(link, value);
    sendParametersList(link, paramsMap, refresh);
}

export function sendLogin(login, pass){
    var paramsMap = new Map();
    paramsMap.set("login",     login);
    paramsMap.set("password",  pass);
    sendParametersList(backendLinks.get("LOGIN"), paramsMap, true);
}

export function sendGetClientStatus(){
    return sendRequest(backendLinks.get("CLIENT_STATUS_GET")).get("ClientStatus");;
}

export function sendGetDepartment(){
    return sendRequest(backendLinks.get("DEPARTMENT_GET"));
}

export function sendAddQualification(value, name){
    sendSingleValue(backendLinks.get("DEPARTMENT_QUALIFICATION_ADD"), 
                        value + " - " + name, true)
}

export function sendDeleteQualification(value){
    sendSingleValue(backendLinks.get("DEPARTMENT_QUALIFICATION_DEL"), value, true);
}

export function sendAddDiscipline(discip){
    sendSingleValue(backendLinks.get("DEPARTMENT_DISCIPLINE_ADD"), discip, false);
}

export function sendDeleteDiscipline(discip){
    sendSingleValue(backendLinks.get("DEPARTMENT_DISCIPLINE_DEL"), discip, false);
}

export function sendDepartmentInfo(name){
    sendSingleValue(backendLinks.get("DEPARTMENT_INFO_EDIT"), name, true);
}

export function sendDepartmentSportsmen(name, surname, weight, age, team, sex, qual){
    var params = new Map();
    params.set("member-name",    name);
    params.set("member-surname", surname);
    params.set("member-weight",  weight);
    params.set("member-age",     age);
    params.set("member-team",    team);
    params.set("member-sex",     sex);
    params.set("member-qual",    qual);
    
    sendParametersList(backendLinks.get("DEPARTMENT_SPORTSMEN_ADD"), params, true);
}

export function sendDepartmentCompetition(name, description){
    var params = new Map();
    params.set("competition-name",  name);
    params.set("description",       description);
    sendParametersList(backendLinks.get("DEPARTMENT_COMPETITION_ADD"), params, true);
}
