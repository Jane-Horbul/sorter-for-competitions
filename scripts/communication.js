import {refreshPage} from "./common.js"
import {parseAnswerParams} from "./common.js"

const backendLinks = {
    DEPARTMENT_GET:                 "competition-list-get?",
    DEPARTMENT_INFO_EDIT:           "department-info-edit",
    DEPARTMENT_QUALIFICATION_ADD:   "department-qual-add",
    DEPARTMENT_QUALIFICATION_DEL:   "department-qual-del",
    DEPARTMENT_DISCIPLINE_ADD:      "department-disc-add",
    DEPARTMENT_DISCIPLINE_DEL:      "department-disc-del",
    DEPARTMENT_COMPETITION_ADD:     "department-comp-add",
    DEPARTMENT_SPORTSMEN_GET:       "department-sports-get?",
    DEPARTMENT_SPORTSMEN_EDIT:      "department-sports-edit",
    DEPARTMENT_SPORTSMEN_ADD:       "department-sports-add",
    DEPARTMENT_SPORTSMEN_DEL:       "department-sports-del",

    COMPETITION_GET:                "competition-get?",
    COMPETITION_SPORTSMEN_ADD:      "new-member-form",
    COMPETITION_SPORTSMEN_DEL:      "competition-member-del",
    COMPETITION_GROUP_ADD:          "new-group-form",
    COMPETITION_GROUP_DEL:          "competition-group-del",
    COMPETITION_GROUPS_PAIRS_FORM:  "competition-pairs-refresh?",
    COMPETITION_MEMBERS_SORT:       "competition-members-sort?",

    GROUP_GET:                      "group-get?",
    GROUP_INFO_EDIT:                "group-info-edit",
    GROUP_SPORTSMENS_ADD:           "group-sportsmens-add",
    GROUP_SPORTSMEN_DEL:            "group-sportsmen-del",
    GROUP_PAIRS_REFRESH:            "group-pairs-refresh",
    GROUP_PAIR_WINNER:              "pair-member-win?",

    SPORTSMEN_GET:                  "member-get?",
    SPORTSMEN_INFO_EDIT:            "member-info-edit",
    SPORTSMEN_GROUP_ADD:            "member-group-add",
    SPORTSMEN_GROUP_DEL:            "member-group-del",

    LOGIN:                          "admin-login",
    CLIENT_STATUS_GET:              "client-status-get"
};

export const departmentOper = {
    getId(dep)             {return dep.get("Id");},
    getName(dep)           {return dep.get("Name");},
    getCompetitions(dep)   {return dep.get("Competitions");},
    getSportsmans(dep)     {return dep.get("Sportsmens");},
    getDisciplines(dep)    {return dep.get("Divisions");},
    getQualifications(dep) {return dep.get("Qualifications");},
}

export const competitionOper = {
    getId(comp)             {return comp.get("id");},
    getName(comp)           {return comp.get("name");},
    getDescription(comp)    {return comp.get("description");}
}

export const sportsmanOper = {
    getId(sp)               {return sp.get("id");},
    getName(sp)             {return sp.get("name");},
    getSurname(sp)          {return sp.get("surname");},
    getAge(sp)              {return sp.get("birth");},
    getWeight(sp)           {return sp.get("weight");},
    getSex(sp)              {return sp.get("sex");},
    getTeam(sp)             {return sp.get("team");},
    getQualification(sp)    {return sp.get("qualification");},

    getLinkFromDepartament(sp)  {return "/sportsman?sid=" + sp.get("id");}
}

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
    sendParametersList(backendLinks.LOGIN, paramsMap, true);
}

export function sendGetClientStatus(){
    return sendRequest(backendLinks.CLIENT_STATUS_GET).get("ClientStatus");;
}

export function sendGetDepartment(){
    return sendRequest(backendLinks.DEPARTMENT_GET);
}

export function sendAddQualification(value, name){
    sendSingleValue(backendLinks.DEPARTMENT_QUALIFICATION_ADD, 
                        value + " - " + name, true)
}

export function sendDeleteQualification(value){
    sendSingleValue(backendLinks.DEPARTMENT_QUALIFICATION_DEL, value, true);
}

export function sendAddDiscipline(discip){
    sendSingleValue(backendLinks.DEPARTMENT_DISCIPLINE_ADD, discip, false);
}

export function sendDeleteDiscipline(discip){
    sendSingleValue(backendLinks.DEPARTMENT_DISCIPLINE_DEL, discip, false);
}

export function sendDepartmentInfo(name){
    sendSingleValue(backendLinks.DEPARTMENT_INFO_EDIT, name, true);
}

export function sendDepartmentSportsman(name, surname, weight, age, team, sex, qual){
    var params = new Map();
    params.set("member-name",    name);
    params.set("member-surname", surname);
    params.set("member-weight",  weight);
    params.set("member-age",     age);
    params.set("member-team",    team);
    params.set("member-sex",     sex);
    params.set("member-qual",    qual);
    
    sendParametersList(backendLinks.DEPARTMENT_SPORTSMEN_ADD, params, true);
}

export function sendDepartmentCompetition(name, description){
    var params = new Map();
    params.set("competition-name",  name);
    params.set("description",       description);
    sendParametersList(backendLinks.DEPARTMENT_COMPETITION_ADD, params, true);
}
