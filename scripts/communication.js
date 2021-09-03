import {refreshPage, parseAnswerParams, arrayDivider} from "./common.js"

const backendLinks = {
    DEPARTMENT_GET:                     "competition-list-get?",
    DEPARTMENT_INFO_EDIT:               "department-info-edit",
    DEPARTMENT_QUALIFICATION_ADD:       "department-qual-add",
    DEPARTMENT_QUALIFICATION_DEL:       "department-qual-del",
    DEPARTMENT_DISCIPLINE_ADD:          "department-disc-add",
    DEPARTMENT_DISCIPLINE_DEL:          "department-disc-del",
    DEPARTMENT_COMPETITION_ADD:         "department-comp-add",
    DEPARTMENT_SPORTSMEN_GET:           "department-sports-get?",
    DEPARTMENT_SPORTSMEN_EDIT:          "department-sports-edit",
    DEPARTMENT_SPORTSMEN_ADD:           "department-sports-add",
    DEPARTMENT_SPORTSMEN_DEL:           "department-sports-del",

    COMPETITION_GET(cid)                {return "competition-get?cid=" + cid;},
    COMPETITION_INFO_EDIT(cid)          {return "competition-info-edit?cid=" + cid;},
    COMPETITION_SPORTSMEN_ADD(cid)      {return "new-member-form?cid=" + cid;},
    COMPETITION_SPORTSMEN_DEL(cid, sid) {return "competition-member-del?cid=" + cid + "&sid=" + sid;},
    COMPETITION_GROUP_ADD(cid)          {return "new-group-form?cid=" + cid;},
    COMPETITION_GROUP_DEL(cid, gid)     {return "competition-group-del?cid=" + cid;},
    COMPETITION_GROUPS_PAIRS_FORM(cid)  {return "competition-pairs-refresh?cid=" + cid;},
    COMPETITION_MEMBERS_SORT(cid)       {return "competition-members-sort?cid=" + cid;},

    GROUP_GET(cid, gid)                 {return "group-get?cid=" + cid + "&gid=" + gid;},
    GROUP_INFO_EDIT(cid, gid)           {return "group-info-edit?cid=" + cid + "&gid=" + gid;},
    GROUP_SPORTSMENS_ADD(cid, gid)      {return "group-sportsmens-add?cid=" + cid + "&gid=" + gid;},
    GROUP_SPORTSMEN_DEL(cid, gid)       {return "group-sportsmen-del?cid=" + cid + "&gid=" + gid;},
    GROUP_PAIRS_REFRESH(cid, gid)       {return "group-pairs-refresh?cid=" + cid + "&gid=" + gid;},
    GROUP_PAIR_WINNER(cid, gid, pid)    {return "pair-member-win?cid=" + cid + "&gid=" + gid + "&pid=" + pid;},

    SPORTSMEN_GET:                      "member-get?",
    SPORTSMEN_INFO_EDIT:                "member-info-edit",
    SPORTSMEN_GROUP_ADD:                "member-group-add",
    SPORTSMEN_GROUP_DEL:                "member-group-del",

    LOGIN:                              "admin-login",
    CLIENT_STATUS_GET:                  "client-status-get"
};

const departmentOp = {
    getId(dep)             {return dep.get("Id");},
    getName(dep)           {return dep.get("Name");},
    getCompetitions(dep)   {return dep.get("Competitions");},
    getSportsmans(dep)     {return dep.get("Sportsmens");},
    getDisciplines(dep)    {return dep.get("Divisions");},
    getQualifications(dep) {return dep.get("Qualifications");},
}

const competitionOp = {
    getId(comp)             {return comp.get("Id");},
    getName(comp)           {return comp.get("Name");},
    getDescription(comp)    {return comp.get("Description");},
    getSportsmans(comp)     {return comp.get("Sportsmans");},
    getGroups(comp)         {return comp.get("Groups");}
}

const sportsmanOp = {
    getId(sp)               {return sp.get("Id");},
    getName(sp)             {return sp.get("Name");},
    getSurname(sp)          {return sp.get("Surname");},
    getAge(sp)              {return sp.get("Birth");},
    getWeight(sp)           {return sp.get("Weight");},
    getSex(sp)              {return sp.get("Sex");},
    getTeam(sp)             {return sp.get("Team");},
    getQualification(sp)    {return sp.get("Qualification");},
    getAdmition(sp)         {return sp.get("Admited");},
    getDisciplines(sp)      {return sp.get("Disciplines");},
    getGroupsNum(sp)        {return sp.get("Groups_num");},

    setDisciplines(sp,v)    {sp.set("Disciplines", v);},
    setAdmition(sp,v)       {sp.set("Admited", v);},

    getLinkFromDepartament(sp)  {return "/sportsman?sid=" + this. getId(sp);},
    getLinkFromCompetition(sp)  {return "/sportsman?sid=" + this. getId(sp);}
}

const groupOp = {
    getId(gr)           {return gr.get("Id");},
    getName(gr)         {return gr.get("Name");},
    getFormSystem(gr)   {return gr.get("Form_sys");},
    getAgeMin(gr)       {return gr.get("Age_min");},
    getAgeMax(gr)       {return gr.get("Age_max");},
    getWeightMin(gr)    {return gr.get("Weight_min");},
    getWeightMax(gr)    {return gr.get("Weight_max");},
    getQualMin(gr)      {return gr.get("Qualification_min");},
    getQualMax(gr)      {return gr.get("Qualification_max");},
    getSex(gr)          {return gr.get("Sex");},
    getDiscipline(gr)   {return gr.get("Division");},
    getSportsmans(gr)   {return gr.get("Members");},
    getSportsNum(gr)    {return gr.get("Members_num");},
    getPairs(gr)        {return gr.get("Pairs");},
    getLink(gr)         {return "/group?gid=" + this.getId(gr);}
}

const pairsOp = {
    getId(pr)           {return pr.get("Id");},
    getRedSp(pr)        {return pr.get("Sportsman_red");},
    getBlueSp(pr)       {return pr.get("Sportsman_blue");},
    getWinner(pr)       {return pr.get("Winner");},
    getNumber(pr)       {return pr.get("Number");},
    getFinalPart(pr)    {return pr.get("Final_part");},
    getChildPair(pr)    {return pr.get("Child_pair");},
    getGridRow(pr)      {return pr.get("Grid_row");},
    getGridCol(pr)      {return pr.get("Grid_col");},
    setGridRow(pr, v)   { pr.set("Grid_row", v);},
    setGridCol(pr, v)   { pr.set("Grid_col", v);},
    
}

export const ops = {
    department:     departmentOp,
    competition:    competitionOp,
    sportsman:      sportsmanOp,
    group:          groupOp,
    pair:           pairsOp

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

/* ------------------- ACCESS ----------------------------*/

function sendLogin(login, pass){
    var paramsMap = new Map();
    paramsMap.set("login",     login);
    paramsMap.set("password",  pass);
    sendParametersList(backendLinks.LOGIN, paramsMap, true);
}

/* ------------------- DEPARTMENT ----------------------------*/

function addDpSportsman(name, surname, weight, age, team, sex, qual){
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

function addDpCompetition(name, description){
    var params = new Map();
    params.set("competition-name",  name);
    params.set("description",       description);
    sendParametersList(backendLinks.DEPARTMENT_COMPETITION_ADD, params, true);
}

/* ------------------- COMPETITION ----------------------------*/

function addCpSportsmans(cid, spArray){
    var params = new Map();

    spArray.forEach(sp => {
        var value = "admition=" + ops.sportsman.getAdmition(sp) + "<paramDivider>disciplines="
        var disciplines = ops.sportsman.getDisciplines(sp);
        var first = true;
        disciplines.forEach(d => {
            value += first ? d : (arrayDivider + d);
            first = false;
        });
        params.set(ops.sportsman.getId(sp), value);
    });
    console.log(params);
    sendParametersList(backendLinks.COMPETITION_SPORTSMEN_ADD(cid), params, true);
}

function addCpGroup(cid, name, discipline, pairsSystem, 
                        sex, ageMin, ageMax, weightMin, weightMax, qualMin, qualMax){
    var params = new Map();
    params.set("group-name",        name);
    params.set("group-division",    discipline);
    params.set("form-system",       pairsSystem);
    
    if(sex != undefined)
        params.set("sex",               sex);
    if(ageMin != undefined){
        params.set("age-min",           ageMin);
        params.set("age-max",           ageMax);
    }
    if(weightMin != undefined){
        params.set("weight-min",        weightMin);
        params.set("weight-max",        weightMax);
    }
    if(qualMin != undefined){
        params.set("qualification-min", qualMin);
        params.set("qualification-max", qualMax);
    }
    sendParametersList(backendLinks.COMPETITION_GROUP_ADD(cid), params, true);
}

function editCpGroup(cid, gid, name, discipline, pairsSystem, 
    sex, ageMin, ageMax, weightMin, weightMax, qualMin, qualMax){
    var params = new Map();
    params.set("group-name",        name);
    params.set("group-division",    discipline);
    params.set("form-system",       pairsSystem);

    if(sex != undefined)        params.set("sex",               sex);
    if(ageMin != undefined)     params.set("age-min",           ageMin);
    if(ageMax != undefined)     params.set("age-max",           ageMax);
    if(weightMin != undefined)  params.set("weight-min",        weightMin);
    if(weightMax != undefined)  params.set("weight-max",        weightMax);
    if(qualMin != undefined)    params.set("qualification-min", qualMin);
    if(qualMax != undefined)    params.set("qualification-max", qualMax);

    sendParametersList(backendLinks.GROUP_INFO_EDIT(cid, gid), params, true);
}

function editCpInfo(cid, name, desc){
    var params = new Map();
    params.set("competition-name",  name);
    params.set("description",       desc);
    sendParametersList(backendLinks.COMPETITION_INFO_EDIT(cid), params, true);
}




export const server = {
    login(login, pass)                  {sendLogin(login, pass);},
    getClientStatus()                   {return sendRequest(backendLinks.CLIENT_STATUS_GET).get("ClientStatus");},
    
    getDepartment()                     {return sendRequest(backendLinks.DEPARTMENT_GET);},
    editDepartment(name)                {sendSingleValue(backendLinks.DEPARTMENT_INFO_EDIT, name, true);},
    addDepartmentSportsman( name, 
                            surname, 
                            weight, 
                            age, 
                            team,
                            sex,
                            qual)       {addDpSportsman(name, surname, weight, age, team, sex, qual);},
    addQualification(value, name)       {sendSingleValue(backendLinks.DEPARTMENT_QUALIFICATION_ADD, value + " - " + name, true)},
    deleteQualification(value)          {sendSingleValue(backendLinks.DEPARTMENT_QUALIFICATION_DEL, value, true);},
    addDiscipline(name)                 {sendSingleValue(backendLinks.DEPARTMENT_DISCIPLINE_ADD, name, false);},
    deleteDiscipline(name)              {sendSingleValue(backendLinks.DEPARTMENT_DISCIPLINE_DEL, name, false);},
    
    addCompetition(name, desc)          {addDpCompetition(name, desc);},
    getCompetition(cid)                 {return sendRequest(backendLinks.COMPETITION_GET(cid));},
    editCompetition(cid, name, desc)    {editCpInfo(cid, name, desc);},
    sortSportsmans(cid)                 {return sendRequest(backendLinks.COMPETITION_MEMBERS_SORT(cid));},
    addCompetitionSprotsmans(cid, ids)  {addCpSportsmans(cid, ids);},
    
    addGroup(cid, name,
            discipline, pairsSystem, sex,
            ageMin, ageMax,
            weightMin, weightMax,
            qualMin, qualMax)           {addCpGroup(cid, name, discipline, pairsSystem, sex, 
                                            ageMin, ageMax, weightMin, weightMax, qualMin, qualMax)},
    editGroup(cid, gid, 
        name, discipline, 
        pairsSystem, sex, 
        ageMin, ageMax, 
        weightMin, weightMax, 
        qualMin, qualMax)               {editCpGroup(cid, gid, name, discipline, pairsSystem, sex, 
                                            ageMin, ageMax, weightMin, weightMax, qualMin, qualMax)},
    getGroup(cid, gid)                  {return sendRequest(backendLinks.GROUP_GET(cid, gid));},
    delGroup(cid, gid)                  {return sendSingleValue(backendLinks.COMPETITION_GROUP_DEL(cid), gid, false);},

    removeGroupSportsman(cid, gid, sid) {sendSingleValue(backendLinks.GROUP_SPORTSMEN_DEL(cid, gid), sid, false);},
    addGroupSportsList(cid, gid, sids)  {sendSingleValue(backendLinks.GROUP_SPORTSMENS_ADD(cid, gid), sids, true);},
    setPairWinner(cid, gid, pid, color) {sendSingleValue(backendLinks.GROUP_PAIR_WINNER(cid, gid, pid), color, true);},
    refreshPairs(cid, gid)              {return sendRequest(backendLinks.GROUP_PAIRS_REFRESH(cid, gid));}
}